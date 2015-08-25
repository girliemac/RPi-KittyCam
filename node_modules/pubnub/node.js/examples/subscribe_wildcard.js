/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var pubnub = require("./../pubnub.js").init({
    publish_key   : "ds",
    subscribe_key : "ds"
});


/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */



function subscribe(channel) {
    pubnub.subscribe({
        'channel' : channel,
        'connect' : function(c) {
            console.log('CONNECTED to ' + c);
        },
        'disconnect' : function(c) {
            console.log('CONNECTED to ' + c);
        },
        'reconnect' : function(c) {
            console.log('CONNECTED to ' + c);
        },
        'error' : function(e) {
            console.log('ERROR  ' + JSON.stringify(r));
        },
        'callback' : function(m,a,subscribed_channel,c,real_channel) {
            console.log(JSON.stringify(m));
            console.log(JSON.stringify(subscribed_channel));
            console.log(JSON.stringify(real_channel));
        }
    })
}
subscribe("ab.*");
//console.log(process.argv.slice(2));
