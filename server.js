var express = require('express'),
    redis = require("redis").createClient(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


//function push (msg) {
  //store.lpush('actions', msg, redis.print);
  //return msg;
//}

function boot (store)  {
  var app = express();
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride());          // simulate DELETE and PUT
  app.set('port', process.env.PORT || 9999);

  app.post('/session', function (req, res) {
    console.log(arguments);
    res.send({ok: true});
  });
}

redis.on('ready', boot.bind(null, redis));
