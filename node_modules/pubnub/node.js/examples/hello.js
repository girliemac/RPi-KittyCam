/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var pubnub = require("../pubnub.js")

var p = pubnub.init({
    "subscribe_key" : "new-pam",
    "publish_key" : "new-pam",
    "secret_key" : "new-pam",
    "params" : {},
});

p.publish({
    "message" : "foo",
    "channel" : "bar",
});

p.publish({
    "message" : "foo",
    "channel" : "bar",
});

p.grant({
    "callback" : function (m) { console.log(m); },
    "error" : function (e) { console.error(e); },
});