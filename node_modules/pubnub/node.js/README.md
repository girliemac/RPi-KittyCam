# PubNub Node.JS SDK and NPM 

PubNub for JS Docs have been moved to: http://www.pubnub.com/docs/javascript/javascript-sdk.html

## PubNub Node.js Quick Usage

Open `./tests/unit-test.js` to see examples for all the basics,
plus `history()`, `presence()` and `here_now()`! 
Report an issue, or email us at support if there are any
additional questions or comments.

#### NPM Install

```
npm install pubnub
```

#### Example Usage

```javascript
var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo"
});

/* ---------------------------------------------------------------------------
Publish Messages
--------------------------------------------------------------------------- */
var message = { "some" : "data" };
pubnub.publish({ 
    channel   : 'my_channel',
    message   : message,
    callback  : function(e) { console.log( "SUCCESS!", e ); },
    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
});

/* ---------------------------------------------------------------------------
Listen for Messages
--------------------------------------------------------------------------- */
pubnub.subscribe({
    channel  : "my_channel",
    callback : function(message) {
        console.log( " > ", message );
    }
});

/* ---------------------------------------------------------------------------
Type Console Message
--------------------------------------------------------------------------- */
var stdin = process.openStdin();
stdin.on( 'data', function(chunk) {
    pubnub.publish({
        channel : "my_channel",
        message : ''+chunk
    });
});


```
