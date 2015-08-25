# PubNub SDK 4.0 Future Feature Spec

This is a guide and a roadmap plan for **V2 Subscribe** `"SDK v4.0"`
which implements new features for higher performance
throughput and reliability.

## New Feature List

 - **Journey Analytics**
   - The details of a messages journey over time.
 - **Auto-Republish on Failed Publish**
   - Automatically re-publish messages intended to be sent.
 - **Simultaneous MultiGeo Connectivity**
   - Automatic instant zero-downtime connectivity under failure conditions.
   - Configuration options for region residence(s) of connectivity.
 - **De-duplication**
   - The new Subscribe `V2` will deliver possible duplicates with the benefit
     of significant higher message deliverability.
   - Therefore de-duplication mechanisms are automatic.
   - Also with multi-always-on Geo Connections, messages are received more than
     once and will require bubbling only the first message to the user while
     discarding any duplicate messages.
 - **Enhanced SDK API Interface**
   - Simplified SDK interface provides easier usage and manageability.

## Existing Features to Keep/Enhance

 - **Multiplexing**
   - Automatic TCP Multiplexing with all Channels per Connection.

## *Depricated* Features

 - **DNS Cache Bursting**
   - Because Simultaneous MultiGeo Connectivity and Failover
     provides a `zero-downtime` solution, DNS Cache Bursting
     has little value and is no longer necessary.

## Envelope Format Example

```javascript
{
    service : "subscribe",
    status  : 200,
    error   : false,
    message : "details",
    payload : [
        { channel   : "my_channel",
          data      : PAYLOAD,
          timetoken : "13437561957685947" },
        { channel   : "my_channel",
          data      : PAYLOAD,
          timetoken : "13437561955648731" }
    ]
}
```

## SDK API

The following is a new guide for the interfaces available
in the new 4.0 SDK.

```javascript
// Setup
var pubnub = new PubNub({
    connections   : 4,            // Simultaneous MultiGeo Connections
    subscribe_key : "demo",       // Subscribe Key
    publish_key   : "demo",       // Publish Key
    secret_key    : "demo",       // Secret Key for Admin Auth
    auth_key      : "auth",       // Auth Key for PAM R/W
    cipher_key    : "pass",       // AES256 Cipher
    user_id       : "abcd",       // ID associated with User for Presence
    windowing     : 10,           // (ms) Bundle and Order Window
    drift_check   : 10,           // (s)  Re-calculate Time Drift
    timeout       : 310,          // (s)  Max Seconds to Force Reconnect
    ssl           : false,        // SSL on or off?
    analytics     : 'analytics',  // Channel to Save Analytic Journey
    presence      : presence,     // onPresence Events Received
    message       : message,      // onMessage Receive
    log           : log,          // onAny Activity Log for Debugging
    idle          : idle,         // onPing Idle Message (Layer 8 Pings)
    error         : error,        // onErrors
    connect       : connect,      // onConnect
    reconnect     : reconnect,    // onReconnect
    disconnect    : disconnect    // onDisconnect
});

// Add Channels
pubnub.subscribe([ 'a', 'b', 'c' ]);

// Remove 'a' Channel
pubnub.unsubscribe([ 'a' ]);

// Remove All Channels
pubnub.unsubscribe_all();

// Add 'a' Channel
pubnub.subscribe([ 'a' ]);

// Send a Message
pubnub.publish({ channel : "a", message : "hi!" });

// Get/Set Cipher Key
pubnub.cipher_key();
pubnub.cipher_key("password");

// Disable Cipher Key
pubnub.disable_cipher();

// Get/Set Auth Key
pubnub.auth_key();
pubnub.auth_key("password");

// Get/Set User ID
pubnub.user_id();
pubnub.user_id("abcd");


```
