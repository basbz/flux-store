var redis = require('redis'),
    expect = require("chai").expect;

var key = 'test-events';

describe("Event Store", function () {
  it("can store events", function (done) {
    var store = redis.createClient();

    store.on('ready', function () {
      store.rpush(key, JSON.stringify({name: 'Vivek'}), function () {
        store.lrange(key, -1, -1, function (err, res) {
          var item = JSON.parse(res[0]);

          expect(item.name).to.equal('Vivek');
          store.del(key, done);
        });
      });
    });
  });
});
