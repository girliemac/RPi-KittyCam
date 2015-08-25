/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var pubnub = require("./../pubnub.js").init({
    publish_key   : "demo",
    ssl : true,
    subscribe_key : "demo"
});


/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */

function publish(channel, msg) {
pubnub.publish({
    channel  : channel,
    message  : msg,
    callback : log,
    error    : retry
});
}
function log(e) { console.log(e) }
function retry() { console.log('retry?') }


for (var i = 1; i < 2; i++) {
    publish('dsm-test',i);
}
