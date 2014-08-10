var app, store, sock,
    http = require('http'),
    express = require('express'),
    sockjs = require('sockjs'),
    redis = require("redis"),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');


sock = sockjs.createServer();

function push (msg) {
  store.lpush('actions', msg, redis.print);
  return msg;
}

sock.on('connection', function(conn) {
  conn.on('data', function(msg) {
    conn.write(push(msg));
  });

  conn.on('close', function() {});
});


app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());          // simulate DELETE and PUT
app.set('port', process.env.PORT || 9999);

app.get('/session', function (req, res) {
  store.lrange('actions', 0, -1, function (err, result) {
    res.send(result.map(JSON.parse));
  });
});


if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  store = redis.createClient(rtg.port, rtg.hostname);
  store.auth(rtg.auth.split(":")[1]);
} else {
  store = redis.createClient();
}

store.on('ready', function () {
  var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

  //sock.installHandlers(server, {prefix: 'socket'});
});
