var test = require('tape');
var toPrimitive = require('../es5');
var is = require('object-is');
var forEach = require('foreach');
var debug = require('util').inspect;

var primitives = [null, undefined, true, false, 0, -0, 42, NaN, Infinity, -Infinity, '', 'abc'];

test('primitives', function (t) {
	forEach(primitives, function (i) {
		t.ok(is(toPrimitive(i), i), 'toPrimitive(' + debug(i) + ') returns the same value');
		t.ok(is(toPrimitive(i, String), i), 'toPrimitive(' + debug(i) + ', String) returns the same value');
		t.ok(is(toPrimitive(i, Number), i), 'toPrimitive(' + debug(i) + ', Number) returns the same value');
	});
	t.end();
});

test('Arrays', function (t) {
	var arrays = [[], ['a', 'b'], [1, 2]];
	forEach(arrays, function (arr) {
		t.ok(is(toPrimitive(arr), Number(arr)), 'toPrimitive(' + debug(arr) + ') returns the number version of the array');
		t.equal(toPrimitive(arr, String), String(arr), 'toPrimitive(' + debug(arr) + ') returns the string version of the array');
		t.ok(is(toPrimitive(arr, Number), Number(arr)), 'toPrimitive(' + debug(arr) + ') returns the number version of the array');
	});
	t.end();
});

test('Dates', function (t) {
	var dates = [new Date(), new Date(0), new Date(NaN)];
	forEach(dates, function (date) {
		t.equal(toPrimitive(date), String(date), 'toPrimitive(' + debug(date) + ') returns the string version of the date');
		t.equal(toPrimitive(date, String), String(date), 'toPrimitive(' + debug(date) + ') returns the string version of the date');
		t.ok(is(toPrimitive(date, Number), Number(date)), 'toPrimitive(' + debug(date) + ') returns the number version of the date');
	});
	t.end();
});

var coercibleObject = { valueOf: function () { return 3; }, toString: function () { return 42; } };
var valueOfOnlyObject = { valueOf: function () { return 4; }, toString: function () { return {}; } };
var toStringOnlyObject = { valueOf: function () { return {}; }, toString: function () { return 7; } };
var coercibleFnObject = { valueOf: function () { return function valueOfFn() {}; }, toString: function () { return 42; } };
var uncoercibleObject = { valueOf: function () { return {}; }, toString: function () { return {}; } };
var uncoercibleFnObject = { valueOf: function () { return function valueOfFn() {}; }, toString: function () { return function toStrFn() {}; } };

test('Objects', function (t) {
	t.equal(toPrimitive(coercibleObject), coercibleObject.valueOf(), 'coercibleObject with no hint coerces to valueOf');
	t.equal(toPrimitive(coercibleObject, String), String(coercibleObject.toString()), 'coercibleObject with hint String coerces to stringified toString');
	t.equal(toPrimitive(coercibleObject, Number), coercibleObject.valueOf(), 'coercibleObject with hint Number coerces to valueOf');

	t.equal(toPrimitive(coercibleFnObject), coercibleFnObject.toString(), 'coercibleFnObject coerces to non-stringified toString');
	t.equal(toPrimitive(coercibleFnObject, String), String(coercibleFnObject.toString()), 'coercibleFnObject with hint String coerces to stringified toString');
	t.equal(toPrimitive(coercibleFnObject, Number), coercibleFnObject.toString(), 'coercibleFnObject with hint Number coerces to non-stringified toString');

	t.ok(is(toPrimitive({}), NaN), '{} with no hint coerces to NaN');
	t.equal(toPrimitive({}, String), '[object Object]', '{} with hint String coerces to Object#toString');
	t.ok(is(toPrimitive({}, Number), NaN), '{} with hint Number coerces to NaN');

	t.equal(toPrimitive(toStringOnlyObject), toStringOnlyObject.toString(), 'toStringOnlyObject returns non-stringified toString');
	t.equal(toPrimitive(toStringOnlyObject, String), String(toStringOnlyObject.toString()), 'toStringOnlyObject with hint String returns stringified toString');
	t.equal(toPrimitive(toStringOnlyObject, Number), toStringOnlyObject.toString(), 'toStringOnlyObject with hint Number returns non-stringified toString');

	t.equal(toPrimitive(valueOfOnlyObject), valueOfOnlyObject.valueOf(), 'valueOfOnlyObject returns valueOf');
	t.equal(toPrimitive(valueOfOnlyObject, String), String(valueOfOnlyObject.valueOf()), 'valueOfOnlyObject with hint String returns stringified valueOf');
	t.equal(toPrimitive(valueOfOnlyObject, Number), valueOfOnlyObject.valueOf(), 'valueOfOnlyObject with hint Number returns valueOf');

	t.throws(function () { return toPrimitive(uncoercibleObject); }, TypeError, 'uncoercibleObject throws a TypeError');
	t.throws(function () { return toPrimitive(uncoercibleObject, String); }, TypeError, 'uncoercibleObject with hint String throws a TypeError');
	t.throws(function () { return toPrimitive(uncoercibleObject, Number); }, TypeError, 'uncoercibleObject with hint Number throws a TypeError');

	t.throws(function () { return toPrimitive(uncoercibleFnObject); }, TypeError, 'uncoercibleFnObject throws a TypeError');
	t.throws(function () { return toPrimitive(uncoercibleFnObject, String); }, TypeError, 'uncoercibleFnObject with hint String throws a TypeError');
	t.throws(function () { return toPrimitive(uncoercibleFnObject, Number); }, TypeError, 'uncoercibleFnObject with hint Number throws a TypeError');
	t.end();
});
