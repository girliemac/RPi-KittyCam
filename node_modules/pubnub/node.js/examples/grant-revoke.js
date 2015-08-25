/* ---------------------------------------------------------------------------
Init Supervisor Client
--------------------------------------------------------------------------- */
var PUBNUB     = require("./../pubnub.js")
,   auth_key   = 'NzVqS3NsMmJOZGtsM2pzbEhEamxrczNnamFrbHM'
,   channel    = 'mychannel'
,   pubnub     = PUBNUB.init({
    publish_key   : 'pub-c-a2650a22-deb1-44f5-aa87-1517049411d5',
    subscribe_key : 'sub-c-a478dd2a-c33d-11e2-883f-02ee2ddab7fe',
    secret_key    : 'sec-c-YjFmNzYzMGMtYmI3NC00NzJkLTlkYzYtY2MwMzI4YTJhNDVh'
});

/* ---------------------------------------------------------------------------
 - Main -
--------------------------------------------------------------------------- */
grant()
.then(open_stream_listen)
.then(publish_expected_successful)
.then(revoke)
.then(publish_expected_fail);

/* ---------------------------------------------------------------------------
Open Stream Listener.
--------------------------------------------------------------------------- */
function open_stream_listen(cb) {
    log('connecting');
    pubnub.auth(auth_key);
    pubnub.subscribe({
        channel  : channel,
        callback : stream_receiver,
        connect  : proceed
    });

    return next();
}


/* ---------------------------------------------------------------------------
Client Test - Access Granted
--------------------------------------------------------------------------- */
function publish_expected_successful() {
    log('publish_expected_successful');
    pubnub.publish({
        channel  : channel,
        message  : 'test-data',
        callback : proceed
    });

    return next();
}

/* ---------------------------------------------------------------------------
Client Test - Access Denied
--------------------------------------------------------------------------- */
function publish_expected_fail() {
    log('publish_expected_fail');
    pubnub.publish({
        channel  : 'foo',
        message  : 'test-data',
        error    : proceed
    });

    return next();
}

/* ---------------------------------------------------------------------------
Grant
--------------------------------------------------------------------------- */
function grant(cb) {
    log('grant');
    pubnub.grant({
        channel  : channel,
        auth_key : auth_key,
        ttl      : 300,
        read     : true,
        write    : true,
        callback : proceed
    });

    return next();
}

/* ---------------------------------------------------------------------------
Revoke
--------------------------------------------------------------------------- */
function revoke(cb) {
    log('revoke');
    pubnub.revoke({
        channel  : channel,
        auth_key : auth_key,
        callback : proceed
    });

    return next();
}

/* ---------------------------------------------------------------------------
Stream Receiver
--------------------------------------------------------------------------- */
function log(d) { console.log(d) }
function stream_receiver(message) { log( " > " + JSON.stringify(message) ) }
function proceed(d) { var cb = next.cb.shift();cb&&cb();stream_receiver(d) }
function next() {
    if (!next.cb) next.cb = [];
    return { then : function(cb) { cb&&next.cb.push(cb); return next(); } };
}
