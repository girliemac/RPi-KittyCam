/* ---------------------------------------------------------------------------

    Init PubNub and Get your PubNub API Keys:
    http://www.pubnub.com/account#api-keys

--------------------------------------------------------------------------- */

var pubnub = require("./../pubnub.js").init({
    publish_key   : "demo",
    subscribe_key : "demo",
    proxy : { hostname : '192.168.11.50' , port : 8888 }
});


/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */

pubnub.publish({
    channel  : "hello_world",
    message  : "Hello World !!!",
    callback : function(r) { console.log(JSON.stringify(r));},
    error : function(r) { console.log(JSON.stringify(r));}
});

