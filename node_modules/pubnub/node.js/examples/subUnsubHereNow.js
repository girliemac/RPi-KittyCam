
var pubnub = require("./../pubnub.js").init({
    publish_key: "demo",
    subscribe_key: "demo",
    uuid: "ptest",
    origin: "pubsub.pubnub.com"
});

var myChannel = "zzz";
var iteration = 0;
var joinMode = true;
var hereNowIntervals = [1.5];
var queue = [];

sub();

function setTimeouts() {
    var timeout = queue.pop();
    setTimeout(function () {
        hereNow(timeout)
    }, (timeout * 1000));
}

function getOccupancy() {

    for (var i = 0; i < hereNowIntervals.length; i++) {
        setTimeouts();
    }
}

function sub() {
    queue = hereNowIntervals.slice(0);
    joinMode = true;

    pubnub.subscribe({
        channel: myChannel,

        connect: function () {
            console.log("%s - BEGIN JOIN TEST CYCLE", new Date());
            getOccupancy();
        },
        callback: function (message) {
            //console.log("%s - %s", new Date(), message);
        },
        disconnect: function () {
            console.log("DISCONNECTED");
        }
    });

}

function hereNow(interval) {
    iteration = interval;
    //console.log("%s - HERE_NOW ITERATION %s", new Date(), interval);
    pubnub.here_now({"channel": myChannel, "callback": onHereNow});
}

function onHereNow(occupancyStats) {
    var uuids = occupancyStats.uuids;

    // console.log("uuids: %s", uuids);

    var modeSwitch = joinMode ? -1 : 0;

    if (uuids.indexOf("ptest") != modeSwitch) {
        console.log("%s - OK: joinMode: %s - iteration: %s - UUIDS: %s", new Date(), joinMode, iteration, uuids);
    } else {
        console.log("%s - *** FAIL *** : %s - iteration: %s - UUIDS: %s", new Date(), joinMode, iteration, uuids);
    }

    if (iteration == hereNowIntervals[0]) {
        if (joinMode) {

            pubnub.unsubscribe({"channel": myChannel});
            console.log("%s - BEGIN LEAVE TEST CYCLE", new Date());
            joinMode = false;
            queue = hereNowIntervals.slice(0);
            setTimeout(getOccupancy, 2000);

        } else {
            sub();
        }
    }
}

