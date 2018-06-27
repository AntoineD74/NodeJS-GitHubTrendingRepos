const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const redis = require('redis');

var app = express();
var cookieParser = require('cookie-parser');
const client = redis.createClient(process.env.REDIS_URL);

app.use(cookieParser());

var routes = require('./middlewares/routes')(app, client);

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
