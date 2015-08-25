if (typeof window == 'undefined') {
    var PUBNUB = require('../pubnub.js'),
        assert = require('assert'),
        _ = require("underscore"),
        nock = require('nock');
}

var pubnub = PUBNUB.init({
    publish_key: 'ds',
    subscribe_key: 'ds',
    origin: 'pubsub.pubnub.com',
    build_u: true
});

var pubnub_pam = PUBNUB.init({
    publish_key: 'pam',
    subscribe_key: 'pam',
    secret_key: 'pam',
    origin: 'pubsub.pubnub.com',
    build_u: true
});

var pubnub_enc = PUBNUB({
    publish_key: 'ds',
    subscribe_key: 'ds',
    cipher_key: 'enigma',
    origin: 'pubsub.pubnub.com',
    build_u: true
});

var channel = 'javascript-test-channel-' + Date.now();
var count = 0;

var message_string = "Hi from Javascript";
var message_jsono = {"message": "Hi from Javascript"};
var message_jsono_q = {"message": "How are you ?"};
var message_jsona = ["message", "Hi from javascript"];
var message_num = 123;
var message_num_str = "123";
var message_jsono_str = '{"message" : "Hi from Javascript"}';
var message_jsona_str = '["message" , "Hi from javascript"]';


function in_list(list, str) {
    for (var x in list) {
        if (list[x] === str) return true;
    }
    return false;
}
function in_list_deep(list, str) {
    for (var x in list) {
        if (_.isEqual(list[x], str)) return true;
    }
    return false;
}

function get_random(max) {
    return Math.floor((Math.random() * (max || 1000000000) + 1))
}

namespaces = [];
groups = [];

