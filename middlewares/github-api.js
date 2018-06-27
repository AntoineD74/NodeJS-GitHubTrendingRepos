
//Récupération des variables d'environnement
var environment = require('../environment.js');
var rp = require('request-promise');

//Generates options to call the api
var getOptions = function(path,token){
  if(!token){
    //Options without Authorization header
    return {
      uri: environment.GITHUBAPICONFIG.APIBASEURL+path,
      headers: {
        'User-Agent': environment.GITHUBAPICONFIG.APPNAME
      },
      json: true
    }
  }else{
    //Options with Authorization header
    return {
      uri: environment.GITHUBAPICONFIG.APIBASEURL+path,
      headers: {
        'User-Agent': environment.GITHUBAPICONFIG.APPNAME,
        'Authorization': 'token '+token
      },
      json: true
    }
  }

};

//Contains the calls to the Github api
module.exports = {
  //Function to test basic api call
  testApiCall : function(){
    console.log("Testing call to GitHub API");
    var options = getOptions("zen");
    return rp(options)
      .catch((err) => {
        console.log("Call failed with error : " + err);
      });
  },
  //Retrieves trending repos
  searchRepos : function(q, sort, order, perpage, page){
    console.log("Querying GitHub api for trending repos");
    var options = getOptions("search/repositories?q=" + q + "&sort=" + sort + "&order=" + order + "&per_page=" + perpage + "&page=" + page, null);
    return rp(options);
  },
  //Get the token from the temporary code
  getToken: function(code){
    console.log("Querying GitHub api for JWT");
    return rp.post("https://github.com/login/oauth/access_token?client_id="+environment.GITHUBAPICONFIG.CLIENT_ID+"&client_secret="+environment.GITHUBAPICONFIG.CLIENT_SECRET+"&code="+code);
  },
  //Allows to rate a repo, authentication required
  rate: function(fullname, token){
    console.log("Starring repo "+ fullname);
    var options = getOptions("user/starred/"+fullname, token);
    console.log(options);
    return rp.put(options);
  }

}
