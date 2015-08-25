

var PUBNUB = require("../pubnub.js")

var pubnub = PUBNUB({
    publish_key   : "demo",
    subscribe_key : "demo"
});

var pnGcmMessage = pubnub.getGcmMessageObject({"key" : "I am gcm message"});
var pnApnsMessage = pubnub.getApnsMessageObject({"key" : "I am apns message", "key2" : "I am key 2"});

var pnmessage = pubnub.getPnMessageObject(pnApnsMessage, pnGcmMessage, { "key" : "this is native"});
var pnmessage1 = pubnub.getPnMessageObject(null, pnGcmMessage, { "key" : "this is native"});
var pnmessage2 = pubnub.getPnMessageObject(pnApnsMessage, null, { "key" : "this is native"});
var pnmessage3 = pubnub.getPnMessageObject(pnApnsMessage, pnGcmMessage, null);

pubnub.subscribe({
    'channel' : 'abcd',
    'connect' : function(r) {
        pubnub.publish({
            channel : 'abcd',
            message : pnmessage,
            callback : function(r) {
                console.log(r);
            },
            'error' : function(r) {
                console.log(JSON.stringify(r));
            }
        });
        pubnub.publish({
            channel : 'abcd',
            message : pnmessage1,
            callback : function(r) {
                console.log(r);
            },
            'error' : function(r) {
                console.log(JSON.stringify(r));
            }
        });
        pubnub.publish({
            channel : 'abcd',
            message : pnmessage2,
            callback : function(r) {
                console.log(r);
            },
            'error' : function(r) {
                console.log(JSON.stringify(r));
            }
        });
        pubnub.publish({
            channel : 'abcd',
            message : pnmessage3,
            callback : function(r) {
                console.log(r);
            },
            'error' : function(r) {
                console.log(JSON.stringify(r));
            }
        });
    },
    'callback' : function(r) {
        console.log(JSON.stringify(r));
    },
    'error' : function(r) {
        console.log(JSON.stringify(r));
    }
})

var PNmessage = require("../pubnub.js").PNmessage

var a = PNmessage()

console.log(a);
