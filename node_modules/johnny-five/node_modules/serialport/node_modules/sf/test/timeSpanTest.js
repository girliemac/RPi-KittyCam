'use strict';

var sf = require('../');

module.exports = {
  'simple': function (test) {
    var result = sf("a{0:y 'Years,' M 'Months,' d 'Days,' h 'Hours,' m 'Minutes,' s 'Seconds,' f 'Fractions of seconds'}b", new sf.TimeSpan(8173818181));
    test.equals(result, 'a0 Years, 3 Months, 4 Days, 14 Hours, 30 Minutes, 18 Seconds, 181 Fractions of secondsb');
    test.done();
  },

  'total simple': function (test) {
    var result = sf("a{0:^y 'Years or' ^M 'Months or' ^d 'Days or' ^h 'Hours or' ^m 'Minutes or' ^s 'Seconds or' ^f 'Fractions of seconds'}b", new sf.TimeSpan(8173818181));
    test.equals(result, 'a0 Years or 3 Months or 94 Days or 2270 Hours or 136230 Minutes or 8173818 Seconds or 8173818181 Fractions of secondsb');
    test.done();
  },

  'padding': function (test) {
    var result = sf("a{0:yy, MM, dd, hh, mm, ss, fff}b", new sf.TimeSpan(8173818181));
    test.equals(result, 'a00, 03, 04, 14, 30, 18, 181b');
    test.done();
  },

  'uptime': function (test) {
    var result = sf("a{0:^d 'Days,' h:mm:ss.fff}b", new sf.TimeSpan(8173818181));
    test.equals(result, 'a94 Days, 14:30:18.181b');
    test.done();
  }
};
