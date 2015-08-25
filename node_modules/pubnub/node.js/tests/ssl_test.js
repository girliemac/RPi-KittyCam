var PUBNUB = require('../pubnub.js'),
    assert = require("assert"),
    nock   = require("nock"),
    channel = "test_javascript_ssl",
    origin = 'blah.pubnub.com',
    uuid = "me",
    message = "hello";

describe("When SSL mode", function () {
    after(function () {
        nock.enableNetConnect();
    });

    describe("is enabled", function () {
        it("should be able to successfully subscribe to the channel and publish message to it ", function (done) {
            this.timeout(5000);
            nock.enableNetConnect();

            var pubnub = PUBNUB.init({
                publish_key     : 'demo',
                subscribe_key   : 'demo',
                ssl             : true,
                origin          : 'pubsub.pubnub.com'
            });

            subscribeAndPublish(pubnub, channel + "_enabled_" + get_random(), done);
        });

        it("should send requests via HTTPS to 443 port", function (done) {
            nock.disableNetConnect();

            var pubnub = PUBNUB.init({
                publish_key     : 'demo',
                subscribe_key   : 'demo',
                ssl             : true,
                origin          : origin,
                uuid            : uuid
            });

            var path = "/publish/demo/demo/0/" + channel + "/0/" + encodeURI('"' + message + '"') +
                "?uuid=" + uuid + "&pnsdk=PubNub-JS-Nodejs%2F3.7.12";

            nock("https://" + origin + ":443")
                .get(path)
                .reply(200, [[message], "14264384975359568", channel]);

            pubnub.publish({
                channel: channel,
                message: message,
                callback: function () {
                    done();
                },
                error: function () {
                    done(new Error("Error callback triggered"));
                }
            });
        });
    });

    describe("is disabled", function () {
        it("should be able to successfully subscribe to the channel and publish message to it ", function (done) {
            this.timeout(5000);
            nock.enableNetConnect();

            var pubnub = PUBNUB.init({
                publish_key     : 'demo',
                subscribe_key   : 'demo',
                ssl             : false,
                origin          : 'pubsub.pubnub.com'
            });

            subscribeAndPublish(pubnub, channel + "_disabled_" + get_random(), done);
        });

        it("should send requests via HTTP to 80 port", function (done) {
            nock.disableNetConnect();

            var pubnub = PUBNUB.init({
                publish_key     : 'demo',
                subscribe_key   : 'demo',
                origin          : origin,
                uuid            : uuid
            });

            var path = "/publish/demo/demo/0/" + channel + "/0/" + encodeURI('"' + message + '"') +
                "?uuid=" + uuid + "&pnsdk=PubNub-JS-Nodejs%2F3.7.12";

            nock("http://" + origin + ":80")
                .get(path)
                .reply(200, [[message], "14264384975359568", channel]);

            pubnub.publish({
                channel: channel,
                message: message,
                callback: function () {
                    done();
                },
                error: function () {
                    done(new Error("Error callback triggered"));
                }
            });
        });
    });
});

function subscribeAndPublish(pubnub, channel, done) {
    pubnub.subscribe({
        channel: channel,
        connect: function () {
            pubnub.publish({
                channel: channel,
                message: message
            })
        },
        callback: function (msg, envelope, ch) {
            assert.equal(message, msg);
            assert.equal(channel, ch);
            done();
        }
    });
}

function get_random(max) {
    return Math.floor((Math.random() * (max || 1000000000) + 1))
}
