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
    channel  : ["foo","woo"],
    callback : log,
    error    : log,
    auth_key : "abcd"
});

pubnub.grant({
    channel  : "ab,cb",
    callback : log,
    error    : log,
    auth_key : "abcd"
});


pubnub.grant({
    channel  : "foo1",
    callback : log,
    error    : log,
    auth_key : "abcd, efgh"
});

pubnub.grant({
    channel  : "foo2",
    callback : log,
    error    : log,
    auth_key : ["ab1","cd1"]
});