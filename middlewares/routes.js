var gitApi = require('./github-api.js');
const environment = require('../environment.js');
var rp = require('request-promise');
const { parse } = require('querystring');

var isLogged = function(req){
  var token = req.cookies[environment.COOKIE_NAME];
  var logged = false;
  //Check if token exists
  if(token){
    logged = true;
    console.log("User is logged in");
  }else{
    console.log("No user logged");
  }
  return logged;
}

module.exports = function(app, client){

  //CallBack de l'OAuth Github
  app.get('/callback', function(req,res,next){
    console.log("Callback authentication from GitHub");
    if(req.query && req.query.code){
      //Getting token
      gitApi.getToken(req.query.code)
        .then((body)=>{
          var bodyParsed = parse(body);
          if(bodyParsed.access_token){
            //Setting token in cookie
            res.cookie(environment.COOKIE_NAME, bodyParsed.access_token);
            console.log("Token set");
          }
          //Redirecting
          console.log("Redirecting to index");
          res.redirect('/');
        })
        .catch((error) => {
          console.log("Error retrieving token from API");
          console.log("Redirecting to index");
          res.redirect('/');
        });
    }else{
      console.log("Error retrieving temporary code from GitHub API");
      console.log("Redirecting to index");
      res.redirect('/');
    }
  });

  //Redigirige vers la page d'OAuth GitHub
  app.get('/authenticate', function(req,res){
    console.log("Authenticating through GitHub");
    res.redirect(environment.GITHUBAPICONFIG.AUTHORIZE_URL+"?client_id="+environment.GITHUBAPICONFIG.CLIENT_ID+"&scope="+environment.GITHUBAPICONFIG.AUTHORIZE_SCOPES);
  });

  //Logout
  app.get('/logout',function(req,res){
    console.log("Clearing cookie");
    //Suppression du cookie
    res.clearCookie(environment.COOKIE_NAME);
    console.log("Redirecting to index");
    res.redirect('/');
  });

  app.get('/refresh', function(req, res){
    //Récupération des repos GitHub Trending depuis l'API
    gitApi.searchRepos("stars:>=500", "stars", "desc", "100", "1")
      .then((body) => {
        console.log("Call successful, storing in redis and rendering index");
        //Storing results in redis
        client.set(environment.REDIS_REPOS_KEY, JSON.stringify(body.items));
        res.redirect('/');
      });
  });

  app.get('/rate', function(req, res, next){
    //Checking if user is logged
    if(isLogged(req)){
      //Going to next handler
      next();
    }else{
      //Authentication needed
      res.status(401);
      res.send("User needs to be logged in");
    }
  })
  .get('/rate', function(req,res){
    console.log("Trying to star repo");
    //Checking parameter
    if(!req.query.fullname){
      res.status(400);
      res.send("Missing repo parameter");
    }
    console.log("Starring repo " + req.query.fullname);
    //Calling api
    gitApi.rate(req.query.fullname, req.cookies[environment.COOKIE_NAME])
      //Starring worked
      .then(() => {
        console.log("Starring worked");
        res.send("You starred this repo !");
      })
      //Starring failed
      .catch(() => {
        console.log("Starring failed");
        res.status(400);
        res.send("Starring didn't work");
      });
  });

  //Point d'entrée de l'application
  app.get('/', function(req, res) {
    console.log("Going to Index");
    //Récupération du token dans les cookies
    var logged = isLogged(req);
    //Récupération des repos trending depuis redis
    console.log("Trying to get repos from redis");
    client.get(environment.REDIS_REPOS_KEY, function(err, reply){
      if(reply){
        var repos = JSON.parse(reply);
        console.log("Found repos in redis, rendering index");
        res.render('pages/index', {repos: repos, logged: logged});
      }else{
        console.log("No repos in redis, calling api");
        //Récupération des repos GitHub Trending depuis l'API
        gitApi.searchRepos("stars:>=500", "stars", "desc", "100", "1")
          .then((body) => {
            console.log("Call successful, storing in redis and rendering index");
            client.set(environment.REDIS_REPOS_KEY, JSON.stringify(body.items));
            res.render('pages/index', {repos: body.items, logged: logged});
          });
      }
    });
  });

}
