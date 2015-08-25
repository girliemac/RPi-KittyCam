'use strict';

var define = require('define-properties');
var ES = require('es-abstract/es6');
var $isNaN = Number.isNaN || function (a) { return a !== a; };
var $isFinite = Number.isFinite || function (n) { return typeof n === 'number' && global.isFinite(n); };

var includesShim = function includes(searchElement) {
	var fromIndex = arguments.length > 1 ? ES.ToInteger(arguments[1]) : 0;
	if (Array.prototype.indexOf && !$isNaN(searchElement) && $isFinite(fromIndex) && typeof searchElement !== 'undefined') {
		return Array.prototype.indexOf.apply(this, arguments) > -1;
	}

	var O = ES.ToObject(this);
	var length = ES.ToLength(O.length);
	if (length === 0) {
		return false;
	}
	var k = fromIndex >= 0 ? fromIndex : Math.max(0, length + fromIndex);
	while (k < length) {
		if (ES.SameValueZero(searchElement, O[k])) {
			return true;
		}
		k += 1;
	}
	return false;
};

/*eslint-disable no-unused-vars */
var boundIncludesShim = function includes(array, searchElement) {
/*eslint-enable no-unused-vars */
	ES.RequireObjectCoercible(array);
	return includesShim.apply(array, Array.prototype.slice.call(arguments, 1));
};
define(boundIncludesShim, {
	method: includesShim,
	shim: function shimArrayPrototypeIncludes() {
		define(Array.prototype, {
			includes: includesShim
		});
		return Array.prototype.includes || includesShim;
	}
});

module.exports = boundIncludesShim;
