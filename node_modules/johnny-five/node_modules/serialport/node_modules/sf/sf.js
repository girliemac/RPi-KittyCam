'use strict';

var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function padLeft(str, char, totalWidth) {
  while (str.length < totalWidth) {
    str = char + str;
  }
  return str;
}

function padRight(str, char, totalWidth) {
  while (str.length < totalWidth) {
    str = str + char;
  }
  return str;
}

function formatNumber(num, format) {
  format = format || "0";

  var hex = format.match(/^([xX])([0-9]*)$/);
  if (hex) {
    var str = num.toString(16);
    if (hex[1] == 'x') {
      str = str.toLowerCase();
    } else {
      str = str.toUpperCase();
    }
    var width = parseInt(hex[2]);
    str = padLeft(str, '0', width);
    return str;
  }

  var negative = false;
  if (num < 0) {
    num = -num;
    negative = true;
  }

  var addPositiveSign = false;
  if (format.match(/^\+/)) {
    format = format.substr(1);
    addPositiveSign = true;
  }

  var formatParts = format.split('.');
  var formatBeforeDecimal = formatParts[0];
  var wholeNumber = Math.floor(num);
  var decimalVal = num - wholeNumber;
  var result = '';
  var wholeNumberStr = wholeNumber.toString();
  var formatIdx, numberIdx;

  // format whole number part
  for (formatIdx = formatBeforeDecimal.length - 1, numberIdx = wholeNumberStr.length - 1; numberIdx >= 0 || formatIdx >= 0; formatIdx--) {
    if (formatIdx < 0 && numberIdx >= 0) {
      result = wholeNumberStr[numberIdx--] + result;
      continue;
    }

    if (formatBeforeDecimal[formatIdx] == '0' || formatBeforeDecimal[formatIdx] == '#') {
      if (numberIdx >= 0) {
        result = wholeNumberStr[numberIdx--] + result;
      } else {
        if (formatBeforeDecimal[formatIdx] == '#') {
          break;
        }
        result = '0' + result;
      }
      continue;
    }

    result = formatBeforeDecimal[formatIdx] + result;
  }
  result = result.replace(/^[^0-9]+/, '');

  // format decimal part
  if (formatParts.length > 1) {
    var formatAfterDecimal = formatParts[1];
    var decimalValStr = decimalVal.toString().substr(2);

    result += '.';
    for (formatIdx = 0, numberIdx = 0; formatIdx < formatAfterDecimal.length; formatIdx++) {
      if (formatAfterDecimal[formatIdx] == '0' || formatAfterDecimal[formatIdx] == '#') {
        if (numberIdx < decimalValStr.length) {
          result += decimalValStr[numberIdx++];
        } else {
          if (formatAfterDecimal[formatIdx] == '#') {
            break;
          }
          result += '0';
        }
      } else {
        result += formatAfterDecimal[formatIdx];
      }
    }
  }

  if (result[result.length - 1] == '.') {
    result = result.substr(0, result.length - 1);
  }

  if (negative) {
    result = '-' + result;
  }
  if (!negative && addPositiveSign) {
    result = '+' + result;
  }

  return result;
}

function formatTimeSpanPart(timeSpan, format, width) {
  var formatStr = "{0:";
  for (var i = 0; i < width; i++) {
    formatStr += '0';
  }
  formatStr += "}";

  switch (format) {
  case 'y':
    return sf(formatStr, timeSpan.years);
  case 'M':
    return sf(formatStr, timeSpan.months);
  case 'd':
    return sf(formatStr, timeSpan.days);
  case 'h':
    return sf(formatStr, timeSpan.hours);
  case 'm':
    return sf(formatStr, timeSpan.minutes);
  case 's':
    return sf(formatStr, timeSpan.seconds);
  case 'f':
    return sf(formatStr, timeSpan.milliseconds);
  case '^y':
    return sf(formatStr, timeSpan.totalYears);
  case '^M':
    return sf(formatStr, timeSpan.totalMonths);
  case '^d':
    return sf(formatStr, timeSpan.totalDays);
  case '^h':
    return sf(formatStr, timeSpan.totalHours);
  case '^m':
    return sf(formatStr, timeSpan.totalMinutes);
  case '^s':
    return sf(formatStr, timeSpan.totalSeconds);
  case '^f':
    return sf(formatStr, timeSpan.totalMilliseconds);
  default:
    throw new Error("unhandled time span format '" + format + "'");
  }
}

