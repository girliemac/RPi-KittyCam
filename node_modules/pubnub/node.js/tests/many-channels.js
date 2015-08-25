var PUBNUB   = require('../pubnub.js')
var pubnubs  = {};
var received = 0;

function subscribe(channel) {

    /*
        create container
    */
};



(new Array(100)).join().split(',').forEach(function( _, a ){ setTimeout(function(){
    var channel = 'channel-'+a;
    pubnubs[channel] = create_pubnub(channel);
    pubnubs[channel].subscribe({
        channel : channel,
        message : message,
        connect : function() {
            console.log( 'connected! ',channel );
            setTimeout( function(){ pubit(channel) }, 1000 );
        }
    })
},a*300);});

function pubit(channel) {
    pubnubs[channel].publish({
        channel : channel,
        message : channel
    });
}

function create_pubnub(channel) {
    return PUBNUB.init({
        origin : uuid().split('-')[4] + '.pubnub.com'
    });
}


function error(result) {
    console.log( 'Error with', result  )
}

function message(result) {
    received++;
    console.log( received, 'RECEIVED!', result );
}
function uuid(callback) {
    var u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    if (callback) callback(u);
    return u;
}
