"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

var i2c = _interopRequire(require("i2c-bus"));

var execSync = require("child_process").execSync;

var Peripheral = require("raspi-peripheral").Peripheral;

var _raspiBoard = require("raspi-board");

var VERSION_1_MODEL_B_REV_1 = _raspiBoard.VERSION_1_MODEL_B_REV_1;
var getBoardRevision = _raspiBoard.getBoardRevision;

if (typeof execSync !== "function") {
  execSync = require("execSync").run;
}

function checkAddress(address) {
  if (typeof address !== "number" || address < 0 || address > 127) {
    throw new Error("Invalid I2C address " + address + ". Valid addresses are 0 through 0x7f.");
  }
}

function checkRegister(register) {
  if (register !== undefined && (typeof register !== "number" || register < 0 || register > 255)) {
    throw new Error("Invalid I2C register " + register + ". Valid registers are 0 through 0xff.");
  }
}

function checkLength(length) {
  if (typeof length !== "number" || length < 0 || length > 32) {
    throw new Error("Invalid I2C length " + length + ". Valid lengths are 0 through 32.");
  }
}

function checkCallback(cb) {
  if (typeof cb !== "function") {
    throw new Error("Invalid I2C callback " + cb);
  }
}

function checkBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length <= 0 || buffer.length > 32) {
    throw new Error("Invalid I2C buffer " + buffer + ". Valid lengths are 0 through 32.");
  }
}

function checkByte(byte) {
  if (typeof byte !== "number" || byte < 0 || byte > 255) {
    throw new Error("Invalid I2C byte " + byte + ". Valid values are 0 through 0xff.");
  }
}

function checkWord(word) {
  if (typeof word !== "number" || word < 0 || word > 65535) {
    throw new Error("Invalid I2C word " + word + ". Valid values are 0 through 0xffff.");
  }
}

var devices = Symbol("devices");
var getDevice = Symbol("getDevice");

