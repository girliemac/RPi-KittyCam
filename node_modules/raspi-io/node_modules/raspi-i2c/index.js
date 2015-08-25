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

import i2c from 'i2c-bus';
import { execSync } from 'child_process';
import { Peripheral } from 'raspi-peripheral';
import { VERSION_1_MODEL_B_REV_1, getBoardRevision } from 'raspi-board';

if (typeof execSync !== 'function') {
  execSync = require('execSync').run;
}

function checkAddress(address) {
  if (typeof address !== 'number' || address < 0 || address > 0x7f) {
    throw new Error('Invalid I2C address ' + address
      + '. Valid addresses are 0 through 0x7f.'
    );
  }
}

function checkRegister(register) {
  if (register !== undefined &&
      (typeof register !== 'number' || register < 0 || register > 0xff)) {
    throw new Error('Invalid I2C register ' + register
      + '. Valid registers are 0 through 0xff.'
    );
  }
}

function checkLength(length) {
  if (typeof length !== 'number' || length < 0 || length > 32) {
    throw new Error('Invalid I2C length ' + length
      + '. Valid lengths are 0 through 32.'
    );
  }
}

function checkCallback(cb) {
  if (typeof cb !== 'function') {
    throw new Error('Invalid I2C callback ' + cb);
  }
}

function checkBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length <= 0 || buffer.length > 32) {
    throw new Error('Invalid I2C buffer ' + buffer
      + '. Valid lengths are 0 through 32.'
    );
  }
}

function checkByte(byte) {
  if (typeof byte !== 'number' || byte < 0 || byte > 0xff) {
    throw new Error('Invalid I2C byte ' + byte
      + '. Valid values are 0 through 0xff.'
    );
  }
}

function checkWord(word) {
  if (typeof word !== 'number' || word < 0 || word > 0xffff) {
    throw new Error('Invalid I2C word ' + word
      + '. Valid values are 0 through 0xffff.'
    );
  }
}

const devices = Symbol('devices');
const getDevice = Symbol('getDevice');

export class I2C extends Peripheral {
  constructor(options) {
    let pins = options;
    if (!Array.isArray(pins)) {
      options = options || {};
      pins = options.pins || [ 'SDA0', 'SCL0' ];
    }
    super(pins);

    Object.defineProperties(this, {
      [devices]: {
        writable: true,
        value: []
      }
    });

    execSync('modprobe i2c-dev');
  }

  destroy() {
    this[devices].forEach(device => {
      device.closeSync();
    });

    this[devices] = [];

    super.destroy();
  }

  [getDevice](address) {
    let device = this[devices][address];

    if (device === undefined) {
      device = i2c.openSync(getBoardRevision() === VERSION_1_MODEL_B_REV_1 ? 0 : 1);
      this[devices][address] = device;
    }

    return device;
  }

  read(address, register, length, cb) {
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

    const buffer = new Buffer(length);
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

  readSync(address, register, length) {
    this.validateAlive();

    if (arguments.length === 2) {
      length = register;
      register = undefined;
    }

    checkAddress(address);
    checkRegister(register);
    checkLength(length);

    const buffer = new Buffer(length);

    if (register === undefined) {
      this[getDevice](address).i2cReadSync(address, length, buffer);
    } else {
      this[getDevice](address).readI2cBlockSync(address, register, length, buffer);
    }

    return buffer;
  }

  readByte(address, register, cb) {
    this.validateAlive();

    if (arguments.length === 2) {
      cb = register;
      register = undefined;
    }

    checkAddress(address);
    checkRegister(register);
    checkCallback(cb);

    if (register === undefined) {
      const buffer = new Buffer(1);
      this[getDevice](address).i2cRead(address, buffer.length, buffer, err => {
        if (err) {
          return cb(err);
        }
        cb(null, buffer[0]);
      });
    } else {
      this[getDevice](address).readByte(address, register, cb);
    }
  }

  readByteSync(address, register) {
    this.validateAlive();

    checkAddress(address);
    checkRegister(register);

    let byte;
    if (register === undefined) {
      const buffer = new Buffer(1);
      this[getDevice](address).i2cReadSync(address, buffer.length, buffer);
      byte = buffer[0];
    } else {
      byte = this[getDevice](address).readByteSync(address, register);
    }
    return byte;
  }

  readWord(address, register, cb) {
    this.validateAlive();

    if (arguments.length === 2) {
      cb = register;
      register = undefined;
    }

    checkAddress(address);
    checkRegister(register);
    checkCallback(cb);

    if (register === undefined) {
      const buffer = new Buffer(2);
      this[getDevice](address).i2cRead(address, buffer.length, buffer, err => {
        if (err) {
          return cb(err);
        }
        cb(null, buffer.readUInt16LE(0));
      });
    } else {
      this[getDevice](address).readWord(address, register, cb);
    }
  }

  readWordSync(address, register) {
    this.validateAlive();

    checkAddress(address);
    checkRegister(register);

    let byte;
    if (register === undefined) {
      const buffer = new Buffer(2);
      this[getDevice](address).i2cReadSync(address, buffer.length, buffer);
      byte = buffer.readUInt16LE(0);
    } else {
      byte = this[getDevice](address).readWordSync(address, register);
    }
    return byte;
  }

  write(address, register, buffer, cb) {
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

  writeSync(address, register, buffer) {
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

  writeByte(address, register, byte, cb) {
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

  writeByteSync(address, register, byte) {
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

  writeWord(address, register, word, cb) {
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
      const buffer = new Buffer(2);
      buffer.writeUInt16LE(word, 0);
      this[getDevice](address).i2cWrite(address, buffer.length, buffer, cb);
    } else {
      this[getDevice](address).writeWord(address, register, word, cb);
    }
  }

  writeWordSync(address, register, word) {
    this.validateAlive();

    if (arguments.length === 2) {
      word = register;
      register = undefined;
    }

    checkAddress(address);
    checkRegister(register);
    checkWord(word);

    if (register === undefined) {
      const buffer = new Buffer(2);
      buffer.writeUInt16LE(word, 0);
      this[getDevice](address).i2cWriteSync(address, buffer.length, buffer);
    } else {
      this[getDevice](address).writeWordSync(address, register, word);
    }
  }
}