describe('Pubnub', function () {
    this.timeout(180000);

    before(function () {
        if (nock) {
            nock.enableNetConnect();
        }

        pubnub.channel_group_list_groups({
            callback: function (r) {
                var groups = r.groups;
                for (var i in groups) {
                    var group = groups[i];
                    pubnub.channel_group_remove_group({
                        channel_group: group
                    })
                }
            }
        });

        pubnub.channel_group_list_namespaces({
            callback: function (r) {
                var namespaces = r.namespaces;
                for (var i in namespaces) {
                    var namespace = namespaces[i];
                    pubnub.channel_group_remove_namespace({
                        namespace: namespace
                    })
                }
            }
        });
    });

    after(function () {
        var i;

        for (i in namespaces) {
            var namespace = namespaces[i];
            pubnub.channel_group_remove_namespace({
                namespace: namespace
            })
        }

        for (i in groups) {
            var group = groups[i];
            pubnub.channel_group_remove_group({
                channel_group: group
            })
        }
    });

    describe('#crypto_obj', function() {

        it('should be able to encrypt and decrypt messages', function() {

            var key = 'fookey';
            var expectedBase64 = 'sNEP8cQFxiU3FeFXJH9zEJeBQcyhEXLN7SGfVGlaDrM=';
            var expectedObject = {foo: 'bar', baz: 'qux'};

            assert.equal(pubnub.crypto_obj.encrypt(expectedObject, key), expectedBase64, 'Instance pubnub.crypto_obj encrypted message');
            assert.equal(PUBNUB.crypto_obj.encrypt(expectedObject, key), expectedBase64, 'Constructor PUBNUB.crypto_obj encrypted message');

            assert.deepEqual(pubnub.crypto_obj.decrypt(expectedBase64, key), expectedObject, 'Instance pubnub.crypto_obj decrypted message');
            assert.deepEqual(PUBNUB.crypto_obj.decrypt(expectedBase64, key), expectedObject, 'Constructor PUBNUB.crypto_obj decrypted message');

        });

        it('should allow to pass custom options', function() {

            var expected = {
                    "timestamp": "2014-03-12T20:47:54.712+0000",
                    "body": {
                        "extensionId": 402853446008,
                        "telephonyStatus": "OnHold"
                    },
                    "event": "/restapi/v1.0/account/~/extension/402853446008/presence",
                    "uuid": "db01e7de-5f3c-4ee5-ab72-f8bd3b77e308"
                },
                aesMessage = 'gkw8EU4G1SDVa2/hrlv6+0ViIxB7N1i1z5MU/Hu2xkIKzH6yQzhr3vIc27IAN558kTOkacqE5DkLpRdnN1orwtIBsUHmPMkMWTOLDzVr6eRk+2Gcj2Wft7ZKrCD+FCXlKYIoa98tUD2xvoYnRwxiE2QaNywl8UtjaqpTk1+WDImBrt6uabB1WICY/qE0It3DqQ6vdUWISoTfjb+vT5h9kfZxWYUP4ykN2UtUW1biqCjj1Rb6GWGnTx6jPqF77ud0XgV1rk/Q6heSFZWV/GP23/iytDPK1HGJoJqXPx7ErQU=',
                key = 'e0bMTqmumPfFUbwzppkSbA==';

            assert.equal(pubnub.crypto_obj.encrypt(expected, key, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb'
            }), aesMessage);

            assert.deepEqual(pubnub.crypto_obj.decrypt(aesMessage, key, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb'
            }), expected);

        });

    });

    describe('#subscribe()', function () {

        it('should should message sent to a channel which matches wildcard', function (done) {

            var random  = get_random();
            var ch      = 'channel-' + random;
            var chw     = ch + '.*';
            var chwc    = ch + ".a";


            pubnub.subscribe({
                channel: chw,
                connect: function () {
                    pubnub.publish({
                        'channel' : chwc,
                        message : 'message' + chwc,
                        callback : function(r) {
                            assert.ok(true, 'message published');
                        },
                        error : function(r) {
                            assert.ok(false, 'error occurred in publish');
                        }
                    });

                },
                callback: function (response) {
                    assert.deepEqual(response, 'message' + chwc);
                    pubnub.unsubscribe({channel: chw});
                    done();
                },
                error: function () {
                    assert.ok(false);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }
            });    
        });

        it('should be able to subscribe on foo.* and receive presence events on foo.bar-pnpres when presence callback is provided', function (done) {
            var count = 3;
            function d() {
                if (--count == 0) done();
            }
            var random  = get_random();
            var ch      = 'channel-' + random;
            var chw     = ch + '.*';
            var chwc    = ch + ".a";
            var pubnub2 = PUBNUB.init({
                publish_key: 'ds',
                subscribe_key: 'ds',
                origin: 'pubsub.pubnub.com',
                build_u: true
            });
            function f(x) {
                return JSON.stringify(x) + '  ';
            }
            pubnub.subscribe({
                channel: chw,
                presence : function(a,b,x,y,z) {
                    assert.deepEqual(x, chw);
                    d();
                },
                connect: function () {
                    setTimeout(function(){
                        pubnub2.subscribe({
                            channel: chwc,
                            connect: function () {
                                pubnub2.publish({
                                    'channel' : chwc,
                                    message : 'message' + chwc,
                                    callback : function(r) {
                                        assert.ok(true, 'message published');
                                    },
                                    error : function(r) {
                                        assert.ok(false, 'error occurred in publish');
                                    }
                                });

                            },
                            callback: function (response) {
                                assert.deepEqual(response, 'message' + chwc);
                                pubnub2.unsubscribe({channel: chwc});
                                d();
                            },
                            error: function () {
                                assert.ok(false);
                                pubnub2.unsubscribe({channel: ch});
                                done();
                            }
                        });
                    }, 5000);
                },
                callback: function (response) {
                    assert.deepEqual(response, 'message' + chwc);
                    pubnub.unsubscribe({channel: chw});
                    d();
                },
                error: function () {
                    assert.ok(false);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }
            });    
        });

        it('should be able to subscribe on foo.* and should not receive presence events on foo.bar-pnpres when presence callback is not provided', function (done) {
            var count = 2;
            function d() {
                if (--count == 0) done();
            }
            var random  = get_random();
            var ch      = 'channel-' + random;
            var chw     = ch + '.*';
            var chwc    = ch + ".a";
            var pubnub2 = PUBNUB.init({
                publish_key: 'ds',
                subscribe_key: 'ds',
                origin: 'pubsub.pubnub.com',
                build_u: true
            });
            function f(x) {
                return JSON.stringify(x) + '  ';
            }
            pubnub.subscribe({
                channel: chw,
                connect: function () {
                    setTimeout(function(){
                        pubnub2.subscribe({
                            channel: chwc,
                            connect: function () {
                                pubnub2.publish({
                                    'channel' : chwc,
                                    message : 'message' + chwc,
                                    callback : function(r) {
                                        assert.ok(true, 'message published');
                                    },
                                    error : function(r) {
                                        assert.ok(false, 'error occurred in publish');
                                    }
                                });

                            },
                            callback: function (response) {
                                assert.deepEqual(response, 'message' + chwc);
                                pubnub2.unsubscribe({channel: chwc});
                                d();
                            },
                            error: function () {
                                assert.ok(false);
                                pubnub2.unsubscribe({channel: ch});
                                done();
                            }
                        });
                    }, 5000);
                },
                callback: function (response) {
                    assert.deepEqual(response, 'message' + chwc);
                    pubnub.unsubscribe({channel: chw});
                    d();
                },
                error: function () {
                    assert.ok(false);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }
            });    
        });


        it('should be able to handle wildcard, channel group and channel together', function (done) {
            var count = 3;
            function d() {
                if (--count == 0) done();
            }
            var random  = get_random();
            var ch      = 'channel-' + random;
            var chg     = 'channel-group-' + random;
            var chgc    = 'channel-group-channel' + random
            var chw     = ch + '.*';
            var chwc    = ch + ".a";

            pubnub.channel_group_add_channel({
                'channel_group' : chg,
                'channels'      : chgc,
                'callback'      : function(r) {
                    pubnub.channel_group_list_channels({
                        'channel_group' : chg,
                        'callback' : function(r) {
                            setTimeout(function(){
                                pubnub.subscribe({
                                    channel: ch,
                                    connect: function () {
                                        pubnub.subscribe({
                                            channel: chw,
                                            connect: function () {
                                                pubnub.subscribe({
                                                    channel_group: chg,
                                                    connect: function () {
                                                        setTimeout(function(){
                                                            pubnub.publish({
                                                                'channel' : ch,
                                                                message : 'message' + ch,
                                                                callback : function(r) {
                                                                    assert.ok(true, 'message published');
                                                                    pubnub.publish({
                                                                        'channel' : chwc,
                                                                        message : 'message' + chwc,
                                                                        callback : function(r) {
                                                                            assert.ok(true, 'message published');   
                                                                            pubnub.publish({
                                                                                'channel' : chgc,
                                                                                message : 'message' + chgc,
                                                                                callback : function(r) {
                                                                                    assert.ok(true, 'message published');
                                                                                },
                                                                                error : function(r) {
                                                                                    assert.ok(false, 'error occurred in publish');
                                                                                }

                                                                            })
                                                                        },
                                                                        error : function(r) {
                                                                            assert.ok(false, 'error occurred in publish');
                                                                        }
                                                                    })
                                                                },
                                                                error : function(r) {
                                                                    assert.ok(false, 'error occurred in publish');
                                                                }
                                                            })
                                                        }, 5000);
                                                    },
                                                    callback: function (response) {
                                                        assert.deepEqual(response, 'message' + chgc);
                                                        pubnub.unsubscribe({channel_group: chg});
                                                        d();
                                                    },
                                                    error: function () {
                                                        assert.ok(false);
                                                        pubnub.unsubscribe({channel: ch});
                                                        done();
                                                    }
                                                });
                                            },
                                            callback: function (response) {
                                                assert.deepEqual(response, 'message' + chwc);
                                                d();
                                                //pubnub.unsubscribe({channel: chw});
                                            },
                                            error: function () {
                                                assert.ok(false);
                                                pubnub.unsubscribe({channel: ch});
                                                done();
                                            }
                                        });
                                    },
                                    callback: function (response) {
                                        assert.deepEqual(response, 'message' + ch);
                                        //pubnub.unsubscribe({channel: ch});
                                        d();
                                    },
                                    error: function () {
                                        assert.ok(false);
                                        pubnub.unsubscribe({channel: ch});
                                        done();
                                    }
                                })
                            },5000);          
                        },
                        'error'         : function(r) {
                            assert.ok(false, "error occurred in adding channel to group");
                        }

                    })
                },
                'error' : function(r) {
                    ok(false, "error occurred");
                }
            })           
        });


        it('should pass plain text to callback on decryption error', function (done) {
            var ch = channel + '-' + ++channel;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub.publish({
                        channel: ch,
                        message: message_string,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_string);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                },
                error: function () {
                    assert.ok(false);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should take an error callback which will be invoked if channel permission not there', function (done) {
            var channel = 'channel' + Date.now();
            var auth_key = 'abcd';

            this.timeout(3000);

            pubnub_pam.revoke({
                auth_key: auth_key,
                channel: channel,
                callback: function () {
                    pubnub_pam.subscribe({
                        auth_key: auth_key,
                        channel: channel,
                        error: function (r) {
                            assert.deepEqual(r['message'], 'Forbidden');
                            assert.ok(r['payload'], "Payload should be there in error response");
                            assert.ok(r['payload']['channels'], "Channels should be there in error payload");
                            assert.ok(in_list_deep(r['payload']['channels'], channel), "Channel should be there in channel list");
                            pubnub_pam.unsubscribe({'channel': channel});
                            done();
                        },
                        callback: function () {
                            done(new Error("Callback should not get invoked if permission not there"));
                        },
                        connect: function () {
                            done(new Error("Connect should not get invoked if permission not there"));
                        }
                    })
                }
            });
        });

        it("should not generate spurious presence events when adding new channels to subscribe in_list", function (done) {
            var ch1 = channel + '-subscribe-' + Date.now(),
                ch2 = ch1 + '-2',
                events_count = 0,
                uuid = Date.now(),
                pubnub_pres = PUBNUB.init({
                    origin: 'pubsub.pubnub.com',
                    publish_key: 'ds',
                    subscribe_key: 'ds',
                    uuid: uuid,
                    build_u: true
                });

            pubnub_pres.subscribe({
                channel: ch1,
                connect: function () {
                    setTimeout(function () {
                        pubnub_pres.subscribe({
                            channel: ch2,
                            connect: function () {
                            },
                            callback: function (message) {
                            },
                            error: function () {
                                done(new Error("Unable to subscribe to channel " + ch2));
                            },
                            presence: function (response) {
                                events_count++;
                                assert.deepEqual(response.action, "join");
                                assert.deepEqual(response.uuid, JSON.stringify(pubnub_pres.get_uuid()));
                                setTimeout(function () {
                                    assert.deepEqual(events_count, 2);
                                    done();
                                }, 5000);
                            }
                        });
                    }, 5000);
                },
                presence: function (response) {
                    events_count++;
                    assert.deepEqual(response.action, "join");
                    assert.deepEqual(response.uuid + '', JSON.stringify(pubnub_pres.get_uuid()));
                },
                callback: function (response) {
                },
                error: function () {
                    done(new Error("Unable to subscribe to channel " + ch1));
                }
            });
        });
    });

    describe('#publish()', function () {
        it('should publish strings without error', function (done) {
            var ch = channel + '-' + ++count;
            pubnub.subscribe({
                channel: ch,
                state: {"name": "dev"},
                connect: function () {
                    pubnub.publish({
                        channel: ch, message: message_string,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_string);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish strings without error when encryption is enabled', function (done) {
            var ch = channel + '-' + ++count;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_enc.publish({
                        channel: ch, message: message_string,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_string);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish json objects without error', function (done) {
            var ch = channel + '-' + ++count;
            pubnub.subscribe({
                channel: ch,
                connect: function () {
                    pubnub.publish({
                        channel: ch, message: message_jsono,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsono);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish json objects without error when encryption is enabled', function (done) {
            var ch = channel + '-' + ++count;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_enc.publish({
                        channel: ch,
                        message: message_jsono,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsono);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish json objects without error ( with ? in content ) ', function (done) {
            var ch = channel + '-' + ++count;
            pubnub.subscribe({
                channel: ch,
                connect: function () {
                    pubnub.publish({
                        channel: ch, message: message_jsono_q,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsono_q);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish json objects without error when encryption is enabled ( with ? in content )', function (done) {
            var ch = channel + '-' + ++count;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_enc.publish({
                        channel: ch,
                        message: message_jsono_q,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsono_q);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish json arrays without error', function (done) {
            var ch = channel + '-' + ++count;
            pubnub.subscribe({
                channel: ch,
                connect: function () {
                    pubnub.publish({
                        channel: ch,
                        message: message_jsona,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsona);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }

            })
        });

        it('should publish json arrays without error when encryption is enabled', function (done) {
            var ch = channel + '-' + ++count;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_enc.publish({
                        channel: ch,
                        message: message_jsona,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsona);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish numbers without error', function (done) {
            var ch = channel + '-' + ++count;
            pubnub.subscribe({
                channel: ch,
                connect: function () {
                    pubnub.publish({
                        channel: ch,
                        message: message_num,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_num);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }

            })
        });

        it('should publish numbers without error when encryption is enabled', function (done) {
            var ch = channel + '-' + ++count;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_enc.publish({
                        channel: ch,
                        message: message_num,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_num);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }

            })
        });

        it('should publish number strings without error', function (done) {
            var ch = channel + '-' + ++count;
            pubnub.subscribe({
                channel: ch,
                connect: function () {
                    pubnub.publish({
                        channel: ch,
                        message: message_num_str,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_num_str);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }

            })
        });

        it('should publish numbers strings error when encryption is enabled', function (done) {
            var ch = channel + '-' + ++count;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_enc.publish({
                        channel: ch,
                        message: message_num_str,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_num_str);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }

            })
        });

        it('should publish json object strings without error', function (done) {
            var ch = channel + '-' + ++count;
            pubnub.subscribe({
                channel: ch,
                connect: function () {
                    pubnub.publish({
                        channel: ch, message: message_jsono_str,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsono_str);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }

            })
        });

        it('should publish json object strings error when encryption is enabled', function (done) {
            var ch = channel + '-' + ++count;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_enc.publish({
                        channel: ch, message: message_jsono_str,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsono_str);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish json array strings without error', function (done) {
            var ch = channel + '-' + ++count;
            pubnub.subscribe({
                channel: ch,
                connect: function () {
                    pubnub.publish({
                        channel: ch, message: message_jsona_str,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsona_str);
                    pubnub.unsubscribe({channel: ch});
                    done();
                }
            })
        });

        it('should publish json array strings error when encryption is enabled', function (done) {
            var ch = channel + '-' + ++count;
            pubnub_enc.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_enc.publish({
                        channel: ch, message: message_jsona_str,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsona_str);
                    pubnub_enc.unsubscribe({channel: ch});
                    done();
                }

            })
        });

        it('should store in history when store is not there or store is true', function (done) {
            var ch = channel + '-' + ++count;
            var messages = [1, 2, 3];

            pubnub.publish({
                channel: ch, message: messages[0],
                callback: function (response) {
                    assert.deepEqual(response[0], 1);
                    pubnub.publish({
                        channel: ch, message: messages[1],
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                            pubnub.publish({
                                channel: ch, message: messages[2],
                                callback: function (response) {
                                    assert.deepEqual(response[0], 1);
                                    setTimeout(function () {
                                        pubnub.history({
                                            channel: ch,
                                            callback: function (response) {
                                                assert.deepEqual(messages, response[0]);
                                                done();
                                            },
                                            count: 3
                                        });
                                    }, 5000);
                                }
                            });
                        }
                    });
                }
            });
        });

        it('should not store in history when store is false', function (done) {
            var ch = channel + '-' + ++count;
            var messages = [4, 5, 6];

            pubnub.publish({
                channel: ch, message: messages[0], store_in_history: false,
                callback: function (response) {
                    assert.deepEqual(response[0], 1);
                    pubnub.publish({
                        channel: ch, message: messages[1], store_in_history: false,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                            pubnub.publish({
                                channel: ch, message: messages[2], store_in_history: false,
                                callback: function (response) {
                                    assert.deepEqual(response[0], 1);
                                    setTimeout(function () {
                                        pubnub.history({
                                            channel: ch,
                                            callback: function (response) {
                                                assert.notDeepEqual(messages, response[0]);
                                                done();
                                            },
                                            count: 3
                                        });
                                    }, 5000);
                                }
                            });
                        }
                    });
                }
            });
        })
    });

    describe('#history()', function () {
        var history_channel = channel + '-history';

        before(function (done) {
            this.timeout(80000);

            pubnub.publish({
                channel: history_channel,
                message: message_string + '-1',
                error: function () {
                    assert.ok(false);
                },
                callback: function (response) {
                    assert.deepEqual(response[0], 1);
                    pubnub.publish({
                        channel: history_channel,
                        message: message_string + '-2',
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                            pubnub_enc.publish({
                                channel: history_channel,
                                message: message_string + '-1',
                                callback: function (response) {
                                    assert.deepEqual(response[0], 1);
                                    pubnub_enc.publish({
                                        channel: history_channel,
                                        message: message_string + '-2',
                                        callback: function (response) {
                                            assert.deepEqual(response[0], 1);
                                            pubnub.publish({
                                                channel: history_channel,
                                                message: message_string + '-1',
                                                callback: function (response) {
                                                    assert.deepEqual(response[0], 1);
                                                    pubnub.publish({
                                                        channel: history_channel,
                                                        message: message_string + '-2',
                                                        callback: function (response) {
                                                            assert.deepEqual(response[0], 1);
                                                            done();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });

        it('should return 6 messages when 6 messages were published on channel', function (done) {
            this.timeout(40000);

            setTimeout(function () {
                pubnub.history({
                    channel: history_channel,
                    callback: function (response) {
                        assert.deepEqual(response[0].length, 6);
                        assert.deepEqual(response[0][0], message_string + '-1');
                        assert.deepEqual(response[0][5], message_string + '-2');
                        done();
                    }
                })
            }, 5000);
        });

        it('should return 1 message when 6 messages were published on channel and count is 1', function (done) {
            this.timeout(40000);

            setTimeout(function () {
                pubnub.history({
                    channel: history_channel,
                    count: 1,
                    callback: function (response) {
                        assert.deepEqual(response[0].length, 1);
                        assert.deepEqual(response[0][0], message_string + '-2');
                        done();
                    }
                })
            }, 5000);
        });

        it('should return 1 message from reverse when 6 messages were published on channel and count is 1', function (done) {
            this.timeout(40000);

            setTimeout(function () {
                pubnub.history({
                    channel: history_channel,
                    count: 1,
                    reverse: true,
                    callback: function (response) {
                        assert.deepEqual(response[0].length, 1);
                        assert.deepEqual(response[0][0], message_string + '-1');
                        done();
                    }
                })
            }, 5000);
        });

        it('should pass on plain text for messages which could not be decrypted when encryption is enabled', function (done) {
            this.timeout(40000);

            setTimeout(function () {
                pubnub_enc.history({
                    channel: history_channel,
                    callback: function (response) {
                        assert.deepEqual(response[0].length, 6);
                        done();
                    },
                    error: function () {
                        done(new Error("Error callback invoked in #history() method"));
                    }
                })
            }, 5000);
        })
    });

    describe('#history() with encryption', function () {
        var history_channel = channel + '-history-enc';

        before(function (done) {
            this.timeout(40000);
            var x;
            pubnub_enc.publish({
                channel: history_channel,
                message: message_string + '-1',
                callback: function (response) {
                    assert.deepEqual(response[0], 1);
                    pubnub_enc.publish({
                        channel: history_channel,
                        message: message_string + '-2',
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                            done();
                        }
                    });
                }
            });
        });

        it('should return 2 messages when 2 messages were published on channel', function (done) {
            this.timeout(40000);

            setTimeout(function () {
                pubnub_enc.history({
                    channel: history_channel,
                    callback: function (response) {
                        assert.deepEqual(response[0].length, 2);
                        assert.deepEqual(response[0][0], message_string + '-1');
                        assert.deepEqual(response[0][1], message_string + '-2');
                        done();
                    }
                })
            }, 5000);
        });

        it('should return 1 message when 2 messages were published on channel and count is 1', function (done) {
            this.timeout(40000);

            setTimeout(function () {
                pubnub_enc.history({
                    channel: history_channel,
                    count: 1,
                    callback: function (response) {
                        assert.deepEqual(response[0].length, 1);
                        assert.deepEqual(response[0][0], message_string + '-2');
                        done();
                    }
                })
            }, 5000);
        });

        it('should return 1 message from reverse when 2 messages were published on channel and count is 1', function (done) {
            this.timeout(40000);

            setTimeout(function () {
                pubnub_enc.history({
                    channel: history_channel,
                    count: 1,
                    reverse: true,
                    callback: function (response) {
                        assert.deepEqual(response[0].length, 1);
                        assert.deepEqual(response[0][0], message_string + '-1');
                        done();
                    }
                })
            }, 5000);
        })
    });

    describe('#time()', function () {
        it('should return time successfully when called', function (done) {
            pubnub.time(function (time) {
                assert.ok(time);
                done();
            })
        })
    });

    describe('#uuid()', function () {
        it('should return uuid successfully when called', function (done) {
            pubnub.uuid(function (uuid) {
                assert.ok(uuid);
                done();
            })
        })
    });

    describe('#grant()', function () {
        var grant_channel = channel + '-grant';
        var auth_key = "abcd";
        var sub_key = 'pam';
        var pubnub = PUBNUB.init({
            origin: 'pubsub.pubnub.com',
            publish_key: 'pam',
            subscribe_key: 'pam',
            secret_key: 'pam',
            build_u: true
        });

        this.timeout(15000);

        for (var i = 0; i < get_random(10); i++) {
            pubnub._add_param('a-' + get_random(1000), Date.now());
        }

        before(function () {
            pubnub.revoke({
                callback: function (r) {
                }
            })
        });

        it('should be able to grant read write access', function (done) {
            var grant_channel_local = grant_channel + Date.now();
            setTimeout(function () {
                pubnub.grant({
                    'channel': grant_channel_local,
                    'auth_key': auth_key,
                    read: true,
                    write: true,
                    callback: function () {
                        pubnub.audit({
                            'channel': grant_channel_local,
                            'auth_key': auth_key,
                            callback: function (response) {
                                assert.deepEqual(response.auths.abcd.r, 1);
                                assert.deepEqual(response.auths.abcd.w, 1);
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'auth_key': auth_key,
                                    'callback': function () {
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'auth_key': auth_key,
                                            'message': 'Test',
                                            'callback': function () {
                                                done();
                                            },
                                            'error': function () {
                                                done(new Error("Unable to publish to granted channel"));
                                            }
                                        })
                                    },
                                    'error': function () {
                                        done(new Error("Unable to get history of granted channel"));
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to grant read write access with space in auth key and channel', function (done) {
            var auth_key = "ab cd";
            var grant_channel_local = grant_channel + "   " + Date.now();
            setTimeout(function () {
                pubnub.grant({
                    channel: grant_channel_local,
                    'auth_key': auth_key,
                    read: true,
                    write: true,
                    callback: function () {
                        pubnub.audit({
                            channel: grant_channel_local,
                            'auth_key': auth_key,
                            callback: function (response) {
                                assert.deepEqual(response.auths[auth_key].r, 1);
                                assert.deepEqual(response.auths[auth_key].w, 1);
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'auth_key': auth_key,
                                    'callback': function () {
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'auth_key': auth_key,
                                            'message': 'Test',
                                            'callback': function () {
                                                done();
                                            },
                                            'error': function () {
                                                done(new Error("Unable to publish to granted channel"));
                                            }
                                        })
                                    },
                                    'error': function () {
                                        done(new Error("Unable to get history of granted channel"));
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to grant read write access for wildcard channel', function (done) {
            var auth_key = "abcd";
            var grant_channel_local = grant_channel + "-" + Date.now() + ".";
            setTimeout(function () {
                pubnub.grant({
                    channel: grant_channel_local + "*",
                    'auth_key': auth_key,
                    read: true,
                    write: true,
                    callback: function () {
                        pubnub.audit({
                            channel: grant_channel_local + "*",
                            'auth_key': auth_key,
                            callback: function (response) {
                                assert.deepEqual(response.auths[auth_key].r, 1);
                                assert.deepEqual(response.auths[auth_key].w, 1);
                                pubnub.history({
                                    'channel': grant_channel_local + "a",
                                    'auth_key': auth_key,
                                    'callback': function () {
                                        pubnub.publish({
                                            'channel': grant_channel_local + "a",
                                            'auth_key': auth_key,
                                            'message': 'Test',
                                            'callback': function () {
                                                done();
                                            },
                                            'error': function () {
                                                done(new Error("Unable to publish to granted channel"));
                                            }
                                        })
                                    },
                                    'error': function () {
                                        done(new Error("Unable to get history of granted channel"));
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to grant read write access without auth key', function (done) {
            var grant_channel_local = grant_channel + Date.now();
            setTimeout(function () {
                pubnub.grant({
                    channel: grant_channel_local,
                    read: true,
                    write: true,
                    callback: function () {
                        pubnub.audit({
                            channel: grant_channel_local,
                            callback: function (response) {
                                assert.deepEqual(response.channels[grant_channel_local].r, 1);
                                assert.deepEqual(response.channels[grant_channel_local].w, 1);
                                assert.deepEqual(response.subscribe_key, sub_key);
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'auth_key': "",
                                    'callback': function () {
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'auth_key': "",
                                            'message': 'Test',
                                            'callback': function () {
                                                done();
                                            },
                                            'error': function () {
                                                done(new Error("Unable to publish to granted channel"));
                                            }
                                        })
                                    },
                                    'error': function () {
                                        done(new Error("Unable to get history of granted channel"));
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to grant read access revoke write access', function (done) {
            var grant_channel_local = grant_channel + Date.now();
            setTimeout(function () {
                pubnub.grant({
                    channel: grant_channel_local,
                    auth_key: auth_key,
                    read: true,
                    write: false,
                    callback: function () {
                        pubnub.audit({
                            channel: grant_channel_local,
                            auth_key: auth_key,
                            callback: function (response) {
                                assert.deepEqual(response.auths.abcd.r, 1);
                                assert.deepEqual(response.auths.abcd.w, 0);
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'auth_key': auth_key,
                                    'callback': function () {
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'auth_key': auth_key,
                                            'message': 'Test',
                                            'callback': function () {
                                                done(new Error("Publish to the channel with revoked write access was successful"));
                                            },
                                            'error': function (response) {
                                                assert.deepEqual(response.message, "Forbidden");
                                                in_list_deep(response.payload.channels, grant_channel_local);
                                                done();
                                            }
                                        })
                                    },
                                    'error': function () {
                                        done(new Error("Unable to get history of granted channel"));
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to revoke read access grant write access', function (done) {
            var grant_channel_local = grant_channel + Date.now();
            setTimeout(function () {
                pubnub.grant({
                    channel: grant_channel_local,
                    auth_key: auth_key,
                    read: false,
                    write: true,
                    callback: function () {
                        pubnub.audit({
                            channel: grant_channel_local,
                            auth_key: auth_key,
                            callback: function (response) {
                                assert.deepEqual(response.auths.abcd.r, 0);
                                assert.deepEqual(response.auths.abcd.w, 1);
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'auth_key': auth_key,
                                    'callback': function () {
                                        done(new Error("History for the channel with revoked read access was returned successfully"));
                                    },
                                    'error': function (response) {
                                        assert.deepEqual(response.message, "Forbidden");
                                        in_list_deep(response.payload.channels, grant_channel_local);
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'message': 'Test',
                                            'auth_key': auth_key,
                                            'callback': function () {
                                                done();
                                            },
                                            'error': function () {
                                                done(new Error("Unable to publish to the channel with granted write access"));
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to revoke read and write access', function (done) {
            var grant_channel_local = grant_channel + Date.now();
            setTimeout(function () {
                pubnub.grant({
                    channel: grant_channel_local,
                    auth_key: auth_key,
                    read: false,
                    write: false,
                    callback: function () {
                        pubnub.audit({
                            channel: grant_channel_local,
                            auth_key: auth_key,
                            callback: function (response) {
                                assert.deepEqual(response.auths.abcd.r, 0);
                                assert.deepEqual(response.auths.abcd.w, 0);
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'auth_key': auth_key,
                                    'callback': function () {
                                        done(new Error("History for the channel with revoked read access was returned successfully"));
                                    },
                                    'error': function (response) {
                                        assert.deepEqual(response.message, "Forbidden");
                                        in_list_deep(response.payload.channels, grant_channel_local);
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'message': 'Test',
                                            'auth_key': auth_key,
                                            'callback': function () {
                                                done(new Error("Publish to the channel with revoked write access was successful"));
                                            },
                                            'error': function (response) {
                                                assert.deepEqual(response.message, "Forbidden");
                                                in_list_deep(response.payload.channels, grant_channel_local);
                                                done();
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to revoke read and write access without auth key', function (done) {
            var grant_channel_local = grant_channel + Date.now();
            setTimeout(function () {
                pubnub.grant({
                    channel: grant_channel_local,
                    read: false,
                    write: false,
                    callback: function () {
                        pubnub.audit({
                            channel: grant_channel_local,
                            callback: function (response) {
                                assert.deepEqual(response.channels[grant_channel_local].r, 0);
                                assert.deepEqual(response.channels[grant_channel_local].w, 0);
                                assert.deepEqual(response.subscribe_key, sub_key);
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'auth_key': "",
                                    'callback': function () {
                                        done(new Error("History for the channel with revoked read access was returned successfully"));
                                    },
                                    'error': function () {
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'message': 'Test',
                                            'auth_key': "",
                                            'callback': function () {
                                                done(new Error("Publish to the channel with revoked write access was successful"));
                                            },
                                            'error': function (response) {
                                                assert.deepEqual(response.message, "Forbidden");
                                                in_list_deep(response.payload.channels, grant_channel_local);
                                                done();
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to revoke read write access at sub key level', function (done) {
            var grant_channel_local = grant_channel + Date.now();

            var pubnub = PUBNUB.init({
                origin: 'pubsub.pubnub.com',
                publish_key: 'pam',
                subscribe_key: 'pam',
                secret_key: 'pam',
                build_u: true
            });

            setTimeout(function () {
                pubnub.grant({
                    read: false,
                    write: false,
                    callback: function () {
                        pubnub.audit({
                            callback: function (response) {
                                assert.deepEqual(response.subscribe_key, 'pam');
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'auth_key': "",
                                    'callback': function () {
                                        done(new Error("History for the channel with revoked read access was returned successfully"));
                                    },
                                    'error': function () {
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'message': 'Test',
                                            'auth_key': "",
                                            'callback': function () {
                                                done(new Error("Publish to the channel with revoked write access was successful"));
                                            },
                                            'error': function (response) {
                                                assert.deepEqual(response.message, "Forbidden");
                                                in_list_deep(response.payload.channels, grant_channel_local);
                                                done();
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        });

        it('should be able to grant read write access at sub key level', function (done) {
            var grant_channel_local = grant_channel + Date.now();

            var pubnub = PUBNUB.init({
                origin: 'pubsub.pubnub.com',
                publish_key: 'pam',
                subscribe_key: 'pam',
                secret_key: 'pam',
                build_u: true
            });

            setTimeout(function () {
                pubnub.grant({
                    read: true,
                    write: true,
                    callback: function () {
                        pubnub.audit({
                            callback: function (response) {
                                assert.deepEqual(response.subscribe_key, 'pam');
                                pubnub.history({
                                    'channel': grant_channel_local,
                                    'callback': function () {
                                        pubnub.publish({
                                            'channel': grant_channel_local,
                                            'auth_key': auth_key,
                                            'message': 'Test',
                                            'callback': function () {
                                                done();
                                            },
                                            'error': function () {
                                                node(new Error("Unable to publish to the sub_key with granted write permissions"))
                                            }
                                        })
                                    },
                                    'error': function () {
                                        done(new Error("Unable to get history for the sub_key with granted read permissions"))
                                    }
                                });
                            },
                            error: function () {
                                done(new Error("Error in audit"))
                            }
                        });
                    }
                })
            }, 5000);
        })
    });

    describe('#revoke()', function () {
        var revoke_channel = channel + '-revoke';
        var auth_key = "abcd";

        var pubnub = PUBNUB.init({
            origin: 'pubsub.pubnub.com',
            publish_key: 'pam',
            subscribe_key: 'pam',
            secret_key: 'pam',
            build_u: true
        });

        before(function () {
            pubnub.revoke({
                callback: function (r) {
                }
            })
        });

        for (var i = 0; i < Math.floor((Math.random() * 10) + 1); i++) {
            pubnub._add_param('a-' + Math.floor((Math.random() * 1000) + 1), Date.now());
        }

        it('should be able to revoke access', function (done) {
            setTimeout(function () {
                pubnub.revoke({
                    channel: revoke_channel,
                    auth_key: auth_key,
                    callback: function () {
                        pubnub.audit({
                            channel: revoke_channel,
                            auth_key: auth_key,
                            callback: function (response) {
                                assert.deepEqual(response.auths.abcd.r, 0);
                                assert.deepEqual(response.auths.abcd.w, 0);
                                pubnub.history({
                                    'channel': revoke_channel,
                                    'auth_key': auth_key,
                                    'callback': function () {
                                        done(new Error("Publish to the channel with revoked write access was successful"));
                                    },
                                    'error': function (response) {
                                        assert.deepEqual(response.message, "Forbidden");
                                        in_list_deep(response.payload.channels, revoke_channel);
                                        pubnub.publish({
                                            'channel': revoke_channel,
                                            'message': 'Test',
                                            'auth_key': auth_key,
                                            'callback': function () {
                                                done(new Error("Publish to the channel with revoked write permissions was successful"))
                                            },
                                            'error': function (response) {
                                                assert.deepEqual(response.message, "Forbidden");
                                                in_list_deep(response.payload.channels, revoke_channel);
                                                done();
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }, 5000);
        })
    });

    describe('#where_now()', function () {
        var uuid = Date.now();
        var pubnub = PUBNUB.init({
            publish_key: 'ds',  //'demo',
            subscribe_key: 'ds', //'demo',
            uuid: uuid,
            origin: 'pubsub.pubnub.com',
            build_u: true
        });

        this.timeout(80000);

        it('should return channel x in result for uuid y, when uuid y subscribed to channel x', function (done) {
            var ch = channel + '-' + 'where-now';
            pubnub.subscribe({
                channel: ch,
                connect: function (response) {
                    setTimeout(function () {
                        pubnub.where_now({
                            uuid: uuid,
                            callback: function (data) {
                                assert.ok(in_list(data.channels, ch), "subscribed Channel should be there in where now list");
                                pubnub.unsubscribe({channel: ch});
                                done();
                            },
                            error: function () {
                                done(new Error("Error occurred in where_now"));
                            }
                        })
                    }, 3000);
                },
                callback: function (response) {
                },
                error: function () {
                    done(new Error("Error occurred in subscribe"));
                }
            });
        });

        it('should return channel a,b,c in result for uuid y, when uuid y subscribed to channel x', function (done) {
            var ch1 = channel + '-' + 'where-now' + '-1';
            var ch2 = channel + '-' + 'where-now' + '-2';
            var ch3 = channel + '-' + 'where-now' + '-3';
            var where_now_set = false;
            pubnub.subscribe({
                channel: [ch1, ch2, ch3],
                connect: function () {
                    if (!where_now_set) {
                        setTimeout(function () {
                            pubnub.where_now({
                                uuid: uuid,
                                callback: function (data) {
                                    assert.ok(in_list(data.channels, ch1), "subscribed Channel 1 should be there in where now list");
                                    assert.ok(in_list(data.channels, ch2), "subscribed Channel 2 should be there in where now list");
                                    assert.ok(in_list(data.channels, ch3), "subscribed Channel 3 should be there in where now list");
                                    pubnub.unsubscribe({channel: ch1});
                                    pubnub.unsubscribe({channel: ch2});
                                    pubnub.unsubscribe({channel: ch3});
                                    done();
                                },
                                error: function (error) {
                                    done(new Error("Error occurred in where_now " + JSON.stringify(error)));
                                }
                            })
                        }, 3000);
                        where_now_set = true;
                    }
                },
                callback: function (response) {
                },
                error: function (error) {
                    done(new Error("Error occurred in where_now " + JSON.stringify(error)));
                }
            })
        })
    });

    describe('#state()', function () {
        var uuid = Date.now();
        var pubnub = PUBNUB.init({
            publish_key: 'ds', // 'demo',
            subscribe_key: 'ds', // 'demo',
            uuid: uuid,
            origin: 'pubsub.pubnub.com',
            build_u: true
        });

        this.timeout(80000);

        it('should be able to set state for uuid', function (done) {
            var ch = channel + '-' + 'setstate',
                uuid = pubnub.uuid(),
                state = {'name': 'name-' + uuid};

            pubnub.state({
                channel: ch,
                uuid: uuid,
                state: state,
                callback: function (response) {
                    assert.deepEqual(response, state);
                    pubnub.state({
                        channel: ch,
                        uuid: uuid,
                        callback: function (response) {
                            assert.deepEqual(response, state);
                            done();
                        },
                        error: function (error) {
                            done(new Error("Error occurred in where_now " + JSON.stringify(error)));
                        }
                    });
                },
                error: function (error) {
                    done(new Error("Error occurred in where_now " + JSON.stringify(error)));
                }
            })
        });
    });

    describe('#here_now()', function () {
        var uuid = '' + get_random()
            , uuid1 = uuid + '-1'
            , uuid2 = uuid + '-2'
            , uuid3 = uuid + '-3';

        var pubnub_pres = PUBNUB.init({
            origin: 'pubsub.pubnub.com',
            publish_key: 'ds', // 'demo',
            subscribe_key: 'ds',  // 'demo',
            uuid: uuid,
            build_u: true
        });

        var pubnub_pres_1 = PUBNUB.init({
            origin: 'pubsub.pubnub.com',
            publish_key: 'ds', // 'demo',
            subscribe_key: 'ds',  // 'demo',
            uuid: uuid1,
            build_u: true
        });

        var pubnub_pres_2 = PUBNUB.init({
            origin: 'pubsub.pubnub.com',
            publish_key: 'ds', // 'demo',
            subscribe_key: 'ds',  // 'demo',
            uuid: uuid2,
            build_u: true
        });

        var pubnub_pres_3 = PUBNUB.init({
            origin: 'pubsub.pubnub.com',
            publish_key: 'ds', // 'demo',
            subscribe_key: 'ds',  // 'demo',
            uuid: uuid3,
            build_u: true
        });

        it("should return channel channel list with occupancy details and uuids for a subscribe key", function (done) {
            var ch = channel + '-' + 'here-now-' + Date.now();
            var ch1 = ch + '-1';
            var ch2 = ch + '-2';
            var ch3 = ch + '-3';

            pubnub_pres.subscribe({
                channel: ch,
                connect: function () {
                    pubnub_pres_1.subscribe({
                        channel: ch1,
                        connect: function () {
                            pubnub_pres_2.subscribe({
                                channel: ch2,
                                connect: function () {
                                    pubnub_pres_3.subscribe({
                                        channel: ch3,
                                        connect: function () {
                                            setTimeout(function () {
                                                pubnub_pres.here_now({
                                                    callback: function (response) {
                                                        assert.ok(response.channels[ch], "subscribed channel should be present in payload");
                                                        assert.ok(response.channels[ch1], "subscribed 1 channel should be present in payload");
                                                        assert.ok(response.channels[ch2], "subscribed 2 channel should be present in payload");
                                                        assert.ok(response.channels[ch3], "subscribed 3 channel should be present in payload");
                                                        assert.ok(in_list(response.channels[ch].uuids, uuid), "uuid should be there in the uuids list");
                                                        assert.ok(in_list(response.channels[ch1].uuids, uuid1), "uuid 1 should be there in the uuids list");
                                                        assert.ok(in_list(response.channels[ch2].uuids, uuid2), "uuid 2 should be there in the uuids list");
                                                        assert.ok(in_list(response.channels[ch3].uuids, uuid3), "uuid 3 should be there in the uuids list");
                                                        assert.deepEqual(response.channels[ch].occupancy, 1);
                                                        assert.deepEqual(response.channels[ch1].occupancy, 1);
                                                        assert.deepEqual(response.channels[ch2].occupancy, 1);
                                                        assert.deepEqual(response.channels[ch3].occupancy, 1);
                                                        pubnub_pres.unsubscribe({channel: ch});
                                                        pubnub_pres_1.unsubscribe({channel: ch1});
                                                        pubnub_pres_2.unsubscribe({channel: ch2});
                                                        pubnub_pres_3.unsubscribe({channel: ch3});
                                                        done();
                                                    },
                                                    error: function () {
                                                        done(new Error("Error in #here_now() request"));
                                                    }
                                                });
                                            }, 5000);
                                        },
                                        callback: function (response) {
                                        },
                                        error: function () {
                                            done(new Error("Error in #subscribe() level 3 request"));
                                        }
                                    })
                                },
                                callback: function (response) {
                                },
                                error: function () {
                                    done(new Error("Error in #subscribe() level 2 request"));
                                }
                            })
                        },
                        callback: function (response) {
                        },
                        error: function () {
                            done(new Error("Error in #subscribe() level 1 request"));
                        }
                    })
                },
                callback: function (response) {
                },
                error: function () {
                    done(new Error("Error in #subscribe() level 0 request"));
                }
            })
        });

        it("should return channel channel list with occupancy details and uuids + state for a subscribe key", function (done) {
            var ch = channel + '-' + 'here-now-' + Date.now(),
                ch1 = ch + '-1',
                ch2 = ch + '-2',
                ch3 = ch + '-3';

            pubnub_pres.state({
                channel: ch,
                uuid: uuid,
                state: {
                    name: 'name-' + uuid
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #0"));
                }
            });

            pubnub_pres_1.state({
                channel: ch1,
                uuid: uuid1,
                state: {
                    name: 'name-' + uuid1
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid1
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #1"));
                }
            });

            pubnub_pres_2.state({
                channel: ch2,
                uuid: uuid2,
                state: {
                    name: 'name-' + uuid2
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid2
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #2"));
                }
            });

            pubnub_pres_3.state({
                channel: ch3,
                uuid: uuid3,
                state: {
                    name: 'name-' + uuid3
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid3
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #3"));
                }
            });

            setTimeout(function () {
                pubnub_pres.subscribe({
                    channel: ch,
                    connect: function () {
                        pubnub_pres_1.subscribe({
                            channel: ch1,
                            connect: function () {
                                pubnub_pres_2.subscribe({
                                    channel: ch2,
                                    connect: function () {
                                        pubnub_pres_3.subscribe({
                                            channel: ch3,
                                            connect: function () {
                                                setTimeout(function () {
                                                    pubnub_pres.here_now({
                                                        state: true,
                                                        callback: function (response) {
                                                            assert.ok(response.channels[ch], "subscribed channel should be present in payload");
                                                            assert.ok(response.channels[ch1], "subscribed 1 channel should be present in payload");
                                                            assert.ok(response.channels[ch2], "subscribed 2 channel should be present in payload");
                                                            assert.ok(response.channels[ch3], "subscribed 3 channel should be present in payload");
                                                            assert.ok(in_list_deep(response.channels[ch].uuids, {
                                                                uuid: uuid,
                                                                state: {name: 'name-' + uuid}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch1].uuids, {
                                                                uuid: uuid1,
                                                                state: {name: 'name-' + uuid1}
                                                            }), "uuid 1 should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch2].uuids, {
                                                                uuid: uuid2,
                                                                state: {name: 'name-' + uuid2}
                                                            }), "uuid 2 should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch3].uuids, {
                                                                uuid: uuid3,
                                                                state: {name: 'name-' + uuid3}
                                                            }), "uuid 3 should be there in the uuids list");
                                                            assert.deepEqual(response.channels[ch].occupancy, 1);
                                                            assert.deepEqual(response.channels[ch1].occupancy, 1);
                                                            assert.deepEqual(response.channels[ch2].occupancy, 1);
                                                            assert.deepEqual(response.channels[ch3].occupancy, 1);
                                                            pubnub_pres.unsubscribe({channel: ch});
                                                            pubnub_pres_1.unsubscribe({channel: ch1});
                                                            pubnub_pres_2.unsubscribe({channel: ch2});
                                                            pubnub_pres_3.unsubscribe({channel: ch3});
                                                            done();
                                                        },
                                                        error: function () {
                                                            done(new Error("Error in #here_now() request"));
                                                        }
                                                    });
                                                }, 5000);
                                            },
                                            callback: function () {
                                            },
                                            error: function () {
                                                done(new Error("Error in #subscribe() level 3 request"));
                                            }
                                        })
                                    },
                                    callback: function () {
                                    },
                                    error: function () {
                                        done(new Error("Error in #subscribe() level 2 request"));
                                    }
                                })
                            },
                            callback: function () {
                            },
                            error: function () {
                                done(new Error("Error in #subscribe() level 1 request"));
                            }
                        })
                    },
                    callback: function () {
                    },
                    error: function () {
                        done(new Error("Error in #subscribe() level 0 request"));
                    }
                })
            }, 5000);
        });

        it("should return correct state for uuid in different channels", function (done) {
            var ch = channel + '-' + 'here-now-' + Date.now();
            var ch1 = ch + '-1';
            var ch2 = ch + '-2';
            var ch3 = ch + '-3';

            pubnub_pres.state({
                channel: ch,
                uuid: uuid,
                state: {
                    name: 'name-' + uuid
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #0"));
                }
            });

            pubnub_pres.state({
                channel: ch1,
                uuid: uuid,
                state: {
                    name: 'name-' + uuid1
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid1
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #1"));
                }
            });

            pubnub_pres.state({
                channel: ch2,
                uuid: uuid,
                state: {
                    name: 'name-' + uuid2
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid2
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #2"));
                }
            });

            pubnub_pres.state({
                channel: ch3,
                uuid: uuid,
                state: {
                    name: 'name-' + uuid3
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid3
                        }
                    );
                },
                error: function (e) {
                    done(new Error("Error in state request #3"));
                }
            });

            setTimeout(function () {
                pubnub_pres.subscribe({
                    channel: ch,
                    connect: function () {
                        pubnub_pres.subscribe({
                            channel: ch1,
                            connect: function () {
                                pubnub_pres.subscribe({
                                    channel: ch2,
                                    connect: function () {
                                        pubnub_pres.subscribe({
                                            channel: ch3,
                                            connect: function () {
                                                setTimeout(function () {
                                                    pubnub_pres.here_now({
                                                        state: true,
                                                        callback: function (response) {
                                                            assert.ok(response.channels[ch], "subscribed channel should be present in payload");
                                                            assert.ok(response.channels[ch1], "subscribed 1 channel should be present in payload");
                                                            assert.ok(response.channels[ch2], "subscribed 2 channel should be present in payload");
                                                            assert.ok(response.channels[ch3], "subscribed 3 channel should be present in payload");
                                                            assert.ok(in_list_deep(response.channels[ch].uuids, {
                                                                uuid: uuid,
                                                                state: {name: 'name-' + uuid}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch1].uuids, {
                                                                uuid: uuid,
                                                                state: {name: 'name-' + uuid1}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch2].uuids, {
                                                                uuid: uuid,
                                                                state: {name: 'name-' + uuid2}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch3].uuids, {
                                                                uuid: uuid,
                                                                state: {name: 'name-' + uuid3}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.deepEqual(response.channels[ch].occupancy, 1);
                                                            assert.deepEqual(response.channels[ch1].occupancy, 1);
                                                            assert.deepEqual(response.channels[ch2].occupancy, 1);
                                                            assert.deepEqual(response.channels[ch3].occupancy, 1);
                                                            pubnub_pres.unsubscribe({channel: ch});
                                                            pubnub_pres.unsubscribe({channel: ch1});
                                                            pubnub_pres.unsubscribe({channel: ch2});
                                                            pubnub_pres.unsubscribe({channel: ch3});
                                                            done();
                                                        },
                                                        error: function () {
                                                            done(new Error("Error in #here_now() request"));
                                                        }
                                                    });
                                                }, 3000);
                                            },
                                            callback: function () {
                                            },
                                            error: function () {
                                                done(new Error("Error in #subscribe() level 3 request"));
                                            }
                                        })
                                    },
                                    callback: function () {
                                    },
                                    error: function () {
                                        done(new Error("Error in #subscribe() level 2 request"));
                                    }
                                })
                            },
                            callback: function () {
                            },
                            error: function () {
                                done(new Error("Error in #subscribe() level 1 request"));
                            }
                        })
                    },
                    callback: function () {
                    },
                    error: function () {
                        done(new Error("Error in #subscribe() level 0 request"));
                    }
                })
            }, 5000);
        });

        it("should return correct state for multiple uuids in single channel", function (done) {
            var ch = channel + '-' + 'here-now-' + get_random();

            pubnub_pres.state({
                channel: ch,
                uuid: uuid,
                state: {
                    name: 'name-' + uuid
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #0"));
                }
            });

            pubnub_pres.state({
                channel: ch,
                uuid: uuid1,
                state: {
                    name: 'name-' + uuid1
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid1
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #1"));
                }
            });

            pubnub_pres.state({
                channel: ch,
                uuid: uuid2,
                state: {
                    name: 'name-' + uuid2
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid2
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #2"));
                }
            });

            pubnub_pres.state({
                channel: ch,
                uuid: uuid3,
                state: {
                    name: 'name-' + uuid3
                },
                callback: function (r) {
                    assert.deepEqual(r, {
                            name: 'name-' + uuid3
                        }
                    );
                },
                error: function () {
                    done(new Error("Error in state request #3"));
                }
            });

            setTimeout(function () {
                pubnub_pres.subscribe({
                    channel: ch,
                    connect: function () {
                        pubnub_pres_1.subscribe({
                            channel: ch,
                            connect: function () {
                                pubnub_pres_2.subscribe({
                                    channel: ch,
                                    connect: function () {
                                        pubnub_pres_3.subscribe({
                                            channel: ch,
                                            connect: function () {
                                                setTimeout(function () {
                                                    pubnub_pres.here_now({
                                                        state: true,
                                                        callback: function (response) {
                                                            assert.ok(response.channels[ch], "subscribed channel should be present in payload");
                                                            assert.ok(in_list_deep(response.channels[ch].uuids, {
                                                                uuid: uuid,
                                                                state: {name: 'name-' + uuid}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch].uuids, {
                                                                uuid: uuid1,
                                                                state: {name: 'name-' + uuid1}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch].uuids, {
                                                                uuid: uuid2,
                                                                state: {name: 'name-' + uuid2}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.ok(in_list_deep(response.channels[ch].uuids, {
                                                                uuid: uuid3,
                                                                state: {name: 'name-' + uuid3}
                                                            }), "uuid should be there in the uuids list");
                                                            assert.deepEqual(response.channels[ch].occupancy, 4);
                                                            pubnub_pres.unsubscribe({channel: ch});
                                                            pubnub_pres_1.unsubscribe({channel: ch});
                                                            pubnub_pres_2.unsubscribe({channel: ch});
                                                            pubnub_pres_3.unsubscribe({channel: ch});
                                                            done();
                                                        },
                                                        error: function () {
                                                            done(new Error("Error in #here_now() request"));
                                                        }
                                                    });
                                                }, 3000);
                                            },
                                            callback: function () {
                                            },
                                            error: function () {
                                                done(new Error("Error in #subscribe() level 3 request"));
                                            }
                                        })
                                    },
                                    callback: function () {
                                    },
                                    error: function () {
                                        done(new Error("Error in #subscribe() level 2 request"));
                                    }
                                })
                            },
                            callback: function () {
                            },
                            error: function () {
                                done(new Error("Error in #subscribe() level 1 request"));
                            }
                        })
                    },
                    callback: function () {
                    },
                    error: function () {
                        done(new Error("Error in #subscribe() level 0 request"));
                    }
                })
            }, 5000);
        });

        it('should show occupancy 1 user if 1 user is subscribed to channel', function (done) {
            this.timeout(80000);

            var ch = channel + '-' + 'here-now';
            pubnub.subscribe({
                channel: ch,
                connect: function () {
                    setTimeout(function () {
                            pubnub.here_now({
                                channel: ch, callback: function (data) {
                                    assert.deepEqual(data.occupancy, 1);
                                    pubnub.unsubscribe({channel: ch});
                                    done();
                                }
                            })
                        }, 10000
                    );
                    pubnub.publish({
                        channel: ch, message: message_jsona,
                        callback: function (response) {
                            assert.deepEqual(response[0], 1);
                        }
                    });
                },
                callback: function (response) {
                    assert.deepEqual(response, message_jsona);
                }
            });
        })
    });

    describe('Channel Group', function () {
        describe('#channel_group_add_channel()', function () {
            it('should be able to add channels to channel groups', function (done) {
                var channels = 'a,b,c',
                    channel_group = 'r1' + Date.now();

                groups.push(channel_group);

                pubnub.channel_group_add_channel({
                    callback: function (r) {
                        pubnub.channel_group_list_channels({
                            channel_group: channel_group,
                            callback: function (r) {
                                assert.deepEqual(channels.split(','), r.channels);
                                done();
                            },
                            error: function (r) {
                                done(new Error("Error occurred in getting group list " + JSON.stringify(r)));
                            }
                        });
                    },
                    error: function (r) {
                        done(new Error("Error occurred in adding channel to group " + JSON.stringify(r)));
                    },
                    channels: channels,
                    channel_group: channel_group
                });
            });

            it('should be able to add channels to channel group with namespace', function (done) {
                var unique_suffix = Date.now();
                var channels = 'a,b,c';
                var namespace = 'ns' + unique_suffix;

                namespaces.push(namespace);

                var channel_group = namespace + ':' + 'r1' + unique_suffix;

                pubnub.channel_group_add_channel({
                    callback: function (r) {
                        assert.deepEqual(r.status, 200);
                        pubnub.channel_group_list_channels({
                            channel_group: channel_group,
                            callback: function (r) {
                                assert.deepEqual(channels.split(','), r.channels);
                                done();
                            },
                            error: function (r) {
                                done(new Error("Error occurred in getting group list " + JSON.stringify(r)));
                            }
                        });
                    },
                    error: function (r) {
                        done(new Error("Error occurred in adding channel to group " + JSON.stringify(r)));
                    },
                    add: true,
                    channels: channels,
                    channel_group: channel_group
                });
            })
        });

        describe('#channel_group_remove_channel()', function () {
            it('should be able to remove channels from channel group', function (done) {
                var channels = 'a,b,c';
                var channel_group = 'r1' + Date.now();
                groups.push(channel_group);

                pubnub.channel_group_add_channel({
                    callback: function (r) {
                        assert.deepEqual(r.status, 200);
                        pubnub.channel_group_list_channels({
                            channel_group: channel_group,
                            callback: function (r) {
                                assert.deepEqual(channels.split(','), r.channels);
                                pubnub.channel_group_remove_channel({
                                    callback: function () {
                                        setTimeout(function () {
                                            pubnub.channel_group_list_channels({
                                                channel_group: channel_group,
                                                callback: function (r) {
                                                    assert.deepEqual([], r.channels);
                                                    done();
                                                },
                                                error: function (r) {
                                                    done(new Error("Error occurred in getting group " + JSON.stringify(r)));
                                                }
                                            });
                                        }, 5000);
                                    },
                                    error: function (r) {
                                        done(new Error("Error occurred in removing channel from group " + JSON.stringify(r)));
                                    },
                                    channels: channels,
                                    channel_group: channel_group
                                });
                            },
                            error: function (r) {
                                done(new Error("Error occurred in getting group list " + JSON.stringify(r)));
                            }
                        });
                    },
                    error: function (r) {
                        done(new Error("Error occurred in adding channel to group " + JSON.stringify(r)));
                    },
                    channels: channels,
                    channel_group: channel_group
                });
            });

            it('should be able to remove channels to channel group with namespace', function (done) {
                var unique_suffix = get_random();
                var channels = 'a,b,c';
                var namespace = 'ns' + unique_suffix;
                var channel_group = namespace + ':' + 'r1' + unique_suffix;

                namespaces.push(namespace);

                pubnub.channel_group_add_channel({
                    callback: function (r) {
                        assert.deepEqual(r.status, 200);
                        pubnub.channel_group_list_channels({
                            channel_group: channel_group,
                            callback: function (r) {
                                assert.deepEqual(channels.split(','), r.channels);
                                pubnub.channel_group_remove_channel({
                                    callback: function () {
                                        setTimeout(function () {
                                            pubnub.channel_group_list_channels({
                                                channel_group: channel_group,
                                                callback: function (r) {
                                                    assert.deepEqual([], r.channels);
                                                    done();
                                                },
                                                error: function (r) {
                                                    done(new Error("Error occurred in getting group " + JSON.stringify(r)));
                                                }
                                            });
                                        }, 5000);
                                    },
                                    error: function (r) {
                                        done(new Error("Error occurred in removing channel from group " + JSON.stringify(r)));
                                    },
                                    channels: channels,
                                    channel_group: channel_group
                                });

                            },
                            error: function (r) {
                                done(new Error("Error occurred in getting group list " + JSON.stringify(r)));
                            }
                        });
                    },
                    error: function (r) {
                        done(new Error("Error occurred in adding channel to group " + JSON.stringify(r)));
                    },
                    channels: channels,
                    channel_group: channel_group
                });
            })
        });

        describe('#channel_group_list_groups()', function () {
            it('should be able to get all channel groups without namespace', function (done) {
                var channels = 'a,b,c';
                var channel_group = 'r1' + Date.now();

                pubnub.channel_group_add_channel({
                    callback: function (r) {
                        assert.deepEqual(r.status, 200);
                        pubnub.channel_group_list_groups({
                            callback: function (r) {
                                assert.ok(in_list_deep(r.groups, channel_group), "group not created");
                                done();
                            },
                            error: function (r) {
                                done(new Error("Error occurred in getting all group " + JSON.stringify(r)));
                            }
                        });
                    },
                    error: function (r) {
                        done(new Error("Error occurred in adding channel to group " + JSON.stringify(r)));
                    },
                    channels: channels,
                    channel_group: channel_group
                });
            });

            it('should be able to get all channel groups with namespace', function (done) {
                var unique_suffix = Date.now();
                var channels = 'a,b,c';
                var namespace = 'ns' + unique_suffix;
                var channel_group = namespace + ':' + 'r1' + unique_suffix;

                pubnub.channel_group_add_channel({
                    callback: function (r) {
                        assert.deepEqual(r.status, 200);
                        pubnub.channel_group_list_groups({
                            namespace: namespace,
                            callback: function (r) {
                                assert.ok(in_list_deep(r.groups, channel_group.split(':')[1]), "group not created");
                                done();
                            },
                            error: function (r) {
                                done(new Error("Error occurred in getting all group " + JSON.stringify(r)));
                            }
                        });
                    },
                    error: function (r) {
                        done(new Error("Error occurred in adding channel to group " + JSON.stringify(r)));
                    },
                    channels: channels,
                    channel_group: channel_group
                });
            })
        });

        describe('#channel_group_remove_group()', function () {
            it('should be able to remove channel group', function (done) {
                var unique_suffix = Date.now();
                var channels = 'a,b,c';
                var namespace = 'ns' + unique_suffix;
                var channel_group = namespace + ':' + 'r1' + unique_suffix;

                pubnub.channel_group_add_channel({
                    callback: function (r) {
                        assert.deepEqual(r.status, 200);
                        pubnub.channel_group_remove_group({
                            channel_group: channel_group,
                            callback: function (r) {
                                pubnub.channel_group_list_groups({
                                    namespace: namespace,
                                    callback: function (r) {
                                        assert.ok(!in_list_deep(r.groups, channel_group), "channel group not deleted");
                                        done();
                                    },
                                    error: function (r) {
                                        done(new Error("Error occurred in getting all group " + JSON.stringify(r)));
                                    }
                                });
                            },
                            error: function (r) {
                                done(new Error("Error occurred in removing group " + JSON.stringify(r)));
                            }
                        });
                    },
                    error: function (r) {
                        done(new Error("Error occurred in adding channel to group " + JSON.stringify(r)));
                    },
                    channels: channels,
                    channel_group: channel_group
                });
            })
        });

        describe('#channel_group_remove_namespace()', function () {
            it('should be able to remove namespace', function (done) {
                var unique_suffix = Date.now();
                var channels = 'a,b,c';
                var namespace = 'ns' + unique_suffix;
                var channel_group = namespace + ':' + 'r1' + unique_suffix;

                pubnub.channel_group_add_channel({
                    callback: function (r) {
                        assert.deepEqual(r.status, 200);
                        pubnub.channel_group_list_namespaces({
                            callback: function (r) {
                                assert.ok(in_list_deep(r.namespaces, namespace), "namespace not created");
                                pubnub.channel_group_remove_namespace({
                                    namespace: namespace,
                                    callback: function () {
                                        setTimeout(function () {
                                            pubnub.channel_group_list_namespaces({
                                                callback: function (r) {
                                                    assert.ok(!in_list_deep(r.namespaces, namespace), "namespace not deleted");
                                                    done();
                                                },
                                                error: function (r) {
                                                    done(new Error("Error occurred in getting all namespaces" + JSON.stringify(r)));
                                                }
                                            });
                                        }, 5000);
                                    },
                                    error: function (r) {
                                        done(new Error("Error occurred in removing namespace " + JSON.stringify(r)));
                                    }
                                });
                            },
                            error: function (r) {
                                done(new Error("Error occurred in listing namespaces " + JSON.stringify(r)));
                            }
                        });
                    },
                    error: function (r) {
                        done(new Error("Error occurred in adding channel to group " + JSON.stringify(r)));
                    },
                    channels: channels,
                    channel_group: channel_group
                });
            })
        })
    });
});
