/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */
var pubnub  = require("./../pubnub.js");
var network = pubnub.init({
    publish_key   : "demo",
    subscribe_key : "demo",
    secret_key    : "",
    ssl           : true,
    origin        : "pubsub.pubnub.com"
});

var delivery_count = 0;
//var crazy          = ' ~`!@#$%^&*(顶顅Ȓ)+=[]\\{}|;\':"./<>?abcd'
var crazy          = ' ~`!@#$%^&*(顶顅Ȓ)+=[]\\{}|;\':"./<>abcd'

/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */
network.subscribe({
    channel  : "hello_world",
    connect  : function() {

        console.log('connected');

        // Publish a Message on Connect
        network.publish({
            channel  : "hello_world",
            message  : {
                count    : ++delivery_count,
                some_key : "Hello World!",
                crazy    : crazy
            },
            error : function(info){
                console.log(info);
            },
            callback : function(info){
                if (!info[0]) console.log("Failed Message Delivery")

                console.log(info);

                network.history({
                    channel  : "hello_world",
                    limit    : 1,
                    callback : function(messages){
                        // messages is an array of history.
                        console.log(messages);
                    }
                });
            }
        });
    },
    callback : function(message) {
        console.log(message);
        console.log('MESSAGE RECEIVED!!!');
    },
    error    : function() {
        console.log("Network Connection Dropped");
    }
});

/* ---------------------------------------------------------------------------
Utility Function Returns PubNub TimeToken
--------------------------------------------------------------------------- */
network.time(function(time){
    console.log(time);
});
