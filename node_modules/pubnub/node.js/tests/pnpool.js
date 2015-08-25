var PUBNUB    = require('../pubnub.js')
var CHANNELS  = {};
var currentpn = null;
var totalpn   = 0;
var setup     = {};
var countpn   = 0;
var grouppn   = 0; // Channels Per PN Instance
var received  = 0;

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// PubNub Pooling Creator
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
module.exports = function( pool_size, settings ) {
    setup   = settings;
    grouppn = pool_size;

    return get_pubnub;
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// PubNub Pooling
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function get_pubnub(channel) {
    if (channel in CHANNELS) return CHANNELS[channel];

    // Create a new PN Instance
    if (!(countpn++ % grouppn)) {
        var settings    = clone(setup);
        settings.origin = uuid().split('-')[4] + '.pubnub.com';
        settings.total  = totalpn++;
        currentpn       = PUBNUB.init(settings);
    }

    // console.log( 'countpn', countpn, 'totalpn', totalpn );

    // Save PN Instance
    CHANNELS[channel] = currentpn;
    return CHANNELS[channel];
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// UUID
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function uuid(callback) {
    var u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    if (callback) callback(u);
    return u;
}
function clone(a) {
    return JSON.parse(JSON.stringify(a));
}