function formatTimeSpan(timespan, format) {
  if (!format || format === '') {
    return timespan.toString();
  }

  var formats = [
    'y',
    'M',
    'd',
    'h',
    'm',
    's',
    'f'
  ];
  var result = '';
  var i;
  var totalCount;
  while (format.length > 0) {
    if (format[0] === "'") {
      var nextTick = format.indexOf("'", 1);
      result += format.substring(1, nextTick);
      format = format.substring(nextTick + 1);
      continue;
    }

    if (format.length > 1 && format[0] === '^') {
      totalCount = true;
      format = format.substring(1);
    } else {
      totalCount = false;
    }

    for (i = 0; i < formats.length; i++) {
      if (format.indexOf(formats[i]) === 0) {
        var width = 0;
        while (format.indexOf(formats[i]) === 0) {
          width++;
          format = format.substring(formats[i].length);
        }
        result += formatTimeSpanPart(timespan, (totalCount ? '^' : '') + formats[i], width);
        break;
      }
    }
    if (i < formats.length) {
      continue;
    }

    result += format[0];
    format = format.substring(1);
  }
  return result;
}

function formatDatePart(date, format) {
  switch (format) {
  case 'sd': // Short date - 10/12/2002
    return sf("{0:M}/{0:d}/{0:yyyy}", date);
  case 'D': // Long date - December 10, 2002
    return sf("{0:MMMM} {0:dd}, {0:yyyy}", date);
  case 't': // Short time - 10:11 PM
    return sf("{0:hh}:{0:mm} {0:tt}", date);
  case 'T': // Long time - 10:11:29 PM
    return sf("{0:hh}:{0:mm}:{0:ss} {0:tt}", date);
  case 'fdt': // Full date & time - December 10, 2002 10:11 PM
    return sf("{0:D} {0:t}", date);
  case 'F': // Full date & time (long) - December 10, 2002 10:11:29 PM
    return sf("{0:D} {0:T}", date);
  case 'g': // Default date & time - 10/12/2002 10:11 PM
    return sf("{0:sd} {0:t}", date);
  case 'G': // Default date & time (long) - 10/12/2002 10:11:29 PM
    return sf("{0:sd} {0:T}", date);
  case 'md': // Month day pattern - December 10
    return sf("{0:MMMM} {0:dd}", date);
  case 'r': // RFC1123 date string - Tue, 10 Dec 2002 22:11:29 +0500
    return sf("{0:ddd}, {0:dd} {0:MMM} {0:yyyy} {0:HH}:{0:mm}:{0:ss} {0:+zzzz}", date);
  case 's': // Sortable date string - 2002-12-10T22:11:29
    return sf("{0:yyyy}-{0:MM}-{0:dd}:{0:HH}:{0:mm}:{0:ss}", date);
  case 'd':
    return sf("{0:#0}", date.getDate());
  case 'dd':
    return sf("{0:00}", date.getDate());
  case 'ddd':
    return shortDays[date.getDay()];
  case 'dddd':
    return days[date.getDay()];
  case 'f':
    return sf("{0:0}", date.getMilliseconds() / 100.0);
  case 'ff':
    return sf("{0:00}", date.getMilliseconds() / 10.0);
  case 'fff':
    return sf("{0:000}", date.getMilliseconds() / 1.0);
  case 'h':
    var hours_h = date.getHours() % 12;
    return sf("{0:#0}", hours_h == 0 ? 12 : hours_h);
  case 'hh':
    var hours_hh = date.getHours() % 12;
    return sf("{0:00}", hours_hh == 0 ? 12 : hours_hh);
  case 'H':
    return sf("{0:#0}", date.getHours());
  case 'HH':
    return sf("{0:00}", date.getHours());
  case 'mm':
    return sf("{0:00}", date.getMinutes());
  case 'M':
    return sf("{0:#0}", date.getMonth() + 1);
  case 'MM':
    return sf("{0:00}", date.getMonth() + 1);
  case 'MMM':
    return shortMonths[date.getMonth()];
  case 'MMMM':
    return months[date.getMonth()];
  case 'ss':
    return sf("{0:00}", date.getSeconds());
  case 'tt':
    return date.getHours() >= 12 ? 'PM' : 'AM';
  case 'yy':
    return getYear(date).toString().substr(2);
  case 'yyyy':
    return getYear(date);
  case 'zz':
    return sf("{0:00}", Math.floor(date.getTimezoneOffset() / 60));
  case '+zz':
    return sf("{0:+00}", Math.floor(date.getTimezoneOffset() / 60));
  case 'zzz':
    var wholeTimezoneOffset = Math.floor(date.getTimezoneOffset() / 60);
    return sf("{0:00}:{1:00}", wholeTimezoneOffset, date.getTimezoneOffset() - (wholeTimezoneOffset * 60));
  case 'zzzz':
    var wholeTimezoneOffset = Math.floor(date.getTimezoneOffset() / 60);
    return sf("{0:00}{1:00}", wholeTimezoneOffset, date.getTimezoneOffset() - (wholeTimezoneOffset * 60));
  case '+zzzz':
    var wholeTimezoneOffset = Math.floor(date.getTimezoneOffset() / 60);
    return sf("{0:+00}{1:00}", wholeTimezoneOffset, date.getTimezoneOffset() - (wholeTimezoneOffset * 60));
  default:
    throw new Error("unhandled date format '" + format + "'");
  }
}

