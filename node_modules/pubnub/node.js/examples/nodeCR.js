/* ---------------------------------------------------------------------------

 Init PubNub and Get your PubNub API Keys:
 http://www.pubnub.com/account#api-keys

 --------------------------------------------------------------------------- */

var PUBNUB = require("../pubnub.js")

var pubnub = PUBNUB({
    publish_key: "demo",
    // auth_key: "abcd",
    subscribe_key: "demo",
    secret_key: "demo",
    origin: "dara24.devbuild.pubnub.com"

});


console.log(pubnub.get_version());
/* ---------------------------------------------------------------------------
 Listen for Messages
 --------------------------------------------------------------------------- */

function consoleOut(m) {
    console.log("callback: " + JSON.stringify(m));
}

function errorOut(m) {
    console.log("error: " + JSON.stringify(m));
}

function dataOut(m) {
    console.log("data: " + JSON.stringify(m));
}

var i = 0;

function pnPub() {
    pubnub.publish({
        channel: "b",
        message: 'a-' + i++,
        callback: function (r) {
            console.log(JSON.stringify(r));
        },
        error: function (r) {

            console.log(JSON.stringify(r));
        }

    });
}

function pnRevoke() {
    pubnub.grant({
        channel: "b",
        auth_key: "abcd",
        read: false,
        write: false,
        callback: consoleOut
    });
}

function pnGrant() {
    pubnub.grant({
        channel: "b",
        auth_key: "abcd",
        read: true,
        write: true,
        callback: consoleOut
    });
}

function pnAudit() {
    pubnub.audit({
        channel: "b",
        callback: consoleOut
    });
}

function pnRemoveRegistryIDs(reg_id, ns) {
    pubnub.registry_channel({
        registry_id: reg_id,
        callback: consoleOut,
        error: errorOut,
        namespace: ns,
        remove: true
    });
}

function pnGetRegistryIDs(ns) {
    pubnub.registry_id({
        callback: consoleOut,
        error: errorOut,
        namespace: ns
    });
}

function pnRemoveChannelToRegID(reg_id, ch, ns) {
    pubnub.registry_channel({
        callback: consoleOut,
        error: errorOut,
        remove: true,
        channels: ch,
        registry_id: reg_id,
        namespace: ns
    });
}

function pnAddChannelToRegID(reg_id, ch, ns) {
    pubnub.registry_channel({
        callback: consoleOut,
        error: errorOut,
        add: true,
        channels: ch,
        registry_id: reg_id,
        namespace: ns
    });
}

function pnGetAllChannelsAssociatedToRegID(reg_id, ns) {
    pubnub.registry_channel({
        callback: consoleOut,
        error: errorOut,
        registry_id: reg_id,
        namespace: ns
    });
}
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(
        '1: Get All reg_ids\n' +
        '2: Get Reg IDs from "gec_ns" ns\n' +

        '3: Get channels associated with reg_id "gec_regid" no NS\n' +
        '4: Get channels associated with reg_id "gec_regid" NS "gec_ns"\n' +

        '5: Add channel "x" to reg_id "gec_regid" with no namespace\n' +
        '6: Add channel "xx" to reg_id "gec_regid" with namespace "gec_ns"\n' +
        '7: Add channels ["xxx","yyy"] to reg_id "gec_regid" with no namespace\n' +
        '8: Add channels ["xyxy","xzxz"] to reg_id "gec_regid" with namespace "gec_ns"\n' +

        '9: Remove channel "x" to reg_id "gec_regid" with no namespace\n' +
        '10: Remove channel "xx" to reg_id "gec_regid" with namespace "gec_ns"\n' +
        '11: Remove channels ["xxx","yyy"] to reg_id "gec_regid" with no namespace\n' +
        '12: Remove channels ["xyxy","xzxz"] to reg_id "gec_regid" with namespace "gec_ns"\n' +

        '13: Remove regid "gec_regid" + channels with no namespace\n' +
        '14: Remove regid "gec_regid" + channels with namespace "gec_ns"\n' +


        '\n\n\n4: (a)udit, (g)rant or (r)evoke (p)ublish on interval (s)top publishing> ');
rl.prompt();

rl.on('line',function (line) {
    switch (line.trim()) {
        case '1':
            pnGetRegistryIDs();
            break;
        case '2':
            pnGetRegistryIDs("gec_ns");
            break;
        case '3':
            pnGetAllChannelsAssociatedToRegID("gec_regid");
            break;
        case '4':
            pnGetAllChannelsAssociatedToRegID("gec_regid", "gec_ns");
            break;
        case '5':
            pnAddChannelToRegID("gec_regid","x");
            break;
        case '6':
            pnAddChannelToRegID("gec_regid","xx", "gec_ns");
            break;
        case '7':
            pnAddChannelToRegID("gec_regid",["xxx","yyy"]);
            break;
        case '8':
            pnAddChannelToRegID("gec_regid",["xyxy","xzxz"], "gec_ns");
            break;

        case '9':
            pnRemoveChannelToRegID("gec_regid","x");
            break;
        case '10':
            pnRemoveChannelToRegID("gec_regid","xx", "gec_ns");
            break;
        case '11':
            pnRemoveChannelToRegID("gec_regid",["xxx","yyy"]);
            break;
        case '12':
            pnRemoveChannelToRegID("gec_regid",["xyxy","xzxz"] , "gec_ns");
            break;

        case '13':
            pnRemoveRegistryIDs("gec_regid");
            break;
        case '14':
            pnRemoveRegistryIDs("gec_regid", "gec_ns");
            break;

        case 'a':
            pnAudit();
            break;
        case 'g':
            pnGrant();
            break;
        case 'r':
            pnRevoke();
            break;
        case 'p':
            intervalPub();
            break;
        case 's':
            clearInterval(intervalHandle);
            break;
        default:
            break;
    }
    rl.prompt();
}).on('close', function () {
        console.log('BYE BYE!');
        process.exit(0);
    });

var intervalHandle = 0;

function intervalPub() {
    intervalHandle = setInterval(pnPub, 1000);
}