"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
The MIT License (MIT)

Copyright (c) 2015 Bryan Hughes <bryan@theoreticalideations.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var fs = _interopRequire(require("fs"));

var Peripheral = require("raspi-peripheral").Peripheral;

var OFF = 0;
exports.OFF = OFF;
var ON = 1;

exports.ON = ON;

var LED = exports.LED = (function (_Peripheral) {
  function LED() {
    _classCallCheck(this, LED);

    _get(Object.getPrototypeOf(LED.prototype), "constructor", this).call(this);
    fs.writeFileSync("/sys/class/leds/led0/trigger", "none");
  }

  _inherits(LED, _Peripheral);

  _createClass(LED, {
    read: {
      value: function read() {
        return parseInt(fs.readFileSync("/sys/class/leds/led0/brightness").toString(), 10) ? ON : OFF;
      }
    },
    write: {
      value: function write(value) {
        this.validateAlive();
        if ([ON, OFF].indexOf(value) == -1) {
          throw new Error("Invalid LED value " + value);
        }
        fs.writeFileSync("/sys/class/leds/led0/brightness", value ? "255" : "0");
      }
    }
  });

  return LED;
})(Peripheral);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCTyxFQUFFLDJCQUFNLElBQUk7O0lBQ1YsVUFBVSxXQUFRLGtCQUFrQixFQUFwQyxVQUFVOztBQUVaLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUFSLEdBQUcsR0FBSCxHQUFHO0FBQ1QsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztRQUFQLEVBQUUsR0FBRixFQUFFOztJQUVGLEdBQUcsV0FBSCxHQUFHO0FBRUgsV0FGQSxHQUFHLEdBRUE7MEJBRkgsR0FBRzs7QUFHWiwrQkFIUyxHQUFHLDZDQUdKO0FBQ1IsTUFBRSxDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsRUFBRSxNQUFNLENBQUMsQ0FBQztHQUMxRDs7WUFMVSxHQUFHOztlQUFILEdBQUc7QUFPZCxRQUFJO2FBQUEsZ0JBQUc7QUFDTCxlQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQztPQUMvRjs7QUFFRCxTQUFLO2FBQUEsZUFBQyxLQUFLLEVBQUU7QUFDWCxZQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsWUFBSSxDQUFFLEVBQUUsRUFBRSxHQUFHLENBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDcEMsZ0JBQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDL0M7QUFDRCxVQUFFLENBQUMsYUFBYSxDQUFDLGlDQUFpQyxFQUFFLEtBQUssR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUM7T0FDMUU7Ozs7U0FqQlUsR0FBRztHQUFTLFVBQVUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbkNvcHlyaWdodCAoYykgMjAxNSBCcnlhbiBIdWdoZXMgPGJyeWFuQHRoZW9yZXRpY2FsaWRlYXRpb25zLmNvbT5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IFBlcmlwaGVyYWwgfSBmcm9tICdyYXNwaS1wZXJpcGhlcmFsJztcblxuZXhwb3J0IGNvbnN0IE9GRiA9IDA7XG5leHBvcnQgY29uc3QgT04gPSAxO1xuXG5leHBvcnQgY2xhc3MgTEVEIGV4dGVuZHMgUGVyaXBoZXJhbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBmcy53cml0ZUZpbGVTeW5jKCcvc3lzL2NsYXNzL2xlZHMvbGVkMC90cmlnZ2VyJywgJ25vbmUnKTtcbiAgfVxuXG4gIHJlYWQoKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGZzLnJlYWRGaWxlU3luYygnL3N5cy9jbGFzcy9sZWRzL2xlZDAvYnJpZ2h0bmVzcycpLnRvU3RyaW5nKCksIDEwKSA/IE9OIDogT0ZGO1xuICB9XG5cbiAgd3JpdGUodmFsdWUpIHtcbiAgICB0aGlzLnZhbGlkYXRlQWxpdmUoKTtcbiAgICBpZiAoWyBPTiwgT0ZGIF0uaW5kZXhPZih2YWx1ZSkgPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBMRUQgdmFsdWUgJyArIHZhbHVlKTtcbiAgICB9XG4gICAgZnMud3JpdGVGaWxlU3luYygnL3N5cy9jbGFzcy9sZWRzL2xlZDAvYnJpZ2h0bmVzcycsIHZhbHVlID8gJzI1NScgOiAnMCcpO1xuICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==