var sf = require('../');
var timezoneJS = require('timezone-js');
timezoneJS.timezone.loadingScheme = timezoneJS.timezone.loadingSchemes.MANUAL_LOAD;
timezoneJS.timezone.loadZoneDataFromObject({
  zones: {
    "Etc/UTC": [
      ["0", "-", "UTC"]
    ]
  }
});


module.exports = {
  'integer location': function(test) {
    var result = sf("a{0}b{1}c{0}", 154, 298);
    test.equals(result, 'a154b298c154');
    test.done();
  },

  'json location': function(test) {
    var result = sf("a{a}b{b}c{a}", { a: 1, b: 2 });
    test.equals(result, 'a1b2c1');
    test.done();
  },

  'nested location': function(test) {
    var result = sf("a{a.b.c}b", {a: {b: {c: 'test'}}});
    test.equals(result, 'atestb');
    test.done();
  },

  'nested location using brackets': function(test) {
    var result = sf("a{a['b']['c']}b", {a: {b: {c: 'test'}}});
    test.equals(result, 'atestb');
    test.done();
  },

  'nested location (undefined)': function(test) {
    try {
      var result = sf("a{a.z.c}b", {a: {b: {c: 'test'}}});
      test.fail("should throw");
    } catch (ex) {
      test.equals("Cannot read property \'c\' of undefined", ex.message);
    }
    test.done();
  },

  'nested location (undefined, safe ok)': function(test) {
    var result = sf("a{a.?b.?c}b", {a: {b: {c: 'test'}}});
    test.equals(result, 'atestb');
    test.done();
  },

  'nested location (undefined, safe fail)': function(test) {
    var result = sf("a{a.?z.?c}b", {a: {b: {c: 'test'}}});
    test.equals(result, 'ab');
    test.done();
  },

  'array index location': function(test) {
    var result = sf("a{a[1]}b", {a: [ '1', '2' ]});
    test.equals(result, 'a2b');
    test.done();
  },

  'array of arrays index location': function(test) {
    var result = sf("a{a[1][2]}b", {a: [ '1', ['a', 'b', 'c'] ]});
    test.equals(result, 'acb');
    test.done();
  },

  'array index location (negative)': function(test) {
    var result = sf("a{a[-1]}b", {a: [ '1', '2', '3' ]});
    test.equals(result, 'a3b');
    test.done();
  },

  'array index location (out of bounds)': function(test) {
    try {
      var result = sf("a{a[3].c}b", {a: [ '1', '2', '3' ]});
      test.fail("should throw");
    } catch (ex) {
      test.equals("Cannot read property \'c\' of undefined", ex.message);
    }
    test.done();
  },

  'align left': function(test) {
    var result = sf("a{0,-10}b", 'test');
    test.equals(result, 'atest      b');
    test.done();
  },

  'align right': function(test) {
    var result = sf("a{0,10}b", 'test');
    test.equals(result, 'a      testb');
    test.done();
  },

  'align with number format': function(test) {
    var result = sf("a{0,10:#,###}b", 5000);
    test.equals(result, 'a     5,000b');
    test.done();
  },

  '12 hour format midnight': function(test) {
    var result = sf("a{0:hhtt}b", new Date(2012, 1, 2, 0, 4, 5));
    test.equals(result, 'a12AMb');
    test.done();
  },

  '12 hour format noon': function(test) {
    var result = sf("a{0:hhtt}b", new Date(2012, 1, 2, 12, 4, 5));
    test.equals(result, 'a12PMb');
    test.done();
  },

  'align with date format': function(test) {
    var result = sf("a{0,20:yyyy-MM-dd'T'HH:mm:ss}b", new Date(2012, 1, 2, 3, 4, 5));
    test.equals(result, 'a 2012-02-02T03:04:05b');
    test.done();
  },

  'bunched together date formatting': function(test) {
    var result = sf("a{0:yyyyMMddHHmmss}b", new Date(2012, 1, 2, 3, 4, 5));
    test.equals(result, 'a20120202030405b');
    test.done();
  },

  'number format (comma)': function(test) {
    var result = sf("a{0:#,###}b", 5000);
    test.equals(result, 'a5,000b');
    test.done();
  },

  'number format (negative)': function(test) {
    var result = sf("a{0:#,###}b", -5000);
    test.equals(result, 'a-5,000b');
    test.done();
  },

  'number format (positive)': function(test) {
    var result = sf("a{0:+#,###}b", 5000);
    test.equals(result, 'a+5,000b');
    test.done();
  },

  'number format (positive, negative number)': function(test) {
    var result = sf("a{0:+#,###}b", -5000);
    test.equals(result, 'a-5,000b');
    test.done();
  },

  'number format (decimal)': function(test) {
    var result = sf("a{0:#,###.00}b", -5000);
    test.equals(result, 'a-5,000.00b');
    test.done();
  },

  'number format (decimal, overflow)': function(test) {
    var result = sf("a{0:#,###.00}b", -5000.123);
    test.equals(result, 'a-5,000.12b');
    test.done();
  },

  'number format (decimal, optional)': function(test) {
    var result = sf("a{0:#,###.##}b", -5000);
    test.equals(result, 'a-5,000b');
    test.done();
  },

  'number format (decimal, optional overflow)': function(test) {
    var result = sf("a{0:#,###.##}b", -5000.123);
    test.equals(result, 'a-5,000.12b');
    test.done();
  },

  'number format (hex)': function(test) {
    var result = sf("a{0:x}b", 500);
    test.equals(result, 'a1f4b');
    test.done();
  },

  'number format (hex upper)': function(test) {
    var result = sf("a{0:X}b", 500);
    test.equals(result, 'a1F4b');
    test.done();
  },

  'number format (hex, length)': function(test) {
    var result = sf("a{0:x4}b", 500);
    test.equals(result, 'a01f4b');
    test.done();
  },

  'number format (hex upper, length)': function(test) {
    var result = sf("a{0:X4}b", 500);
    test.equals(result, 'a01F4b');
    test.done();
  },

  'number format (zero)': function(test) {
    var result = sf("a{0}b", 0);
    test.equals(result, 'a0b');
    test.done();
  },

  'number format (zero, just number placeholder)': function(test) {
    var result = sf("a{0:#}b", 0);
    test.equals(result, 'a0b');
    test.done();
  },

  'date format (Short date)': function(test) {
    var result = sf("a{0:sd}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a2/2/2012b');
    test.done();
  },

  'date format (Long date)': function(test) {
    var result = sf("a{0:D}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aFebruary 02, 2012b');
    test.done();
  },

  'date format (Short time)': function(test) {
    var result = sf("a{0:t}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a03:04 AMb');
    test.done();
  },

  'date format (Long time)': function(test) {
    var result = sf("a{0:T}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a03:04:05 AMb');
    test.done();
  },

  'date format (Full date & time)': function(test) {
    var result = sf("a{0:fdt}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aFebruary 02, 2012 03:04 AMb');
    test.done();
  },

  'date format (Full date & time (long))': function(test) {
    var result = sf("a{0:F}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aFebruary 02, 2012 03:04:05 AMb');
    test.done();
  },

  'date format (Default date & time)': function(test) {
    var result = sf("a{0:g}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a2/2/2012 03:04 AMb');
    test.done();
  },

  'date format (Default date & time (long))': function(test) {
    var result = sf("a{0:G}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a2/2/2012 03:04:05 AMb');
    test.done();
  },

  'date format (Month day pattern)': function(test) {
    var result = sf("a{0:md}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aFebruary 02b');
    test.done();
  },

  'date format (RFC1123 date string)': function(test) {
    var result = sf("a{0:r}b", new timezoneJS.Date(2012, 1, 2, 3, 4, 5, 6, 'Etc/UTC'));
    test.equals(result, 'aThu, 02 Feb 2012 03:04:05 +0000b');
    test.done();
  },

  'date format (Sortable date string)': function(test) {
    var result = sf("a{0:s}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a2012-02-02:03:04:05b');
    test.done();
  },

  'date format (single digit date)': function(test) {
    var result = sf("a{0:d}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a2b');
    test.done();
  },

  'date format (multidigit date)': function(test) {
    var result = sf("a{0:dd}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a02b');
    test.done();
  },

  'date format (Short day of week)': function(test) {
    var result = sf("a{0:ddd}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aThub');
    test.done();
  },

  'date format (long day of week)': function(test) {
    var result = sf("a{0:dddd}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aThursdayb');
    test.done();
  },

  'date format (millis 1)': function(test) {
    var result = sf("a{0:f}b", new Date(2012, 1, 2, 3, 4, 5, 129));
    test.equals(result, 'a1b');
    test.done();
  },

  'date format (millis 2)': function(test) {
    var result = sf("a{0:ff}b", new Date(2012, 1, 2, 3, 4, 5, 129));
    test.equals(result, 'a12b');
    test.done();
  },

  'date format (millis 3)': function(test) {
    var result = sf("a{0:fff}b", new Date(2012, 1, 2, 3, 4, 5, 129));
    test.equals(result, 'a129b');
    test.done();
  },

  'date format (hours 12 hour format 1)': function(test) {
    var result = sf("a{0:h}b", new Date(2012, 1, 2, 13, 4, 5, 6));
    test.equals(result, 'a1b');
    test.done();
  },

  'date format (hours 12 hour format 2)': function(test) {
    var result = sf("a{0:hh}b", new Date(2012, 1, 2, 13, 4, 5, 6));
    test.equals(result, 'a01b');
    test.done();
  },

  'date format (hours 24 hour format 1)': function(test) {
    var result = sf("a{0:H}b", new Date(2012, 1, 2, 13, 4, 5, 6));
    test.equals(result, 'a13b');
    test.done();
  },

  'date format (hours 24 hour format 2)': function(test) {
    var result = sf("a{0:HH}b", new Date(2012, 1, 2, 13, 4, 5, 6));
    test.equals(result, 'a13b');
    test.done();
  },

  'date format (minutes)': function(test) {
    var result = sf("a{0:mm}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a04b');
    test.done();
  },

  'date format (month 1)': function(test) {
    var result = sf("a{0:M}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a2b');
    test.done();
  },

  'date format (month 2)': function(test) {
    var result = sf("a{0:MM}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a02b');
    test.done();
  },

  'date format (month short)': function(test) {
    var result = sf("a{0:MMM}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aFebb');
    test.done();
  },

  'date format (month long)': function(test) {
    var result = sf("a{0:MMMM}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aFebruaryb');
    test.done();
  },

  'date format (seconds)': function(test) {
    var result = sf("a{0:ss}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a05b');
    test.done();
  },

  'date format (year 2)': function(test) {
    var result = sf("a{0:yy}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a12b');
    test.done();
  },

  'date format (year 4)': function(test) {
    var result = sf("a{0:yyyy}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'a2012b');
    test.done();
  },

  'date format (timezone)': function(test) {
    var result = sf("a{0:zz}b", new timezoneJS.Date(2012, 1, 2, 3, 4, 5, 6, 'Etc/UTC'));
    test.equals(result, 'a00b');
    test.done();
  },

  'date format (timezone +)': function(test) {
    var result = sf("a{0:+zz}b", new timezoneJS.Date(2012, 1, 2, 3, 4, 5, 6, 'Etc/UTC'));
    test.equals(result, 'a+00b');
    test.done();
  },

  'date format (whole timezone)': function(test) {
    var result = sf("a{0:zzz}b", new timezoneJS.Date(2012, 1, 2, 3, 4, 5, 6, 'Etc/UTC'));
    test.equals(result, 'a00:00b');
    test.done();
  },

  'date format (rfc 822/1123 timezone)': function(test) {
    var result = sf("a{0:+zzzz}b", new timezoneJS.Date(2012, 1, 2, 3, 4, 5, 6, 'Etc/UTC'));
    test.equals(result, 'a+0000b');
    test.done();
  },

  'date format (whole timezone no colon)': function(test) {
    var result = sf("a{0:zzzz}b", new timezoneJS.Date(2012, 1, 2, 3, 4, 5, 6, 'Etc/UTC'));
    test.equals(result, 'a0000b');
    test.done();
  },

  'date format (bad format)': function(test) {
    var result = sf("a{0:aaa}b", new Date(2012, 1, 2, 3, 4, 5, 6));
    test.equals(result, 'aaaab');
    test.done();
  },

  'string with bad format spec': function(test) {
    try {
      sf("a{0:aaa}b", 'a');
      test.fail("should throw");
    } catch (ex) {
    }
    test.done();
  },

  'object with inspect': function(test) {
    var result = sf("a{0:inspect}b", { a: 1, b: 'test', c: { d: { e: { f: 'down' }}} });
    test.equals(result, 'a{ a: 1, b: \'test\', c: { d: { e: [Object] } } }b');
    test.done();
  },

  'object with json': function(test) {
    var result = sf("a{0:json}b", { a: 1, b: 'test', c: { d: { e: { f: 'down' }}} });
    test.equals(result, 'a{"a":1,"b":"test","c":{"d":{"e":{"f":"down"}}}}b');
    test.done();
  },

  'object with indent': function(test) {
    var result = sf("{0:indent}", { a: 1, b: 'test', c: { d: { e: { f: 'down' }}}, d: true, e: new timezoneJS.Date(2012, 1, 2, 3, 4, 5, 6, 'Etc/UTC') });
    test.equals(result, 'a: 1\nb: test\nc:\n  d:\n    e:\n      f: down\nd: true\ne: Thu, 02 Feb 2012 03:04:05 +0000');
    test.done();
  },

  'object with buffer with indent': function(test) {
    var result = sf("{0:indent}", { a: new Buffer([1, 2, 3]) });
    test.equals(result, 'a: Buffer[1, 2, 3] (length: 3)');
    test.done();
  },

  'object with long buffer with indent': function(test) {
    var result = sf("{0:indent}", { a: new Buffer([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) });
    test.equals(result, 'a: Buffer[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...] (length: 12)');
    test.done();
  },

  'unterminated sub': function(test) {
    try {
      sf("a{0", 4);
      test.fail("should throw");
    } catch (ex) {
    }
    test.done();
  },

  'unescaped substitution': function(test) {
    try {
      sf("a}b", 4);
      test.fail("should throw");
    } catch (ex) {
    }
    test.done();
  },

  'escaped sub': function(test) {
    var result = sf("a{{0}}b", 6);
    test.equals(result, 'a{0}b');
    test.done();
  },

  'sub at end': function(test) {
    try {
      sf("a{", 4);
      test.fail("should throw");
    } catch (ex) {
      test.equals("Unterminated substitution", ex.message);
    }
    test.done();
  },

  'close sub at end': function(test) {
    try {
      sf("a}", 4);
      test.fail("should throw");
    } catch (ex) {
      test.equals("Unescaped substitution", ex.message);
    }
    test.done();
  },

  'errors': function(test) {
    var err = new Error("Test error");
    var result = sf("a{0}b", err);
    test.ok(result.indexOf('Error: Test error') == 1, 'Could not find or bad location of "Error: Test error"\n\n' + result + '\n\n');
    test.ok(result.indexOf('stringFormatTest') > 0, 'Could not find or bad location of "stringFormatTest"\n\n' + result + '\n\n');
    test.done();
  },

  'errors just the message': function(test) {
    var err = new Error("Test error");
    var result = sf("a{0:message}b", err);
    test.equals(result, 'aTest errorb');
    test.done();
  },

  'console functions': function(test) {
    sf.log('test {0}', 'test');
    sf.info('test {0}', 'test');
    sf.warn('test {0}', 'test');
    sf.error('test {0}', 'test');
    test.done();
  }
};
