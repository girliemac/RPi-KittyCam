"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
The MIT License (MIT)

Copyright (c)2014 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

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

var Peripheral = require("raspi-peripheral").Peripheral;

var addon = _interopRequire(require("../build/Release/addon"));

var INPUT = 0;
var OUTPUT = 1;

var LOW = exports.LOW = 0;
var HIGH = exports.HIGH = 1;

var PULL_NONE = exports.PULL_NONE = 0;
var PULL_UP = exports.PULL_UP = 1;
var PULL_DOWN = exports.PULL_DOWN = 2;

function parseConfig(config) {
  var pin = undefined;
  var pullResistor = undefined;
  if (typeof config == "number" || typeof config == "string") {
    pin = config;
    pullResistor = PULL_NONE;
  } else if (typeof config == "object") {
    pin = config.pin;
    pullResistor = config.pullResistor || PULL_NONE;
    if ([PULL_NONE, PULL_DOWN, PULL_UP].indexOf(pullResistor) == -1) {
      throw new Error("Invalid pull resistor option " + pullResistor);
    }
  } else {
    throw new Error("Invalid pin or configuration");
  }
  return {
    pin: pin,
    pullResistor: pullResistor
  };
}

var DigitalOutput = exports.DigitalOutput = (function (Peripheral) {
  function DigitalOutput(config) {
    _classCallCheck(this, DigitalOutput);

    config = parseConfig(config);
    _get(Object.getPrototypeOf(DigitalOutput.prototype), "constructor", this).call(this, config.pin);
    addon.init(this.pins[0], config.pullResistor, OUTPUT);
  }

  _inherits(DigitalOutput, Peripheral);

  _prototypeProperties(DigitalOutput, null, {
    write: {
      value: function write(value) {
        if (!this.alive) {
          throw new Error("Attempted to write to a destroyed peripheral");
        }
        if ([LOW, HIGH].indexOf(value) == -1) {
          throw new Error("Invalid write value " + value);
        }
        addon.write(this.pins[0], value);
      },
      writable: true,
      configurable: true
    }
  });

  return DigitalOutput;
})(Peripheral);

var DigitalInput = exports.DigitalInput = (function (Peripheral) {
  function DigitalInput(config) {
    _classCallCheck(this, DigitalInput);

    config = parseConfig(config);
    _get(Object.getPrototypeOf(DigitalInput.prototype), "constructor", this).call(this, config.pin);
    addon.init(this.pins[0], config.pullResistor, INPUT);
    this.value = addon.read(this.pins[0]);
  }

  _inherits(DigitalInput, Peripheral);

  _prototypeProperties(DigitalInput, null, {
    read: {
      value: function read() {
        if (!this.alive) {
          throw new Error("Attempted to read from a destroyed peripheral");
        }
        this.value = addon.read(this.pins[0]);
        return this.value;
      },
      writable: true,
      configurable: true
    }
  });

  return DigitalInput;
})(Peripheral);

