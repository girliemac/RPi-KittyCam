var clOptions = [];
var config = {};

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    clOptions[index] = val;
});

var keysets = {

    "keyset1": {
        "pub": "pub-c-fb5fa283-0d93-424f-bf86-d9aca2366c86",
        "sub": "sub-c-d247d250-9dbd-11e3-8008-02ee2ddab7fe",
        "sec": "sec-c-MmI2YjRjODAtNWU5My00ZmZjLTg0MzUtZGM1NGExNjJkNjg1",
        "description": "Compatibility Mode ON"
    },

    "keyset2": {
        "pub": "pub-c-c9b0fe21-4ae1-433b-b766-62667cee65ef",
        "sub": "sub-c-d91ee366-9dbd-11e3-a759-02ee2ddab7fe",
        "sec": "sec-c-ZDUxZGEyNmItZjY4Ny00MjJmLWE0MjQtZTQyMDM0NTY2MDVk",
        "description": "Compatibility Mode OFF"
    }
};

var pubnub = {};

// console.log(clOptions);
//[ 0 'node',
//  1  '/Users/gcohen/clients/javascript/node.js/examples/ptest.js',
//  2  'keyset1',
//  3  'beta',
//  4  'gecA',
//  5  'gecB' ]


function validateArgs(opts) {

    if (opts.length < 6) {
        usageOutput();
    }

    // set keyset
    if ((clOptions[2] == 1) || (clOptions[2] == 2)) {
        if (clOptions[2] == 1) {
            config.keyset = keysets.keyset1;
        } else if (clOptions[2] == 2) {
            config.keyset = keysets.keyset2;
        }
    } else {
        usageOutput();
    }

    // set env
    if ((clOptions[3] == "beta") || (clOptions[3] == "prod")) {
        if (clOptions[3] == "beta") {
            config.origin = "pubsub.pubnub.com";
        } else {
            config.origin = "pubsub.pubnub.com";
        }

    } else {
        usageOutput();
    }

    // set channels
    if (clOptions[4]) {
        config.ch1 = clOptions[4];
    }

    if (clOptions[5]) {
        config.ch2 = clOptions[5];
    }

    // set uuid
    if (clOptions[6]) {
        config.uuid = clOptions[6];
    } else {
        config.uuid = Math.random();
    }

    config.ssl = false;

    if (clOptions[7] == 0) {
        config.ssl = false;
    } else if (clOptions[7] == 1) {
        config.ssl = true;
    }


    initClientWithArgs(config);

}

validateArgs(clOptions);

function usageOutput() {
    console.log("\nUsage: " + clOptions[1] + " KEYSET ENVIRONMENT CHANNEL(S)");
    console.log("KEYSET: 1 or 2");
    console.log("ENVIRONMENT: prod or beta");
    console.log("CH1");
    console.log("CH2");
    console.log("UUID");
    console.log("SSL");
    console.log("\n");
    console.log("Example Usage: node ptest.js 1 beta gecA gecB myUUIDHere 0\n")
    process.exit(1);
}

function connected() {
    console.log("Connected.");
}

function initClientWithArgs(config) {
    console.log("Using keyset " + config.keyset.description + " with keys " + config.keyset.sub + " " + config.keyset.pub);
    console.log("Using environment " + config.origin + ".");
    console.log("Setting ch1 to " + config.ch1);
    console.log("Setting ch2 to " + config.ch2);
    console.log("Setting UUID to " + config.uuid);
    console.log("Setting SSL to " + config.ssl);


    pubnub = require("./../pubnub.js").init({
        origin: config.origin,
        publish_key: config.keyset.pub,
        subscribe_key: config.keyset.sub,
        uuid: config.uuid
    })








        , exec = require('child_process').exec;
}


var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('> ');
rl.prompt();

rl.on('line',function (line) {
    switch (line.trim()) {
        case 'suba':
            console.log('Subscribing to ' + config.ch1);
            subscribe(config.ch1);
            break;
        case 'subb':
            console.log('Subscribing to ' + config.ch2);
            subscribe(config.ch2);
            break;
        case 'unsuba':
            console.log('UnSubscribing to ' + config.ch1);
            unsubscribe(config.ch1);
            break;
        case'subab':
            console.log('Subscribing to ' + config.ch1 + " and " + config.ch2 + ".");
            subscribe([config.ch1,config.ch2].join(","));
            break;

        default:
            break;
    }
    rl.prompt();
}).on('close', function () {
        console.log('BYE BYE!');
        process.exit(0);
    });


function displayPresenceEvent(message, channel) {
    console.log("");
    console.log(message.timestamp + "> " + message.action + " on channel " + channel + " by: " + message.uuid );
}

function subscribe(ch) {
    pubnub.subscribe({
        channel: ch,
        noheresync: 1,
        connect: function () {
            console.log("Connected to " + ch + ".");
        },

        callback: function (message) {
            console.log(message);

        },
        error: function () {
            console.log("Error.");
        },

        presence: function (message, env, channel) {
            displayPresenceEvent(message, channel);
            console.log("***");
        }

    });
}

function unsubscribe(ch) {
    pubnub.unsubscribe({
        channel: ch
    });

}
