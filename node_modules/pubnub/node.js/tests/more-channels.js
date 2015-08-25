var test_channel_count = 1000;
var pubnub             = require('./pnpool')( 30, {
    publish_key   : 'demo',
    subscribe_key : 'demo'
} );

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Subscribe/Publish Many Channels
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var channel_count = 0;
(new Array(test_channel_count)).join().split(',').forEach(function(_,a){
    var channel = 'channel-'+(a+1);

    // Subscribe
    pubnub(channel).subscribe({
        channel : channel,
        message : message,
        connect : function() {
            console.log( 'connected to', ++channel_count, 'channels' );
            setTimeout( function() {

                // Send Message
                pubnub(channel).publish({
                    channel : channel,
                    message : channel
                });

            }, 100 * a );
        }
    });
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Printing
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var received  = 0;
function message(result) {
    received++;
    console.log( received, 'RECEIVED!', result );
}