var I2C = exports.I2C = (function (_Peripheral) {
  function I2C(options) {
    _classCallCheck(this, I2C);

    var pins = options;
    if (!Array.isArray(pins)) {
      options = options || {};
      pins = options.pins || ["SDA0", "SCL0"];
    }
    _get(Object.getPrototypeOf(I2C.prototype), "constructor", this).call(this, pins);

    Object.defineProperties(this, _defineProperty({}, devices, {
      writable: true,
      value: []
    }));

    execSync("modprobe i2c-dev");
  }

  _inherits(I2C, _Peripheral);

  _createClass(I2C, (function () {
    var _createClass2 = {
      destroy: {
        value: function destroy() {
          this[devices].forEach(function (device) {
            device.closeSync();
          });

          this[devices] = [];

          _get(Object.getPrototypeOf(I2C.prototype), "destroy", this).call(this);
        }
      }
    };

    _defineProperty(_createClass2, getDevice, {
      value: function (address) {
        var device = this[devices][address];

        if (device === undefined) {
          device = i2c.openSync(getBoardRevision() === VERSION_1_MODEL_B_REV_1 ? 0 : 1);
          this[devices][address] = device;
        }

        return device;
      }
    });

    _defineProperty(_createClass2, "read", {
      value: function read(address, register, length, cb) {
        this.validateAlive();

        if (arguments.length === 3) {
          cb = length;
          length = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkLength(length);
        checkCallback(cb);

        var buffer = new Buffer(length);
        function callback(err) {
          if (err) {
            return cb(err);
          }
          cb(null, buffer);
        }

        if (register === undefined) {
          this[getDevice](address).i2cRead(address, length, buffer, callback);
        } else {
          this[getDevice](address).readI2cBlock(address, register, length, buffer, callback);
        }
      }
    });

    _defineProperty(_createClass2, "readSync", {
      value: function readSync(address, register, length) {
        this.validateAlive();

        if (arguments.length === 2) {
          length = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkLength(length);

        var buffer = new Buffer(length);

        if (register === undefined) {
          this[getDevice](address).i2cReadSync(address, length, buffer);
        } else {
          this[getDevice](address).readI2cBlockSync(address, register, length, buffer);
        }

        return buffer;
      }
    });

    _defineProperty(_createClass2, "readByte", {
      value: function readByte(address, register, cb) {
        var _this = this;

        this.validateAlive();

        if (arguments.length === 2) {
          cb = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkCallback(cb);

        if (register === undefined) {
          (function () {
            var buffer = new Buffer(1);
            _this[getDevice](address).i2cRead(address, buffer.length, buffer, function (err) {
              if (err) {
                return cb(err);
              }
              cb(null, buffer[0]);
            });
          })();
        } else {
          this[getDevice](address).readByte(address, register, cb);
        }
      }
    });

    _defineProperty(_createClass2, "readByteSync", {
      value: function readByteSync(address, register) {
        this.validateAlive();

        checkAddress(address);
        checkRegister(register);

        var byte = undefined;
        if (register === undefined) {
          var buffer = new Buffer(1);
          this[getDevice](address).i2cReadSync(address, buffer.length, buffer);
          byte = buffer[0];
        } else {
          byte = this[getDevice](address).readByteSync(address, register);
        }
        return byte;
      }
    });

    _defineProperty(_createClass2, "readWord", {
      value: function readWord(address, register, cb) {
        var _this = this;

        this.validateAlive();

        if (arguments.length === 2) {
          cb = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkCallback(cb);

        if (register === undefined) {
          (function () {
            var buffer = new Buffer(2);
            _this[getDevice](address).i2cRead(address, buffer.length, buffer, function (err) {
              if (err) {
                return cb(err);
              }
              cb(null, buffer.readUInt16LE(0));
            });
          })();
        } else {
          this[getDevice](address).readWord(address, register, cb);
        }
      }
    });

    _defineProperty(_createClass2, "readWordSync", {
      value: function readWordSync(address, register) {
        this.validateAlive();

        checkAddress(address);
        checkRegister(register);

        var byte = undefined;
        if (register === undefined) {
          var buffer = new Buffer(2);
          this[getDevice](address).i2cReadSync(address, buffer.length, buffer);
          byte = buffer.readUInt16LE(0);
        } else {
          byte = this[getDevice](address).readWordSync(address, register);
        }
        return byte;
      }
    });

    _defineProperty(_createClass2, "write", {
      value: function write(address, register, buffer, cb) {
        this.validateAlive();

        if (arguments.length === 3) {
          cb = buffer;
          buffer = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkBuffer(buffer);
        checkCallback(cb);

        if (register === undefined) {
          this[getDevice](address).i2cWrite(address, buffer.length, buffer, cb);
        } else {
          this[getDevice](address).writeI2cBlock(address, register, buffer.length, buffer, cb);
        }
      }
    });

    _defineProperty(_createClass2, "writeSync", {
      value: function writeSync(address, register, buffer) {
        this.validateAlive();

        if (arguments.length === 2) {
          buffer = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkBuffer(buffer);

        if (register === undefined) {
          this[getDevice](address).i2cWriteSync(address, buffer.length, buffer);
        } else {
          this[getDevice](address).writeI2cBlockSync(address, register, buffer.length, buffer);
        }
      }
    });

    _defineProperty(_createClass2, "writeByte", {
      value: function writeByte(address, register, byte, cb) {
        this.validateAlive();

        if (arguments.length === 3) {
          cb = byte;
          byte = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkByte(byte);
        checkCallback(cb);

        if (register === undefined) {
          this[getDevice](address).i2cWrite(address, 1, new Buffer([byte]), cb);
        } else {
          this[getDevice](address).writeByte(address, register, byte, cb);
        }
      }
    });

    _defineProperty(_createClass2, "writeByteSync", {
      value: function writeByteSync(address, register, byte) {
        this.validateAlive();

        if (arguments.length === 2) {
          byte = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkByte(byte);

        if (register === undefined) {
          this[getDevice](address).i2cWriteSync(address, 1, new Buffer([byte]));
        } else {
          this[getDevice](address).writeByteSync(address, register, byte);
        }
      }
    });

    _defineProperty(_createClass2, "writeWord", {
      value: function writeWord(address, register, word, cb) {
        this.validateAlive();

        if (arguments.length === 3) {
          cb = word;
          word = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkWord(word);
        checkCallback(cb);

        if (register === undefined) {
          var buffer = new Buffer(2);
          buffer.writeUInt16LE(word, 0);
          this[getDevice](address).i2cWrite(address, buffer.length, buffer, cb);
        } else {
          this[getDevice](address).writeWord(address, register, word, cb);
        }
      }
    });

    _defineProperty(_createClass2, "writeWordSync", {
      value: function writeWordSync(address, register, word) {
        this.validateAlive();

        if (arguments.length === 2) {
          word = register;
          register = undefined;
        }

        checkAddress(address);
        checkRegister(register);
        checkWord(word);

        if (register === undefined) {
          var buffer = new Buffer(2);
          buffer.writeUInt16LE(word, 0);
          this[getDevice](address).i2cWriteSync(address, buffer.length, buffer);
        } else {
          this[getDevice](address).writeWordSync(address, register, word);
        }
      }
    });

    return _createClass2;
  })());

  return I2C;
})(Peripheral);

Object.defineProperty(exports, "__esModule", {
  value: true
});
//# sourceMappingURL=data:application/json;base64,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RyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixnQkFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN2RSxNQUFNO0FBQ0wsY0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pFO09BQ0Y7Ozs7OztTQTFTVSxHQUFHO0dBQVMsVUFBVSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5UaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuQ29weXJpZ2h0IChjKSAyMDE1IEJyeWFuIEh1Z2hlcyA8YnJ5YW5AdGhlb3JldGljYWxpZGVhdGlvbnMuY29tPlxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuXG4qL1xuXG5pbXBvcnQgaTJjIGZyb20gJ2kyYy1idXMnO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7IFBlcmlwaGVyYWwgfSBmcm9tICdyYXNwaS1wZXJpcGhlcmFsJztcbmltcG9ydCB7IFZFUlNJT05fMV9NT0RFTF9CX1JFVl8xLCBnZXRCb2FyZFJldmlzaW9uIH0gZnJvbSAncmFzcGktYm9hcmQnO1xuXG5pZiAodHlwZW9mIGV4ZWNTeW5jICE9PSAnZnVuY3Rpb24nKSB7XG4gIGV4ZWNTeW5jID0gcmVxdWlyZSgnZXhlY1N5bmMnKS5ydW47XG59XG5cbmZ1bmN0aW9uIGNoZWNrQWRkcmVzcyhhZGRyZXNzKSB7XG4gIGlmICh0eXBlb2YgYWRkcmVzcyAhPT0gJ251bWJlcicgfHwgYWRkcmVzcyA8IDAgfHwgYWRkcmVzcyA+IDB4N2YpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSTJDIGFkZHJlc3MgJyArIGFkZHJlc3NcbiAgICAgICsgJy4gVmFsaWQgYWRkcmVzc2VzIGFyZSAwIHRocm91Z2ggMHg3Zi4nXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKSB7XG4gIGlmIChyZWdpc3RlciAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAodHlwZW9mIHJlZ2lzdGVyICE9PSAnbnVtYmVyJyB8fCByZWdpc3RlciA8IDAgfHwgcmVnaXN0ZXIgPiAweGZmKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBJMkMgcmVnaXN0ZXIgJyArIHJlZ2lzdGVyXG4gICAgICArICcuIFZhbGlkIHJlZ2lzdGVycyBhcmUgMCB0aHJvdWdoIDB4ZmYuJ1xuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tMZW5ndGgobGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgbGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBsZW5ndGggPCAwIHx8IGxlbmd0aCA+IDMyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEkyQyBsZW5ndGggJyArIGxlbmd0aFxuICAgICAgKyAnLiBWYWxpZCBsZW5ndGhzIGFyZSAwIHRocm91Z2ggMzIuJ1xuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tDYWxsYmFjayhjYikge1xuICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEkyQyBjYWxsYmFjayAnICsgY2IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrQnVmZmVyKGJ1ZmZlcikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWZmZXIpIHx8IGJ1ZmZlci5sZW5ndGggPD0gMCB8fCBidWZmZXIubGVuZ3RoID4gMzIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSTJDIGJ1ZmZlciAnICsgYnVmZmVyXG4gICAgICArICcuIFZhbGlkIGxlbmd0aHMgYXJlIDAgdGhyb3VnaCAzMi4nXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0J5dGUoYnl0ZSkge1xuICBpZiAodHlwZW9mIGJ5dGUgIT09ICdudW1iZXInIHx8IGJ5dGUgPCAwIHx8IGJ5dGUgPiAweGZmKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEkyQyBieXRlICcgKyBieXRlXG4gICAgICArICcuIFZhbGlkIHZhbHVlcyBhcmUgMCB0aHJvdWdoIDB4ZmYuJ1xuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tXb3JkKHdvcmQpIHtcbiAgaWYgKHR5cGVvZiB3b3JkICE9PSAnbnVtYmVyJyB8fCB3b3JkIDwgMCB8fCB3b3JkID4gMHhmZmZmKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEkyQyB3b3JkICcgKyB3b3JkXG4gICAgICArICcuIFZhbGlkIHZhbHVlcyBhcmUgMCB0aHJvdWdoIDB4ZmZmZi4nXG4gICAgKTtcbiAgfVxufVxuXG5jb25zdCBkZXZpY2VzID0gU3ltYm9sKCdkZXZpY2VzJyk7XG5jb25zdCBnZXREZXZpY2UgPSBTeW1ib2woJ2dldERldmljZScpO1xuXG5leHBvcnQgY2xhc3MgSTJDIGV4dGVuZHMgUGVyaXBoZXJhbCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBsZXQgcGlucyA9IG9wdGlvbnM7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHBpbnMpKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHBpbnMgPSBvcHRpb25zLnBpbnMgfHwgWyAnU0RBMCcsICdTQ0wwJyBdO1xuICAgIH1cbiAgICBzdXBlcihwaW5zKTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgIFtkZXZpY2VzXToge1xuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWU6IFtdXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBleGVjU3luYygnbW9kcHJvYmUgaTJjLWRldicpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzW2RldmljZXNdLmZvckVhY2goZGV2aWNlID0+IHtcbiAgICAgIGRldmljZS5jbG9zZVN5bmMoKTtcbiAgICB9KTtcblxuICAgIHRoaXNbZGV2aWNlc10gPSBbXTtcblxuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIFtnZXREZXZpY2VdKGFkZHJlc3MpIHtcbiAgICBsZXQgZGV2aWNlID0gdGhpc1tkZXZpY2VzXVthZGRyZXNzXTtcblxuICAgIGlmIChkZXZpY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGV2aWNlID0gaTJjLm9wZW5TeW5jKGdldEJvYXJkUmV2aXNpb24oKSA9PT0gVkVSU0lPTl8xX01PREVMX0JfUkVWXzEgPyAwIDogMSk7XG4gICAgICB0aGlzW2RldmljZXNdW2FkZHJlc3NdID0gZGV2aWNlO1xuICAgIH1cblxuICAgIHJldHVybiBkZXZpY2U7XG4gIH1cblxuICByZWFkKGFkZHJlc3MsIHJlZ2lzdGVyLCBsZW5ndGgsIGNiKSB7XG4gICAgdGhpcy52YWxpZGF0ZUFsaXZlKCk7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgY2IgPSBsZW5ndGg7XG4gICAgICBsZW5ndGggPSByZWdpc3RlcjtcbiAgICAgIHJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNoZWNrQWRkcmVzcyhhZGRyZXNzKTtcbiAgICBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKTtcbiAgICBjaGVja0xlbmd0aChsZW5ndGgpO1xuICAgIGNoZWNrQ2FsbGJhY2soY2IpO1xuXG4gICAgY29uc3QgYnVmZmVyID0gbmV3IEJ1ZmZlcihsZW5ndGgpO1xuICAgIGZ1bmN0aW9uIGNhbGxiYWNrKGVycikge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgIH1cbiAgICAgIGNiKG51bGwsIGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgaWYgKHJlZ2lzdGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXNbZ2V0RGV2aWNlXShhZGRyZXNzKS5pMmNSZWFkKGFkZHJlc3MsIGxlbmd0aCwgYnVmZmVyLCBjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXNbZ2V0RGV2aWNlXShhZGRyZXNzKS5yZWFkSTJjQmxvY2soYWRkcmVzcywgcmVnaXN0ZXIsIGxlbmd0aCwgYnVmZmVyLCBjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgcmVhZFN5bmMoYWRkcmVzcywgcmVnaXN0ZXIsIGxlbmd0aCkge1xuICAgIHRoaXMudmFsaWRhdGVBbGl2ZSgpO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGxlbmd0aCA9IHJlZ2lzdGVyO1xuICAgICAgcmVnaXN0ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY2hlY2tBZGRyZXNzKGFkZHJlc3MpO1xuICAgIGNoZWNrUmVnaXN0ZXIocmVnaXN0ZXIpO1xuICAgIGNoZWNrTGVuZ3RoKGxlbmd0aCk7XG5cbiAgICBjb25zdCBidWZmZXIgPSBuZXcgQnVmZmVyKGxlbmd0aCk7XG5cbiAgICBpZiAocmVnaXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1JlYWRTeW5jKGFkZHJlc3MsIGxlbmd0aCwgYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLnJlYWRJMmNCbG9ja1N5bmMoYWRkcmVzcywgcmVnaXN0ZXIsIGxlbmd0aCwgYnVmZmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgcmVhZEJ5dGUoYWRkcmVzcywgcmVnaXN0ZXIsIGNiKSB7XG4gICAgdGhpcy52YWxpZGF0ZUFsaXZlKCk7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY2IgPSByZWdpc3RlcjtcbiAgICAgIHJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNoZWNrQWRkcmVzcyhhZGRyZXNzKTtcbiAgICBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKTtcbiAgICBjaGVja0NhbGxiYWNrKGNiKTtcblxuICAgIGlmIChyZWdpc3RlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBuZXcgQnVmZmVyKDEpO1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1JlYWQoYWRkcmVzcywgYnVmZmVyLmxlbmd0aCwgYnVmZmVyLCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgY2IobnVsbCwgYnVmZmVyWzBdKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzW2dldERldmljZV0oYWRkcmVzcykucmVhZEJ5dGUoYWRkcmVzcywgcmVnaXN0ZXIsIGNiKTtcbiAgICB9XG4gIH1cblxuICByZWFkQnl0ZVN5bmMoYWRkcmVzcywgcmVnaXN0ZXIpIHtcbiAgICB0aGlzLnZhbGlkYXRlQWxpdmUoKTtcblxuICAgIGNoZWNrQWRkcmVzcyhhZGRyZXNzKTtcbiAgICBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKTtcblxuICAgIGxldCBieXRlO1xuICAgIGlmIChyZWdpc3RlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBuZXcgQnVmZmVyKDEpO1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1JlYWRTeW5jKGFkZHJlc3MsIGJ1ZmZlci5sZW5ndGgsIGJ1ZmZlcik7XG4gICAgICBieXRlID0gYnVmZmVyWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBieXRlID0gdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLnJlYWRCeXRlU3luYyhhZGRyZXNzLCByZWdpc3Rlcik7XG4gICAgfVxuICAgIHJldHVybiBieXRlO1xuICB9XG5cbiAgcmVhZFdvcmQoYWRkcmVzcywgcmVnaXN0ZXIsIGNiKSB7XG4gICAgdGhpcy52YWxpZGF0ZUFsaXZlKCk7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY2IgPSByZWdpc3RlcjtcbiAgICAgIHJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNoZWNrQWRkcmVzcyhhZGRyZXNzKTtcbiAgICBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKTtcbiAgICBjaGVja0NhbGxiYWNrKGNiKTtcblxuICAgIGlmIChyZWdpc3RlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBuZXcgQnVmZmVyKDIpO1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1JlYWQoYWRkcmVzcywgYnVmZmVyLmxlbmd0aCwgYnVmZmVyLCBlcnIgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgY2IobnVsbCwgYnVmZmVyLnJlYWRVSW50MTZMRSgwKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLnJlYWRXb3JkKGFkZHJlc3MsIHJlZ2lzdGVyLCBjYik7XG4gICAgfVxuICB9XG5cbiAgcmVhZFdvcmRTeW5jKGFkZHJlc3MsIHJlZ2lzdGVyKSB7XG4gICAgdGhpcy52YWxpZGF0ZUFsaXZlKCk7XG5cbiAgICBjaGVja0FkZHJlc3MoYWRkcmVzcyk7XG4gICAgY2hlY2tSZWdpc3RlcihyZWdpc3Rlcik7XG5cbiAgICBsZXQgYnl0ZTtcbiAgICBpZiAocmVnaXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEJ1ZmZlcigyKTtcbiAgICAgIHRoaXNbZ2V0RGV2aWNlXShhZGRyZXNzKS5pMmNSZWFkU3luYyhhZGRyZXNzLCBidWZmZXIubGVuZ3RoLCBidWZmZXIpO1xuICAgICAgYnl0ZSA9IGJ1ZmZlci5yZWFkVUludDE2TEUoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ5dGUgPSB0aGlzW2dldERldmljZV0oYWRkcmVzcykucmVhZFdvcmRTeW5jKGFkZHJlc3MsIHJlZ2lzdGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGU7XG4gIH1cblxuICB3cml0ZShhZGRyZXNzLCByZWdpc3RlciwgYnVmZmVyLCBjYikge1xuICAgIHRoaXMudmFsaWRhdGVBbGl2ZSgpO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGNiID0gYnVmZmVyO1xuICAgICAgYnVmZmVyID0gcmVnaXN0ZXI7XG4gICAgICByZWdpc3RlciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjaGVja0FkZHJlc3MoYWRkcmVzcyk7XG4gICAgY2hlY2tSZWdpc3RlcihyZWdpc3Rlcik7XG4gICAgY2hlY2tCdWZmZXIoYnVmZmVyKTtcbiAgICBjaGVja0NhbGxiYWNrKGNiKTtcblxuICAgIGlmIChyZWdpc3RlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzW2dldERldmljZV0oYWRkcmVzcykuaTJjV3JpdGUoYWRkcmVzcywgYnVmZmVyLmxlbmd0aCwgYnVmZmVyLCBjYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXNbZ2V0RGV2aWNlXShhZGRyZXNzKS53cml0ZUkyY0Jsb2NrKGFkZHJlc3MsIHJlZ2lzdGVyLCBidWZmZXIubGVuZ3RoLCBidWZmZXIsIGNiKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVN5bmMoYWRkcmVzcywgcmVnaXN0ZXIsIGJ1ZmZlcikge1xuICAgIHRoaXMudmFsaWRhdGVBbGl2ZSgpO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGJ1ZmZlciA9IHJlZ2lzdGVyO1xuICAgICAgcmVnaXN0ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY2hlY2tBZGRyZXNzKGFkZHJlc3MpO1xuICAgIGNoZWNrUmVnaXN0ZXIocmVnaXN0ZXIpO1xuICAgIGNoZWNrQnVmZmVyKGJ1ZmZlcik7XG5cbiAgICBpZiAocmVnaXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1dyaXRlU3luYyhhZGRyZXNzLCBidWZmZXIubGVuZ3RoLCBidWZmZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzW2dldERldmljZV0oYWRkcmVzcykud3JpdGVJMmNCbG9ja1N5bmMoYWRkcmVzcywgcmVnaXN0ZXIsIGJ1ZmZlci5sZW5ndGgsIGJ1ZmZlcik7XG4gICAgfVxuICB9XG5cbiAgd3JpdGVCeXRlKGFkZHJlc3MsIHJlZ2lzdGVyLCBieXRlLCBjYikge1xuICAgIHRoaXMudmFsaWRhdGVBbGl2ZSgpO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGNiID0gYnl0ZTtcbiAgICAgIGJ5dGUgPSByZWdpc3RlcjtcbiAgICAgIHJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNoZWNrQWRkcmVzcyhhZGRyZXNzKTtcbiAgICBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKTtcbiAgICBjaGVja0J5dGUoYnl0ZSk7XG4gICAgY2hlY2tDYWxsYmFjayhjYik7XG5cbiAgICBpZiAocmVnaXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1dyaXRlKGFkZHJlc3MsIDEsIG5ldyBCdWZmZXIoW2J5dGVdKSwgY2IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzW2dldERldmljZV0oYWRkcmVzcykud3JpdGVCeXRlKGFkZHJlc3MsIHJlZ2lzdGVyLCBieXRlLCBjYik7XG4gICAgfVxuICB9XG5cbiAgd3JpdGVCeXRlU3luYyhhZGRyZXNzLCByZWdpc3RlciwgYnl0ZSkge1xuICAgIHRoaXMudmFsaWRhdGVBbGl2ZSgpO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGJ5dGUgPSByZWdpc3RlcjtcbiAgICAgIHJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNoZWNrQWRkcmVzcyhhZGRyZXNzKTtcbiAgICBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKTtcbiAgICBjaGVja0J5dGUoYnl0ZSk7XG5cbiAgICBpZiAocmVnaXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1dyaXRlU3luYyhhZGRyZXNzLCAxLCBuZXcgQnVmZmVyKFtieXRlXSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzW2dldERldmljZV0oYWRkcmVzcykud3JpdGVCeXRlU3luYyhhZGRyZXNzLCByZWdpc3RlciwgYnl0ZSk7XG4gICAgfVxuICB9XG5cbiAgd3JpdGVXb3JkKGFkZHJlc3MsIHJlZ2lzdGVyLCB3b3JkLCBjYikge1xuICAgIHRoaXMudmFsaWRhdGVBbGl2ZSgpO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGNiID0gd29yZDtcbiAgICAgIHdvcmQgPSByZWdpc3RlcjtcbiAgICAgIHJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNoZWNrQWRkcmVzcyhhZGRyZXNzKTtcbiAgICBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKTtcbiAgICBjaGVja1dvcmQod29yZCk7XG4gICAgY2hlY2tDYWxsYmFjayhjYik7XG5cbiAgICBpZiAocmVnaXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEJ1ZmZlcigyKTtcbiAgICAgIGJ1ZmZlci53cml0ZVVJbnQxNkxFKHdvcmQsIDApO1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1dyaXRlKGFkZHJlc3MsIGJ1ZmZlci5sZW5ndGgsIGJ1ZmZlciwgY2IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzW2dldERldmljZV0oYWRkcmVzcykud3JpdGVXb3JkKGFkZHJlc3MsIHJlZ2lzdGVyLCB3b3JkLCBjYik7XG4gICAgfVxuICB9XG5cbiAgd3JpdGVXb3JkU3luYyhhZGRyZXNzLCByZWdpc3Rlciwgd29yZCkge1xuICAgIHRoaXMudmFsaWRhdGVBbGl2ZSgpO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHdvcmQgPSByZWdpc3RlcjtcbiAgICAgIHJlZ2lzdGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNoZWNrQWRkcmVzcyhhZGRyZXNzKTtcbiAgICBjaGVja1JlZ2lzdGVyKHJlZ2lzdGVyKTtcbiAgICBjaGVja1dvcmQod29yZCk7XG5cbiAgICBpZiAocmVnaXN0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEJ1ZmZlcigyKTtcbiAgICAgIGJ1ZmZlci53cml0ZVVJbnQxNkxFKHdvcmQsIDApO1xuICAgICAgdGhpc1tnZXREZXZpY2VdKGFkZHJlc3MpLmkyY1dyaXRlU3luYyhhZGRyZXNzLCBidWZmZXIubGVuZ3RoLCBidWZmZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzW2dldERldmljZV0oYWRkcmVzcykud3JpdGVXb3JkU3luYyhhZGRyZXNzLCByZWdpc3Rlciwgd29yZCk7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=