function getYear(date) {
  return date.getYear() + 1900;
}

function formatDate(date, format) {
  if (!format || format === '') {
    return date;
  }

  var formats = [
    'sd',
    'fdt',
    'md',
    'dddd',
    'ddd',
    'dd',
    'd',
    'D',
    'fff',
    'ff',
    'f',
    'F',
    'g',
    'G',
    'hh',
    'h',
    'HH',
    'H',
    'mm',
    'MMMM',
    'MMM',
    'MM',
    'M',
    'r',
    'ss',
    's',
    'tt',
    't',
    'T',
    'yyyy',
    'yy',
    '+zzzz',
    '+zz',
    'zzzz',
    'zzz',
    'zz'
  ];
  var result = '';
  var i;
  while (format.length > 0) {
    if (format[0] === "'") {
      var nextTick = format.indexOf("'", 1);
      result += format.substring(1, nextTick);
      format = format.substring(nextTick + 1);
      continue;
    }
    for (i = 0; i < formats.length; i++) {
      if (format.indexOf(formats[i]) === 0) {
        result += formatDatePart(date, formats[i]);
        format = format.substring(formats[i].length);
        break;
      }
    }
    if (i < formats.length) {
      continue;
    }

    result += format[0];
    format = format.substring(1);
  }
  return result;
}

function formatObjectIndent(obj) {
  if (!obj) {
    return 'null';
  }
  if (typeof(obj) != 'object') {
    return obj.toString();
  }
  var results = '';
  var keys = Object.keys(obj).sort();
  for (var i = 0; i < keys.length; i++) {
    results += keys[i] + ":";
    var val = obj[keys[i]];
    if (!val) {
      results += '\n';
    }
    else if (val instanceof Buffer) {
      var bufferContent = '';
      for (var bufferIdx = 0; bufferIdx < val.length; bufferIdx++) {
        if (bufferIdx !== 0) {
          bufferContent += ', ';
        }
        if (bufferIdx >= 10) {
          bufferContent += '...';
          break;
        }
        bufferContent += val[bufferIdx];
      }
      results += ' Buffer[' + bufferContent + '] (length: ' + val.length + ')\n';
    }
    else if (val instanceof Date || isTimezoneJsDate(val)) {
      results += " " + formatDate(val, 'r') + "\n";
    }
    else if (typeof(val) === 'string' || typeof(val) === 'number' || typeof(val) === 'boolean') {
      results += " " + val + "\n";
    } else {
      var str = formatObjectIndent(val);
      results += "\n" + sf.indent(str, {}) + "\n";
    }
  }
  results = results.replace(/\s+$/, '');
  return results;
}

function formatObject(obj, format) {
  if (!format || format === '') {
    return obj;
  }

  if (format == 'inspect') {
    return require('util').inspect(obj);
  }

  if (format == 'json') {
    return JSON.stringify(obj);
  }

  if (format == 'indent') {
    return formatObjectIndent(obj);
  }

  throw new Error("unhandled format: " + format);
}

function formatError(err, format) {
  if (!format || format === '') {
    return err.stack;
  }

  if (format == 'message') {
    return err.message;
  }

  return formatObject(err, format);
}

function align(str, val) {
  str = str || '';
  if (val < 0) {
    return padRight(str, ' ', Math.abs(val));
  } else if (val > 0) {
    return padLeft(str, ' ', val);
  }
  return str;
}

function splitFieldName(fieldName) {
  var results = [];
  var part = '';
  for (var i = 0; i < fieldName.length;) {
    if (fieldName[i] == '.') {
      results.push(part);
      part = '';
      i++;
      continue;
    }

    if (fieldName[i] == '[') {
      results.push(part);
      part = '[';
      i++;
      continue;
    }

    part += fieldName[i++];
  }
  results.push(part);
  return results;
}

