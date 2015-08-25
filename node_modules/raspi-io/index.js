/*
Copyright (c) 2014 Bryan Hughes <bryan@theoreticalideations.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the 'Software'), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

import fs from 'fs';
import { EventEmitter } from 'events';
import Symbol from 'es6-symbol';
import { init } from 'raspi';
import { getPins, getPinNumber } from 'raspi-board';
import { DigitalOutput, DigitalInput } from 'raspi-gpio';
import { PWM } from 'raspi-pwm';
import { I2C } from 'raspi-i2c';
import { LED } from 'raspi-led';
import 'es6-symbol/implement';

// Constants
const INPUT_MODE = 0;
const OUTPUT_MODE = 1;
const ANALOG_MODE = 2;
const PWM_MODE = 3;
const SERVO_MODE = 4;
const UNKNOWN_MODE = 99;

const LOW = 0;
const HIGH = 1;

const LED_PIN = -1;

// Settings
const DIGITAL_READ_UPDATE_RATE = 19;

// Private symbols
const isReady = Symbol();
const pins = Symbol();
const instances = Symbol();
const analogPins = Symbol();
const getPinInstance = Symbol();
const i2c = Symbol();
const i2cDelay = Symbol();
const i2cRead = Symbol();
const i2cCheckAlive = Symbol();


class Raspi extends EventEmitter {

  constructor() {
    super();

    Object.defineProperties(this, {
      name: {
        enumerable: true,
        value: 'RaspberryPi-IO'
      },

      [instances]: {
        writable: true,
        value: []
      },

      [isReady]: {
        writable: true,
        value: false
      },
      isReady: {
        enumerable: true,
        get() {
          return this[isReady];
        }
      },

      [pins]: {
        writable: true,
        value: []
      },
      pins: {
        enumerable: true,
        get() {
          return this[pins];
        }
      },

      [analogPins]: {
        writable: true,
        value: []
      },
      analogPins: {
        enumerable: true,
        get() {
          return this[analogPins];
        }
      },

      [i2c]: {
        writable: true,
        value: new I2C()
      },

      [i2cDelay]: {
        writable: true,
        value: 0
      },

      MODES: {
        enumerable: true,
        value: Object.freeze({
          INPUT: INPUT_MODE,
          OUTPUT: OUTPUT_MODE,
          ANALOG: ANALOG_MODE,
          PWM: PWM_MODE,
          SERVO: SERVO_MODE
        })
      },

      HIGH: {
        enumerable: true,
        value: HIGH
      },
      LOW: {
        enumerable: true,
        value: LOW
      },

      defaultLed: {
        enumerable: true,
        value: LED_PIN
      }
    });

    init(() => {
      const pinMappings = getPins();
      this[pins] = [];

      // Slight hack to get the LED in there, since it's not actually a pin
      pinMappings[LED_PIN] = {
        pins: [ LED_PIN ],
        peripherals: [ 'gpio' ]
      };

      Object.keys(pinMappings).forEach((pin) => {
        const pinInfo = pinMappings[pin];
        const supportedModes = [ INPUT_MODE, OUTPUT_MODE ];
        if (pinInfo.peripherals.indexOf('pwm') != -1) {
          supportedModes.push(PWM_MODE, SERVO_MODE);
        }
        const instance = this[instances][pin] = {
          peripheral: null,
          mode: UNKNOWN_MODE,
          previousWrittenValue: LOW
        };
        this[pins][pin] = Object.create(null, {
          supportedModes: {
            enumerable: true,
            value: Object.freeze(supportedModes)
          },
          mode: {
            enumerable: true,
            get() {
              return instance.mode;
            }
          },
          value: {
            enumerable: true,
            get() {
              switch (instance.mode) {
                case INPUT_MODE:
                  return instance.peripheral.read();
                case OUTPUT_MODE:
                  return instance.previousWrittenValue;
                default:
                  return null;
              }
            },
            set(value) {
              if (instance.mode == OUTPUT_MODE) {
                instance.peripheral.write(value);
              }
            }
          },
          report: {
            enumerable: true,
            value: 1
          },
          analogChannel: {
            enumerable: true,
            value: 127
          }
        });
      });

      // Fill in the holes, sins pins are sparse on the A+/B+/2
      for (let i = 0; i < this[pins].length; i++) {
        if (!this[pins][i]) {
          this[pins][i] = Object.create(null, {
            supportedModes: {
              enumerable: true,
              value: Object.freeze([])
            },
            mode: {
              enumerable: true,
              get() {
                return UNKNOWN_MODE;
              }
            },
            value: {
              enumerable: true,
              get() {
                return 0;
              },
              set() {}
            },
            report: {
              enumerable: true,
              value: 1
            },
            analogChannel: {
              enumerable: true,
              value: 127
            }
          });
        }
      }

      this[isReady] = true;
      this.emit('ready');
      this.emit('connect');
    });
  }

  reset() {
    throw new Error('reset is not supported on the Raspberry Pi');
  }

  normalize(pin) {
    const normalizedPin = getPinNumber(pin);
    if (typeof normalizedPin == 'undefined') {
      throw new Error('Unknown pin "' + pin + '"');
    }
    return normalizedPin;
  }

  [getPinInstance](pin) {
    const pinInstance = this[instances][pin];
    if (!pinInstance) {
      throw new Error('Unknown pin "' + pin + '"');
    }
    return pinInstance;
  }

  pinMode(pin, mode) {
    const normalizedPin = this.normalize(pin);
    const pinInstance = this[getPinInstance](normalizedPin);
    if (this[pins][normalizedPin].supportedModes.indexOf(mode) == -1) {
      throw new Error('Pin "' + pin + '" does not support mode "' + mode + '"');
    }
    if (pin == LED_PIN && !(pinInstance.peripheral instanceof LED)) {
      pinInstance.peripheral = new LED();
    } else {
      switch (mode) {
        case INPUT_MODE:
          pinInstance.peripheral = new DigitalInput(normalizedPin);
          break;
        case OUTPUT_MODE:
          pinInstance.peripheral = new DigitalOutput(normalizedPin);
          break;
        case PWM_MODE:
        case SERVO_MODE:
          pinInstance.peripheral = new PWM(normalizedPin);
          break;
        default:
          console.warn('Unknown pin mode: ' + mode);
          break;
      }
    }
    pinInstance.mode = mode;
  }

  analogRead() {
    throw new Error('analogRead is not supported on the Raspberry Pi');
  }

  analogWrite(pin, value) {
    const pinInstance = this[getPinInstance](this.normalize(pin));
    if (pinInstance.mode != PWM_MODE) {
      this.pinMode(pin, PWM_MODE);
    }
    pinInstance.peripheral.write(Math.round(value * 1000 / 255));
  }

  digitalRead(pin, handler) {
    const pinInstance = this[getPinInstance](this.normalize(pin));
    if (pinInstance.mode != INPUT_MODE) {
      this.pinMode(pin, INPUT_MODE);
    }
    const interval = setInterval(() => {
      let value;
      if (pinInstance.mode == INPUT_MODE) {
        value = pinInstance.peripheral.read();
      } else {
        value = pinInstance.previousWrittenValue;
      }
      if (handler) {
        handler(value);
      }
      this.emit('digital-read-' + pin, value);
    }, DIGITAL_READ_UPDATE_RATE);
    pinInstance.peripheral.on('destroyed', () => {
      clearInterval(interval);
    });
  }

  digitalWrite(pin, value) {
    const pinInstance = this[getPinInstance](this.normalize(pin));
    if (pinInstance.mode != OUTPUT_MODE) {
      this.pinMode(pin, OUTPUT_MODE);
    }
    if (value != pinInstance.previousWrittenValue) {
      pinInstance.peripheral.write(value ? HIGH : LOW);
      pinInstance.previousWrittenValue = value;
    }
  }

  servoWrite(pin, value) {
    const pinInstance = this[getPinInstance](this.normalize(pin));
    if (pinInstance.mode != SERVO_MODE) {
      this.pinMode(pin, SERVO_MODE);
    }
    pinInstance.peripheral.write(48 + Math.round(value * 48 / 180));
  }

  queryCapabilities(cb) {
    if (this.isReady) {
      process.nextTick(cb);
    } else {
      this.on('ready', cb);
    }
  }

  queryAnalogMapping(cb) {
    if (this.isReady) {
      process.nextTick(cb);
    } else {
      this.on('ready', cb);
    }
  }

  queryPinState(pin, cb) {
    if (this.isReady) {
      process.nextTick(cb);
    } else {
      this.on('ready', cb);
    }
  }

  [i2cCheckAlive]() {
    if (!this[i2c].alive) {
      throw new Error('I2C pins not in I2C mode');
    }
  }

  i2cConfig(delay) {
    this[i2cCheckAlive]();

    this[i2cDelay] = delay || 0;

    return this;
  }

  i2cWrite(address, cmdRegOrData, inBytes) {
    this[i2cCheckAlive]();

    // If i2cWrite was used for an i2cWriteReg call...
    if (arguments.length === 3 &&
        !Array.isArray(cmdRegOrData) &&
        !Array.isArray(inBytes)) {
      return this.i2cWriteReg(address, cmdRegOrData, inBytes);
    }

    // Fix arguments if called with Firmata.js API
    if (arguments.length === 2) {
      if (Array.isArray(cmdRegOrData)) {
        inBytes = cmdRegOrData.slice();
        cmdRegOrData = inBytes.shift();
      } else {
        inBytes = [];
      }
    }

    const buffer = new Buffer([cmdRegOrData].concat(inBytes));

    // Only write if bytes provided
    if (buffer.length) {
      this[i2c].writeSync(address, buffer);
    }

    return this;
  }

  i2cWriteReg(address, register, value) {
    this[i2cCheckAlive]();

    this[i2c].writeByteSync(address, register, value);

    return this;
  }

  [i2cRead](continuous, address, register, bytesToRead, callback) {
    this[i2cCheckAlive]();

    // Fix arguments if called with Firmata.js API
    if (arguments.length == 4 &&
      typeof register == 'number' &&
      typeof bytesToRead == 'function'
    ) {
      callback = bytesToRead;
      bytesToRead = register;
      register = null;
    }

    callback = typeof callback === 'function' ? callback : () => {};

    let event = 'I2C-reply' + address + '-';
    event += register !== null ? register : 0;

    const read = () => {
      const afterRead = (err, buffer) => {
        if (err) {
          return this.emit('error', err);
        }

        // Convert buffer to Array before emit
        this.emit(event, Array.prototype.slice.call(buffer));

        if (continuous) {
          setTimeout(read, this[i2cDelay]);
        }
      };

      this.once(event, callback);

      if (register !== null) {
        this[i2c].read(address, register, bytesToRead, afterRead);
      } else {
        this[i2c].read(address, bytesToRead, afterRead);
      }
    };

    setTimeout(read, this[i2cDelay]);

    return this;
  }

  i2cRead(...rest) {
    return this[i2cRead](true, ...rest);
  }

  i2cReadOnce(...rest) {
    return this[i2cRead](false, ...rest);
  }

  sendI2CConfig(...rest) {
    return this.i2cConfig(...rest);
  }

  sendI2CWriteRequest(...rest) {
    return this.i2cWrite(...rest);
  }

  sendI2CReadRequest(...rest) {
    return this.i2cReadOnce(...rest);
  }

  sendOneWireConfig() {
    throw new Error('sendOneWireConfig is not supported on the Raspberry Pi');
  }

  sendOneWireSearch() {
    throw new Error('sendOneWireSearch is not supported on the Raspberry Pi');
  }

  sendOneWireAlarmsSearch() {
    throw new Error('sendOneWireAlarmsSearch is not supported on the Raspberry Pi');
  }

  sendOneWireRead() {
    throw new Error('sendOneWireRead is not supported on the Raspberry Pi');
  }

  sendOneWireReset() {
    throw new Error('sendOneWireConfig is not supported on the Raspberry Pi');
  }

  sendOneWireWrite() {
    throw new Error('sendOneWireWrite is not supported on the Raspberry Pi');
  }

  sendOneWireDelay() {
    throw new Error('sendOneWireDelay is not supported on the Raspberry Pi');
  }

  sendOneWireWriteAndRead() {
    throw new Error('sendOneWireWriteAndRead is not supported on the Raspberry Pi');
  }

  setSamplingInterval() {
    throw new Error('setSamplingInterval is not yet implemented');
  }

  reportAnalogPin() {
    throw new Error('reportAnalogPin is not yet implemented');
  }

  reportDigitalPin() {
    throw new Error('reportDigitalPin is not yet implemented');
  }

  pingRead() {
    throw new Error('pingRead is not yet implemented');
  }

  pulseIn() {
    throw new Error('pulseIn is not yet implemented');
  }

  stepperConfig() {
    throw new Error('stepperConfig is not yet implemented');
  }

  stepperStep() {
    throw new Error('stepperStep is not yet implemented');
  }
}

Object.defineProperty(Raspi, 'isRaspberryPi', {
  enumerable: true,
  value: () => {
    // Determining if a system is a Raspberry Pi isn't possible through
    // the os module on Raspbian, so we read it from the file system instead
    let isRaspberryPi = false;
    try {
      isRaspberryPi = fs.readFileSync('/etc/os-release').toString().indexOf('Raspbian') !== -1;
    } catch(e) {}// Squash file not found, etc errors
    return isRaspberryPi;
  }
});

module.exports = Raspi;
