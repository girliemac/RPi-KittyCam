var includes = require('../');
includes.shim();

var test = require('tape');
var defineProperties = require('define-properties');
var bind = require('function-bind');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = function f() {}.name === 'f';

test('shimmed', function (t) {
	t.equal(Array.prototype.includes.length, 1, 'Array#includes has a length of 1');
	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(Array.prototype.includes.name, 'includes', 'Array#includes has name "includes"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(Array.prototype, 'includes'), 'Array#includes is not enumerable');
		et.end();
	});

	var supportsStrictMode = (function () {
		'use strict';

		var fn = function () { return this === null; };
		return fn.call(null);
	}());

	t.test('bad array/this value', { skip: !supportsStrictMode }, function (st) {
		'use strict';

		st.throws(function () { return includes(undefined, 'a'); }, TypeError, 'undefined is not an object');
		st.throws(function () { return includes(null, 'a'); }, TypeError, 'null is not an object');
		st.end();
	});

	require('./tests')(bind.call(Function.call, Array.prototype.includes), t);

	t.end();
});