function getValue(args, fieldName) {
  var fieldIndex = parseInt(fieldName);
  if (fieldIndex.toString() === fieldName) {
    return args[fieldIndex + 1];
  } else {
    var parts = splitFieldName(fieldName);
    var root = args[1];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];

      if (part.length >= 1 && part[0] == '?') {
        if (typeof(root) == 'undefined') {
          return undefined;
        } else {
          part = part.substr(1);
        }
      }

      if (part.length >= 1 && part[0] == '[') {
        part = part.substr(1, part.length - 2);
        var strMatch = part.match(/^['"](.*)['"]$/);
        if (strMatch) {
          root = root[strMatch[1]];
        }
        else if (part < 0) {
          part = -part;
          root = root[root.length - part];
        } else {
          root = root[part];
        }
        continue;
      }

      root = root[part];
    }
    return root;
  }
}

function sf(formatString) {
  var result = '';
  for (var i = 0; i < formatString.length;) {
    if (formatString[i] == '}') {
      i++;
      if (formatString[i] == '}') {
        result += '}';
        i++;
        continue;
      }
      throw new Error("Unescaped substitution");
    }
    if (formatString[i] == '{') {
      var spec = '';
      i++;
      if (formatString[i] == '{') {
        result += '{';
        i++;
        continue;
      }
      for (; i < formatString.length;) {
        if (formatString[i] == '}') {
          break;
        }
        spec += formatString[i++];
      }
      if (i == formatString.length) {
        throw new Error("Unterminated substitution");
      }
      i++;
      var alignTokenLoc = spec.indexOf(',');
      var specTokenLoc;
      var alignVal = 0;
      if (alignTokenLoc > 0) {
        specTokenLoc = spec.indexOf(':');
        if (specTokenLoc > 0) {
          if (alignTokenLoc < specTokenLoc) {
            alignVal = spec.substr(alignTokenLoc + 1, specTokenLoc - alignTokenLoc - 1);
            spec = spec.substr(0, alignTokenLoc) + spec.substr(specTokenLoc);
          }
        } else {
          alignVal = spec.substr(alignTokenLoc + 1);
          spec = spec.substr(0, alignTokenLoc);
        }
      }

      specTokenLoc = spec.indexOf(':');
      var fieldName, formatSpec;
      if (specTokenLoc > 0) {
        fieldName = spec.substr(0, specTokenLoc);
        formatSpec = spec.substr(specTokenLoc + 1);
      } else {
        fieldName = spec;
        formatSpec = null;
      }
      var val = getValue(arguments, fieldName);

      if (val instanceof sf.TimeSpan) {
        result += align(formatTimeSpan(val, formatSpec), alignVal);
      } else if (typeof(val) === 'number') {
        result += align(formatNumber(val, formatSpec), alignVal);
      } else if (val instanceof Date || isTimezoneJsDate(val)) {
        result += align(formatDate(val, formatSpec), alignVal);
      } else if (val instanceof Error) {
        result += align(formatError(val, formatSpec), alignVal);
      } else {
        result += align(formatObject(val, formatSpec), alignVal);
      }
    } else {
      result += formatString[i++];
    }
  }
  return result;
}

function isTimezoneJsDate(date) {
  return date && date.hasOwnProperty('timezone');
}

function getStringLength(str, options) {
  options.tabWidth = options.tabWidth || 4;

  var tabStr = padLeft('', ' ', options.tabWidth);
  str = str.replace(/\t/g, tabStr);
  return str.length;
}

function isSpace(char) {
  if (char.match(/\s/)) {
    return true;
  }
  return false;
}

function isSplitable(char) {
  if (isSpace(char)) {
    return true;
  }
  if (char == '(' || char == ')' || char == '.' || char == ',' || char == '?' || char == '!') {
    return false;
  }
  if (char >= 'a' && char <= 'z') {
    return false;
  }
  if (char >= 'A' && char <= 'Z') {
    return false;
  }
  if (char >= '0' && char <= '9') {
    return false;
  }

  return true;
}

function findLastSplit(line, i) {
  if (i >= line.length) {
    i = line.length - 1;
  }
  while (i > 0 && !isSplitable(line[i])) {
    i--;
  }
  return i;
}

function findNextSplit(line, i) {
  while (i < line.length && !isSplitable(line[i])) {
    i++;
  }
  return i;
}

