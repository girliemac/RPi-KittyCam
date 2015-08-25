"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
The MIT License (MIT)

Copyright (c) 2014 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

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

var events = _interopRequire(require("events"));

var getPinNumber = require("raspi-board").getPinNumber;

var registeredPins = global.raspiPinUsage = global.raspiPinUsage || {};

var Peripheral = exports.Peripheral = (function (_events$EventEmitter) {
  function Peripheral(pins) {
    var _this = this;

    _classCallCheck(this, Peripheral);

    _get(Object.getPrototypeOf(Peripheral.prototype), "constructor", this).call(this);
    this.alive = true;
    if (!Array.isArray(pins)) {
      pins = [pins];
    }
    this.pins = [];
    pins.map(function (pin) {
      pin = getPinNumber(pin);
      _this.pins.push(pin);
      if (registeredPins[pin]) {
        registeredPins[pin].destroy();
      }
      registeredPins[pin] = _this;
    });
  }

  _inherits(Peripheral, _events$EventEmitter);

  _prototypeProperties(Peripheral, null, {
    destroy: {
      value: function destroy() {
        if (this.alive) {
          this.alive = false;
          for (var i = 0; i < this.pins.length; i++) {
            delete registeredPins[this.pins[i]];
          }
          this.emit("destroyed");
        }
      },
      writable: true,
      configurable: true
    },
    validateAlive: {
      value: function validateAlive() {
        if (!this.alive) {
          throw new Error("Attempted to access a destroyed peripheral");
        }
      },
      writable: true,
      configurable: true
    }
  });

  return Peripheral;
})(events.EventEmitter);

Object.defineProperty(exports, "__esModule", {
  value: true
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCTyxNQUFNLDJCQUFNLFFBQVE7O0lBQ2xCLFlBQVksV0FBUSxhQUFhLEVBQWpDLFlBQVk7O0FBRXJCLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUM7O0lBRTVELFVBQVUsV0FBVixVQUFVO0FBQ1YsV0FEQSxVQUFVLENBQ1QsSUFBSTs7OzBCQURMLFVBQVU7O0FBRW5CLCtCQUZTLFVBQVUsNkNBRVg7QUFDUixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN4QixVQUFJLEdBQUcsQ0FBRSxJQUFJLENBQUUsQ0FBQztLQUNqQjtBQUNELFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNoQixTQUFHLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLFlBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQixVQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN2QixzQkFBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQy9CO0FBQ0Qsb0JBQWMsQ0FBQyxHQUFHLENBQUMsUUFBTyxDQUFDO0tBQzVCLENBQUMsQ0FBQztHQUNKOztZQWhCVSxVQUFVOzt1QkFBVixVQUFVO0FBaUJyQixXQUFPO2FBQUEsbUJBQUc7QUFDUixZQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxjQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixlQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekMsbUJBQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUNyQztBQUNELGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDeEI7T0FDRjs7OztBQUNELGlCQUFhO2FBQUEseUJBQUc7QUFDZCxZQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNmLGdCQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7U0FDL0Q7T0FDRjs7Ozs7O1NBOUJVLFVBQVU7R0FBUyxNQUFNLENBQUMsWUFBWSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5UaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuQ29weXJpZ2h0IChjKSAyMDE0IEJyeWFuIEh1Z2hlcyA8YnJ5YW5AdGhlb3JldGljYWxpZGVhdGlvbnMuY29tPiAoaHR0cDovL3RoZW9yZXRpY2FsaWRlYXRpb25zLmNvbSlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xuaW1wb3J0IHsgZ2V0UGluTnVtYmVyIH0gZnJvbSAncmFzcGktYm9hcmQnO1xuXG5jb25zdCByZWdpc3RlcmVkUGlucyA9IGdsb2JhbC5yYXNwaVBpblVzYWdlID0gZ2xvYmFsLnJhc3BpUGluVXNhZ2UgfHwge307XG5cbmV4cG9ydCBjbGFzcyBQZXJpcGhlcmFsIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKHBpbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwaW5zKSkge1xuICAgICAgcGlucyA9IFsgcGlucyBdO1xuICAgIH1cbiAgICB0aGlzLnBpbnMgPSBbXTtcbiAgICBwaW5zLm1hcCgocGluKSA9PiB7XG4gICAgICBwaW4gPSBnZXRQaW5OdW1iZXIocGluKTtcbiAgICAgIHRoaXMucGlucy5wdXNoKHBpbik7XG4gICAgICBpZiAocmVnaXN0ZXJlZFBpbnNbcGluXSkge1xuICAgICAgICByZWdpc3RlcmVkUGluc1twaW5dLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgIHJlZ2lzdGVyZWRQaW5zW3Bpbl0gPSB0aGlzO1xuICAgIH0pO1xuICB9XG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuYWxpdmUpIHtcbiAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5waW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRlbGV0ZSByZWdpc3RlcmVkUGluc1t0aGlzLnBpbnNbaV1dO1xuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KCdkZXN0cm95ZWQnKTtcbiAgICB9XG4gIH1cbiAgdmFsaWRhdGVBbGl2ZSgpIHtcbiAgICBpZiAoIXRoaXMuYWxpdmUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXR0ZW1wdGVkIHRvIGFjY2VzcyBhIGRlc3Ryb3llZCBwZXJpcGhlcmFsJyk7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=