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

app.options('/event', CORS('*', 'POST'), function (req, res) {
  res.send(200);
});

app.post('/event', bodyParser.json(), CORS('*', 'POST'), function (req, res) {
  log(req.body);
  res.send(200);
});

store = redis.createClient();

store.on('ready', function boot () {
  var port = app.get('port');

  app.listen(port, log.bind(null, 'Express server listening on port:' + port));
});
