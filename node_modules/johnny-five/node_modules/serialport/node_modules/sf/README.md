# sf

[![Build Status](https://secure.travis-ci.org/nearinfinity/node-sf.png)](http://travis-ci.org/nearinfinity/node-sf)

String formatting library for node.js.

## Installation

```bash
$ npm install sf
```

## Quick Examples

```javascript
var sf = require("sf");

sf("{who} has a {what}", { who: 'dog', what: 'tail' });
// returns: dog has a tail

sf("{0} has a {1}", 'dog', 'tail');
// returns: dog has a tail

sf("{0:#,##0.00}", 2123.1);
// returns: 2,123.10

sf("{0,15:#,##0.00}", 2123.1);
// returns:        2,123.10

sf("{a.b}", { a: { b: 'test' }});
// returns: test

sf("{a.z.c}", { a: { b: 'test' }});
// throws an error

sf("{a.?z.?c}", { a: { b: 'test' }});
// returns:

sf("{a[0]}", { a: [ 'foo', 'bar' ]});
// returns: foo

sf("{a[-1]}", { a: [ 'foo', 'bar' ]});
// returns: bar

sf.log("{who} has a {what}", { who: 'dog', what: 'tail' });
// outputs to standard out: dog has a tail

sf("{0:^d 'Days,' h:mm:ss.fff}", new sf.TimeSpan(8173818181));
// returns: 94 Days, 14:30:18.181
```

## Format Specifiers

The format is similar to C#'s string.format. The text inside the curly braces is {indexOrName[,alignment][:formatString]}.
If alignment is positive the text is right aligned. If alignment is negative it will be left aligned.

### Object

| Specifier | Name                         |
|-----------|------------------------------|
| json      | JSON.stringify               |
| inspect   | util.inspect                 |

### Numbers

| Specifier | Name                         | Example          | Output         |
|-----------|------------------------------|------------------|----------------|
| 0         | Zero placeholder             | {0:00.0000}      | 02.1200        |
| #         | Digit placeholder            | {0:#,###}        | 1,234          |
| x         | Lowercase hex                | {0:x4}           | 01fc           |
| X         | Uppercase hex                | {0:X4}           | 01FC           |

### Dates

| Specifier | Name                            | Example                         |
|-----------|---------------------------------|---------------------------------|
| sd        | Short date                      | 10/12/2002                      |
| D         | Long date                       | December 10, 2002               |
| t         | Short time                      | 10:11 PM                        |
| T         | Long time                       | 10:11:29 PM                     |
| fdt       | Full date & time                | December 10, 2002 10:11 PM      |
| F         | Full date & time (long)         | December 10, 2002 10:11:29 PM   |
| g         | Default date & time             | 10/12/2002 10:11 PM             |
| G         | Default date & time (long)      | 10/12/2002 10:11:29 PM          |
| md        | Month day pattern               | December 10                     |
| r         | RFC1123 date string             | Tue, 10 Dec 2002 22:11:29 +0500 |
| s         | Sortable date string            | 2002-12-10T22:11:29             |
| d         | Date single digit               | 1                               |
| dd        | Date leading zero               | 01                              |
| ddd       | Short day name                  | Mon                             |
| dddd      | Long day name                   | Monday                          |
| f         | Fraction of second (1 digit)    | 1                               |
| ff        | Fraction of second (2 digit)    | 24                              |
| fff       | Fraction of second (3 digit)    | 345                             |
| h         | Hour 12-hour format 1 digit     | 5                               |
| hh        | Hour 12-hour format 2 digits    | 05                              |
| H         | Hour 24-hour format 1 digit     | 5                               |
| HH        | Hour 24-hour format 2 digits    | 05                              |
| mm        | Minutes 2 digits                | 23                              |
| M         | Month single digit              | 2                               |
| MM        | Month leading zero              | 02                              |
| MMM       | Month short name                | Feb                             |
| MMMM      | Month long name                 | February                        |
| ss        | Seconds 2 digits                | 54                              |
| tt        | AM/PM                           | AM                              |
| yy        | Year 2 digits                   | 12                              |
| yyyy      | Year 4 digits                   | 2012                            |
| zz        | Time zone offset                | 05                              |
| +zz       | Time zone offset leading +      | +05                             |
| zzz       | Time zone offset full           | 05:00                           |
| zzzz      | Time zone offset full           | 0500                            |
| +zzzz     | Time zone offset full leading + | +0500                           |

### sf.TimeSpan

| Specifier | Name                | Example                |
|-----------|---------------------|------------------------|
| y         | Years               | 2                      |
| M         | Months              | 6                      |
| d         | Days                | 8                      |
| h         | Hours               | 10                     |
| m         | Minutes             | 15                     |
| s         | Seconds             | 5                      |
| f         | Fraction of Seconds | 9                      |

If you prefix the specifier with '^' you will get the total number of that value. For
example '^s' will output the total number of seconds in the time span. Where as 's' will
only output the number of seconds in a minute.

If you repeat characters the value will be prefixed with zeros.

## sf.indent(str, options)

Helper function to word wrap and indent a string.

__Arguments__

 * str - The string to indent and wrap.
 * options
  * prefix - The prefix to appear at the beginning of each new line.
  * wordwrap - The maximum length of each line.

## Helper Functions

 * sf.log(formatString [, args...]);
 * sf.info(formatString [, args...]);
 * sf.warn(formatString [, args...]);
 * sf.error(formatString [, args...]);
