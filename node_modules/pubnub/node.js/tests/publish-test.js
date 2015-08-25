var pubnub = require('../pubnub.js').init({})

function error(result) {
    console.log( 'Error with', result  )
}

console.log('Publishing... Waiting for Result!\n')

pub({ 'hah' : 'lol' });
pub({ 'hah?' : 'lol' });

function pub(msg) {
    pubnub.publish({
        channel  : 'bbq',
        message  : msg,
        callback : function(result){ console.log(result) },
        error    : error
    })
}

