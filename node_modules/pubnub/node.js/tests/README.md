# PubNub Pool for Many Channels

The pool manager will allow you to subscribe to more
channels than the maximum recommended.

```javascript
// Init
var pubnub = require('./pnpool')( 25, {
    publish_key   : 'demo',
    subscribe_key : 'demo'
} );

// Subscribe to Many Channels
pubnub(channel).subscribe({
    channel : channel,
    message : function(msg) { console.log(msg },
});

// Send Message
pubnub(channel).publish({
    channel : channel,
    message : channel
});

```
