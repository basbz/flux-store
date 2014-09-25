var app, store, log = console.log.bind(console),
    redis = require("redis"),
    express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


//function push (msg) {
  //store.lpush('actions', msg, redis.print);
  //return msg;
//}

app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3030);
//app.use(methodOverride());          // simulate DELETE and PUT

// development only
if ('development' == app.get('env'))
 app.use(require('errorhandler')());


function CORS(origin, methods) {
  return function (__, res, next) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header('Access-Control-Allow-Methods', [].concat(methods).join(', '));
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    next();
  };
}

app.options('/event/:address', CORS('*', 'POST'), function (req, res) {
  res.send(200);
});

app.post('/event/:address', bodyParser.json(), CORS('*', 'POST'), function (req, res) {
  var data = ([].concat(req.body)).map(JSON.stringify);

  store.rpush.apply(store, [req.params.address].concat(data), function (err) {
    if(err)
      res.send(500);

    res.send(200);
  });
});

store = redis.createClient();

store.on('ready', function boot () {
  var port = app.get('port');

  app.listen(port, log.bind(null, 'Express server listening on port:' + port));
});
