/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var pubnub = require("./../pubnub.js").init({
    publish_key   : "pam",
    ssl : true,
    subscribe_key : "pam",
    secret_key : "pam"
});

function log(r) {
    console.log(JSON.stringify(r));
}

/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */

pubnub.grant({
    channel  : "foo.*",
    callback : log,
    error    : log,
    auth_key     : "abcd"
});

