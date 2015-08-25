'use strict';

var getDay = Date.prototype.getDay;

module.exports = function isDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
