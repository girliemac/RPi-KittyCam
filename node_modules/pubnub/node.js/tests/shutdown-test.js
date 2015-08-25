var Pubnub = require('../pubnub'),
    pubnub = Pubnub.init({
        publish_key   : 'demo',
        subscribe_key : 'demo'
    }),
    pubnub2 = Pubnub.init({
        publish_key   : 'demo',
        subscribe_key : 'demo'
    });

pubnub.subscribe({
    channel: 'demo',
    connect: function () {
        pubnub.publish({
            channel: 'demo',
            message: 'hello'
        });
    },
    callback: function (message) {
        console.log(message);
        pubnub.unsubscribe({
            channel: 'demo'
        });
    }
});

pubnub2.stop_timers();