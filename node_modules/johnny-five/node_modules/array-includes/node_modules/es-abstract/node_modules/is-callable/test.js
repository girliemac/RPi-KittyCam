'use strict';

var test = require('tape');
var isCallable = require('./');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
var genFn = require('make-generator-function');
var arrowFn = require('make-arrow-function')();

test('not callables', function (t) {
	t.notOk(isCallable(), 'undefined is not callable');
	t.notOk(isCallable(null), 'null is not callable');
	t.notOk(isCallable(false), 'false is not callable');
	t.notOk(isCallable(true), 'true is not callable');
	t.notOk(isCallable([]), 'array is not callable');
	t.notOk(isCallable({}), 'object is not callable');
	t.notOk(isCallable(/a/g), 'regex literal is not callable');
	t.notOk(isCallable(new RegExp('a', 'g')), 'regex object is not callable');
	t.notOk(isCallable(new Date()), 'new Date() is not callable');
	t.notOk(isCallable(42), 'number is not callable');
	t.notOk(isCallable(Object(42)), 'number object is not callable');
	t.notOk(isCallable(NaN), 'NaN is not callable');
	t.notOk(isCallable(Infinity), 'Infinity is not callable');
	t.notOk(isCallable('foo'), 'string primitive is not callable');
	t.notOk(isCallable(Object('foo')), 'string object is not callable');
	t.end();
});

test('@@toStringTag', { skip: !hasSymbols || !Symbol.toStringTag }, function (t) {
	var fn = function () { return 3; };
	var fakeFunction = { valueOf: function () { return fn; }, toString: function () { return String(fn); } };
	fakeFunction[Symbol.toStringTag] = function () { return 'Function'; };
	t.notOk(isCallable(fakeFunction), 'fake Function with @@toStringTag "Function" is not callable');
	t.end();
});

test('Functions', function (t) {
	t.ok(isCallable(function () {}), 'function is callable');
	t.ok(isCallable(isCallable), 'isCallable is callable');
	t.end();
});

test('Generators', { skip: !genFn }, function (t) {
	t.ok(isCallable(genFn), 'generator function is callable');
	t.end();
});

test('Arrow functions', { skip: !arrowFn }, function (t) {
	t.ok(isCallable(arrowFn), 'arrow function is callable');
	t.end();
});
