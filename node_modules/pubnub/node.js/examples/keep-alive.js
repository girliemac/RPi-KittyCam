// see current sockets using 'netstat -tonpc'
var Pubnub = require('../pubnub'),
    conf = {
      publish_key: 'demo',
      subscribe_key: 'demo'
    },
    i = 20,
    timeout = 501,
    p;

p = Pubnub.init(conf);

function publish(i) {
  p.publish({
    channel: 'somechannel',
    message: 'hey' + i,
    callback: function (result) {
      console.log(result);
    }
  });

  if (i-- !== 0) {
    setTimeout(function () {
      publish(i);
    }, timeout);
  }
}

publish(i);
