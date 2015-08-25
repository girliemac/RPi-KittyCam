var pubnub = require("./../pubnub.js").init({
    publish_key     : 'demo',
    subscribe_key   : 'demo',
    cipher_key      : 'enigma'
});

function publish(msg) {
    pubnub.publish({
        'channel' : 'abcd',
        'message' : msg,
        'callback' : function(r) {
            console.log(JSON.stringify(r));
        },
        'error'  : function(r) {
            console.log(JSON.stringify(r));
        }
        
    })
}

publish(1);             // int
publish(1.2);           // double
publish("1");           // string
publish("abcd");        // string
publish(["1", "a"]);    // array
publish({"a" : 1});     // object
publish('["1", "a"]')   // string
publish('{"a" : 1}')    // string