// !!! Note, moment module required 
// npm install moment

var PUBNUB = require("../pubnub.js")

var moment = require('moment')

var pubnub = PUBNUB({
    publish_key   : "demo-36",
    subscribe_key : "demo-36"
});


var suffix = '';
var sn = 0;
var interval = 10000;
var intloop;
var prefix = 'bot_channel'

function get_pub_channel() {
	return prefix + suffix;
}

function get_control_channel() {
	return prefix + suffix + '_control'
}

function log(r) {
	console.log(JSON.stringify(r));
}

function success3(r,c,m) {
	console.log('SUCCESS ' + JSON.stringify(r) + '   ' + JSON.stringify(c) + '   ' + JSON.stringify(m));
}

function error3(r,c,m) {
	console.log('ERROR ' + JSON.stringify(r) + '   ' + JSON.stringify(c) + '   ' + JSON.stringify(m));
}

function publish(obj) {
	var m = obj || {
			'sn' : ++sn,
			'ts' : moment().utc().format('YYYY-MM-DD hh:mm:ss')
		};
	var c = get_pub_channel();
	pubnub.publish({
		channel : c,
		callback : function(r) {
			success3(r,c,m);
			clearTimeout(intloop);
			intloop = setTimeout(function(){
				publish();
			},interval)
		},
		error : function(r) {
			error3(r,c,m);
			clearTimeout(intloop);
			intloop = setTimeout(function(){
				publish(m);
			},1000);
		},
		message : m
	})
}

pubnub.subscribe({
	channel : get_control_channel(),
	callback : function(r) {
		log(r);
		suffix = r.suffix || suffix || '';
		prefix = r.prefix || prefix || 'bot_channel';
		sn = r.sn || sn;
		if (r.interval) {
			interval = r.interval;
			clearTimeout(intloop);
			intloop = setTimeout(function(){
				publish();
			}, interval)
		}
	}
})

publish();