function wordWrapLine(line, options) {
  if (line.length === 0) {
    return '';
  }

  options._prefixLength = options._prefixLength || getStringLength(options.prefix, options);

  if (line.length + options._prefixLength < options.wordwrap) {
    return options.prefix + line;
  }

  var i = options._prefixLength + options.wordwrap;
  var lastSplit = findLastSplit(line, i);
  var nextSplit = findNextSplit(line, i);
  var rest;

  if (lastSplit === 0 && (nextSplit + options._prefixLength > options.wordwrap)) {
    rest = wordWrapLine(line.substr(options.wordwrap - options._prefixLength), options);
    if (rest.length > 0) {
      rest = '\n' + rest;
    }
    return options.prefix + line.substr(0, options.wordwrap - options._prefixLength) + rest;
  }

  rest = wordWrapLine(line.substr(lastSplit + 1), options);
  if (rest.length > 0) {
    rest = '\n' + rest;
  }
  if (!isSpace(line[lastSplit])) {
    lastSplit++;
  }
  return options.prefix + line.substr(0, lastSplit) + rest;
}

sf.indent = function(str, options) {
  options = options || {};
  options.prefix = 'prefix' in options ? options.prefix : '  ';
  options.tabWidth = options.tabWidth || 4;

  options._prefixLength = getStringLength(options.prefix, options);

  if (options.wordwrap) {
    var results = '';
    var lines = str.split('\n');

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line === '') {
        results += options.prefix + line + '\n';
      } else {
        line = wordWrapLine(line, options) + '\n';
      }
      results += line;
    }
    if (results.length > 0) {
      results = results.substr(0, results.length - 1);
    }
    return results;
  }

  str = str.replace(/\n/g, '\n' + options.prefix);
  str = options.prefix + str;
  return str;
};

sf.log = function() {
  console.log(sf.apply(this, arguments));
};

sf.info = function() {
  console.info(sf.apply(this, arguments));
};

sf.warn = function() {
  console.warn(sf.apply(this, arguments));
};

sf.error = function() {
  console.error(sf.apply(this, arguments));
};

sf.TimeSpan = function(milliseconds, seconds, minutes, hours, days) {
  var MILLISECONDS = 1;
  var SECOND = MILLISECONDS * 1000;
  var MINUTE = SECOND * 60;
  var HOUR = MINUTE * 60;
  var DAY = HOUR * 24;
  var MONTH = DAY * 30;
  var YEAR = DAY * 365.25;

  seconds = seconds || 0;
  minutes = minutes || 0;
  hours = hours || 0;
  days = days || 0;
  var _ms = milliseconds
              + (SECOND * seconds)
              + (MINUTE * minutes)
              + (HOUR * hours)
    + (DAY * days);

  var remaining = _ms;

  var _years = Math.floor(remaining / YEAR);
  remaining %= YEAR;

  var _months = Math.floor(remaining / MONTH);
  remaining %= MONTH;

  var _days = Math.floor(remaining / DAY);
  remaining %= DAY;

  var _hours = Math.floor(remaining / HOUR);
  remaining %= HOUR;

  var _minutes = Math.floor(remaining / MINUTE);
  remaining %= MINUTE;

  var _seconds = Math.floor(remaining / SECOND);
  remaining %= SECOND;

  var _milliseconds = Math.floor(remaining / MILLISECONDS);
  remaining %= MILLISECONDS;

  this.__defineGetter__("years", function() {
    return _years;
  });
  this.__defineGetter__("months", function() {
    return _months;
  });
  this.__defineGetter__("days", function() {
    return _days;
  });
  this.__defineGetter__("hours", function() {
    return _hours;
  });
  this.__defineGetter__("minutes", function() {
    return _minutes;
  });
  this.__defineGetter__("seconds", function() {
    return _seconds;
  });
  this.__defineGetter__("milliseconds", function() {
    return _milliseconds;
  });

  this.__defineGetter__("totalYears", function() {
    return _ms / YEAR;
  });
  this.__defineGetter__("totalMonths", function() {
    return _ms / MONTH;
  });
  this.__defineGetter__("totalDays", function() {
    return _ms / DAY;
  });
  this.__defineGetter__("totalHours", function() {
    return _ms / HOUR;
  });
  this.__defineGetter__("totalMinutes", function() {
    return _ms / MINUTE;
  });
  this.__defineGetter__("totalSeconds", function() {
    return _ms / SECOND;
  });
  this.__defineGetter__("totalMilliseconds", function() {
    return _ms;
  });

  this.toString = function() {
    return _ms;
  };

  return this;
};

var module;
if(module) {
  module.exports = sf;
}

var window;
if (window) {
  define([], function() {
    return sf;
  });
}