Object.defineProperty(exports, "__esModule", {
  value: true
});
//# sourceMappingURL=data:application/json;base64,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TUFBTSxDQUFDLEdBQUcsRUFBRTtBQUNsQixTQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyRCxRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3ZDOztZQU5VLFlBQVksRUFBUyxVQUFVOzt1QkFBL0IsWUFBWTtBQVF2QixRQUFJO2FBQUEsZ0JBQUc7QUFDTCxZQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNmLGdCQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDbEU7QUFDRCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjs7Ozs7O1NBZFUsWUFBWTtHQUFTLFVBQVUiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbkNvcHlyaWdodCAoYykyMDE0IEJyeWFuIEh1Z2hlcyA8YnJ5YW5AdGhlb3JldGljYWxpZGVhdGlvbnMuY29tPiAoaHR0cDovL3RoZW9yZXRpY2FsaWRlYXRpb25zLmNvbSlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuaW1wb3J0IHsgUGVyaXBoZXJhbCB9IGZyb20gJ3Jhc3BpLXBlcmlwaGVyYWwnO1xuaW1wb3J0IGFkZG9uIGZyb20gJy4uL2J1aWxkL1JlbGVhc2UvYWRkb24nO1xuXG5jb25zdCBJTlBVVCA9IDA7XG5jb25zdCBPVVRQVVQgPSAxO1xuXG5leHBvcnQgY29uc3QgTE9XID0gMDtcbmV4cG9ydCBjb25zdCBISUdIID0gMTtcblxuZXhwb3J0IGNvbnN0IFBVTExfTk9ORSA9IDA7XG5leHBvcnQgY29uc3QgUFVMTF9VUCA9IDE7XG5leHBvcnQgY29uc3QgUFVMTF9ET1dOID0gMjtcblxuZnVuY3Rpb24gcGFyc2VDb25maWcoY29uZmlnKSB7XG4gIGxldCBwaW47XG4gIGxldCBwdWxsUmVzaXN0b3I7XG4gIGlmICh0eXBlb2YgY29uZmlnID09ICdudW1iZXInIHx8IHR5cGVvZiBjb25maWcgPT0gJ3N0cmluZycpIHtcbiAgICBwaW4gPSBjb25maWc7XG4gICAgcHVsbFJlc2lzdG9yID0gUFVMTF9OT05FO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBjb25maWcgPT0gJ29iamVjdCcpIHtcbiAgICBwaW4gPSBjb25maWcucGluO1xuICAgIHB1bGxSZXNpc3RvciA9IGNvbmZpZy5wdWxsUmVzaXN0b3IgfHwgUFVMTF9OT05FO1xuICAgIGlmIChbIFBVTExfTk9ORSwgUFVMTF9ET1dOLCBQVUxMX1VQXS5pbmRleE9mKHB1bGxSZXNpc3RvcikgPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwdWxsIHJlc2lzdG9yIG9wdGlvbiAnICsgcHVsbFJlc2lzdG9yKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBpbiBvciBjb25maWd1cmF0aW9uJyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBwaW4sXG4gICAgcHVsbFJlc2lzdG9yXG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBEaWdpdGFsT3V0cHV0IGV4dGVuZHMgUGVyaXBoZXJhbCB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIGNvbmZpZyA9IHBhcnNlQ29uZmlnKGNvbmZpZyk7XG4gICAgc3VwZXIoY29uZmlnLnBpbik7XG4gICAgYWRkb24uaW5pdCh0aGlzLnBpbnNbMF0sIGNvbmZpZy5wdWxsUmVzaXN0b3IsIE9VVFBVVCk7XG4gIH1cblxuICB3cml0ZSh2YWx1ZSkge1xuICAgIGlmICghdGhpcy5hbGl2ZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRlbXB0ZWQgdG8gd3JpdGUgdG8gYSBkZXN0cm95ZWQgcGVyaXBoZXJhbCcpO1xuICAgIH1cbiAgICBpZiAoW0xPVywgSElHSF0uaW5kZXhPZih2YWx1ZSkgPT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB3cml0ZSB2YWx1ZSAnICsgdmFsdWUpO1xuICAgIH1cbiAgICBhZGRvbi53cml0ZSh0aGlzLnBpbnNbMF0sIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlnaXRhbElucHV0IGV4dGVuZHMgUGVyaXBoZXJhbCB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZykge1xuICAgIGNvbmZpZyA9IHBhcnNlQ29uZmlnKGNvbmZpZyk7XG4gICAgc3VwZXIoY29uZmlnLnBpbik7XG4gICAgYWRkb24uaW5pdCh0aGlzLnBpbnNbMF0sIGNvbmZpZy5wdWxsUmVzaXN0b3IsIElOUFVUKTtcbiAgICB0aGlzLnZhbHVlID0gYWRkb24ucmVhZCh0aGlzLnBpbnNbMF0pO1xuICB9XG5cbiAgcmVhZCgpIHtcbiAgICBpZiAoIXRoaXMuYWxpdmUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXR0ZW1wdGVkIHRvIHJlYWQgZnJvbSBhIGRlc3Ryb3llZCBwZXJpcGhlcmFsJyk7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSBhZGRvbi5yZWFkKHRoaXMucGluc1swXSk7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==