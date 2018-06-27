# NodeJS-GitHubTrendingRepos

Projet scolaire, Majeure NodeJS - Développé par Antoine Dancre

Créé à partir du repo node-js-getting-started, utilise Heroku et Redis.

Application déployée sur Heroku à l'addresse [https://guarded-inlet-19985.herokuapp.com/](https://guarded-inlet-19985.herokuapp.com/)

Fonctionnalités :
- Récupère les 100 repos GitHub ayant le plus d'étoiles et les stocke en cache via redis
- Authentification via l'api GitHub
- Possibilité de starrer un repo une fois authentifié


## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

You need to have a redis-server running locally to make this work.

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Don't forget to configure the Heroku Redis addon to make this work.

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
