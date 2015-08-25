    var assert = require('assert');
    var PUBNUB = require('../pubnub.js');

    var pubnub = PUBNUB.init({
        publish_key     : 'demo',
        subscribe_key     : 'demo'
    });

    var channel = 'javascript-test-channel';
    var count = 0;

    var message_string = 'Hi from Javascript';

    describe('Pubnub', function() {
        this.timeout(40000);
        describe('#publish()', function(){
            it('should publish json arrays without error 1', function(done){
                        pubnub.publish({channel: channel , message : message_string,
                            callback : function(response) {
                                done()
                            }
                        });

            })
            it('should publish json arrays without error 1', function(done){
                        pubnub.publish({channel: channel , message : message_string,
                            callback : function(response) {
                                done()
                            }
                        });

            })
            it('should publish json arrays without error 1', function(done){
                        pubnub.publish({channel: channel , message : message_string,
                            callback : function(response) {
                                done()
                            }
                        });

            })
            it('should publish json arrays without error 1', function(done){
                        pubnub.publish({channel: channel , message : message_string,
                            callback : function(response) {
                                done()
                            }
                        });

            })
            it('should publish json arrays without error 1', function(done){
                        pubnub.publish({channel: channel , message : message_string,
                            callback : function(response) {
                                done()
                            }
                        });

            })
            it('should publish json arrays without error 1', function(done){
                        pubnub.publish({channel: channel , message : message_string,
                            callback : function(response) {
                                done()
                            }
                        });

            })
            it('should publish json arrays without error 1', function(done){
                        pubnub.publish({channel: channel , message : message_string,
                            callback : function(response) {
                                done()
                            }
                        });

            })
            it('should publish json arrays without error 1', function(done){
                        pubnub.publish({channel: channel , message : message_string,
                            callback : function(response) {
                                done()
                            }
                        });

            })
        })
    })
