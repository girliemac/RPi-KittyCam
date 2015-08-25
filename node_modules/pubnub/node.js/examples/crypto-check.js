/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var PUBNUB = require("../pubnub.js")

var pubnub = PUBNUB({
    publish_key   : "demo",
    subscribe_key : "demo"
});


var pubnub_enc = PUBNUB({
    publish_key   : "demo",
    subscribe_key : "demo",
    cipher_key : "demo"
});


pubnub.subscribe({
    channel  : "abcd",
    callback : function(message) {
        console.log( typeof message + " > " + JSON.stringify(message) );
    },
    error : function(r) {
       console.log(JSON.stringify(r));
    },

});

pubnub_enc.subscribe({
    channel  : "abcd-enc",
    callback : function(message) {
        console.log( 'enc : ' + typeof message + " > " + JSON.stringify(message) );
    },
    error : function(r) {
       console.log(JSON.stringify(r));
    },

});

