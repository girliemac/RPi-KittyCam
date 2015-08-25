'use strict';

var fs = require('fs'),
  i2c = require('bindings')('i2c.node');

var DEVICE_PREFIX = '/dev/i2c-';

function Bus(busNumber) {
  if (!(this instanceof Bus)) {
    return new Bus(busNumber);
  }

  this._busNumber = busNumber;
  this._peripherals = [];
}

function I2cFuncs(i2cFuncBits) {
  if (!(this instanceof I2cFuncs)) {
    return new I2cFuncs(i2cFuncBits);
  }

  this.i2c = i2cFuncBits & i2c.I2C_FUNC_I2C;
  this.tenBitAddr = i2cFuncBits & i2c.I2C_FUNC_10BIT_ADDR;
  this.protocolMangling = i2cFuncBits & i2c.I2C_FUNC_PROTOCOL_MANGLING;
  this.smbusPec = i2cFuncBits & i2c.I2C_FUNC_SMBUS_PEC;
  this.smbusBlockProcCall = i2cFuncBits & i2c.I2C_FUNC_SMBUS_BLOCK_PROC_CALL;
  this.smbusQuick = i2cFuncBits & i2c.I2C_FUNC_SMBUS_QUICK;
  this.smbusReceiveByte = i2cFuncBits & i2c.I2C_FUNC_SMBUS_READ_BYTE;
  this.smbusSendByte = i2cFuncBits & i2c.I2C_FUNC_SMBUS_WRITE_BYTE;
  this.smbusReadByte = i2cFuncBits & i2c.I2C_FUNC_SMBUS_READ_BYTE_DATA;
  this.smbusWriteByte = i2cFuncBits & i2c.I2C_FUNC_SMBUS_WRITE_BYTE_DATA;
  this.smbusReadWord = i2cFuncBits & i2c.I2C_FUNC_SMBUS_READ_WORD_DATA;
  this.smbusWriteWord = i2cFuncBits & i2c.I2C_FUNC_SMBUS_WRITE_WORD_DATA;
  this.smbusProcCall = i2cFuncBits & i2c.I2C_FUNC_SMBUS_PROC_CALL;
  this.smbusReadBlock = i2cFuncBits & i2c.I2C_FUNC_SMBUS_READ_BLOCK_DATA;
  this.smbusWriteBlock = i2cFuncBits & i2c.I2C_FUNC_SMBUS_WRITE_BLOCK_DATA;
  this.smbusReadI2cBlock = i2cFuncBits & i2c.I2C_FUNC_SMBUS_READ_I2C_BLOCK;
  this.smbusWriteI2cBlock = i2cFuncBits & i2c.I2C_FUNC_SMBUS_WRITE_I2C_BLOCK;
}

module.exports.open = function (busNumber, cb) {
  var bus = new Bus(busNumber);
  setImmediate(cb, null);
  return bus;
};

module.exports.openSync = function (busNumber) {
  return new Bus(busNumber);
};

function peripheral(bus, addr, cb) {
  var device = bus._peripherals[addr];

  if (device === undefined) {
    fs.open(DEVICE_PREFIX + bus._busNumber, 'r+', function (err, device) {
      if (err) {
        return cb(err);
      }

      i2c.setAddrAsync(device, addr, function (err) {
        if (err) {
          return cb(err);
        }

        bus._peripherals[addr] = device;

        cb(null, device);
      });
    });
  } else {
    setImmediate(cb, null, device);
  }
}

function peripheralSync(bus, addr) {
  var peripheral = bus._peripherals[addr];

  if (peripheral === undefined) {
    peripheral = fs.openSync(DEVICE_PREFIX + bus._busNumber, 'r+');
    i2c.setAddrSync(peripheral, addr);
    bus._peripherals[addr] = peripheral;
  }

  return peripheral;
}

Bus.prototype.close = function (cb) {
  var peripherals = this._peripherals.filter(function (peripheral) {
    return peripheral !== undefined;
  });

  (function close() {
    if (peripherals.length === 0) {
      return setImmediate(cb, null);
    }

    fs.close(peripherals.pop(), function (err) {
      if (err) {
        return cb(err);
      }
      close();
    });
  }());
};

Bus.prototype.closeSync = function () {
  this._peripherals.forEach(function (peripheral) {
    if (peripheral !== undefined) {
      fs.closeSync(peripheral);
    }
  });
  this._peripherals = [];
};

Bus.prototype.i2cFuncs = function (cb) {
  if (!this.funcs) {
    peripheral(this, 0, function (err, device) {
      if (err) {
        return cb(err);
      }

      i2c.i2cFuncsAsync(device, function (err, i2cFuncBits) {
        if (err) {
          return cb(err);
        }
        this.funcs = Object.freeze(new I2cFuncs(i2cFuncBits));
        cb(null, this.funcs);
      });
    });
  } else {
    setImmediate(cb, null, this.funcs);
  }
};

Bus.prototype.i2cFuncsSync = function () {
  if (!this.funcs) {
    this.funcs = Object.freeze(new I2cFuncs(i2c.i2cFuncsSync(peripheralSync(this, 0))));
  }

  return this.funcs;
};

Bus.prototype.readByte = function (addr, cmd, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.readByteAsync(device, cmd, cb);
  }.bind(this));
};

Bus.prototype.readByteSync = function (addr, cmd) {
  return i2c.readByteSync(peripheralSync(this, addr), cmd);
};

Bus.prototype.readWord = function (addr, cmd, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.readWordAsync(device, cmd, cb);
  }.bind(this));
};

Bus.prototype.readWordSync = function (addr, cmd) {
  return i2c.readWordSync(peripheralSync(this, addr), cmd);
};

// UNTESTED and undocumented due to lack of supporting hardware
Bus.prototype.readBlock = function (addr, cmd, buffer, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.readBlockAsync(device, cmd, buffer, cb);
  }.bind(this));
};

// UNTESTED and undocumented due to lack of supporting hardware
Bus.prototype.readBlockSync = function (addr, cmd, buffer) {
  return i2c.readBlockSync(peripheralSync(this, addr), cmd, buffer);
};

Bus.prototype.readI2cBlock = function (addr, cmd, length, buffer, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.readI2cBlockAsync(device, cmd, length, buffer, cb);
  }.bind(this));
};

Bus.prototype.readI2cBlockSync = function (addr, cmd, length, buffer) {
  return i2c.readI2cBlockSync(peripheralSync(this, addr), cmd, length, buffer);
};

Bus.prototype.receiveByte = function (addr, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.receiveByteAsync(device, cb);
  }.bind(this));
};

Bus.prototype.receiveByteSync = function (addr) {
  return i2c.receiveByteSync(peripheralSync(this, addr));
};

Bus.prototype.sendByte = function (addr, byte, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.sendByteAsync(device, byte, cb);
  }.bind(this));
};

Bus.prototype.sendByteSync = function (addr, byte) {
  i2c.sendByteSync(peripheralSync(this, addr), byte);
  return this;
};

Bus.prototype.writeByte = function (addr, cmd, byte, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.writeByteAsync(device, cmd, byte, cb);
  }.bind(this));
};

Bus.prototype.writeByteSync = function (addr, cmd, byte) {
  i2c.writeByteSync(peripheralSync(this, addr), cmd, byte);
  return this;
};

Bus.prototype.writeWord = function (addr, cmd, word, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.writeWordAsync(device, cmd, word, cb);
  }.bind(this));
};

Bus.prototype.writeWordSync = function (addr, cmd, word) {
  i2c.writeWordSync(peripheralSync(this, addr), cmd, word);
  return this;
};

Bus.prototype.writeQuick = function (addr, bit, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.writeQuickAsync(device, bit, cb);
  }.bind(this));
};

Bus.prototype.writeQuickSync = function (addr, bit) {
  i2c.writeQuickSync(peripheralSync(this, addr), bit);
  return this;
};

// UNTESTED and undocumented due to lack of supporting hardware
Bus.prototype.writeBlock = function (addr, cmd, length, buffer, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.writeBlockAsync(device, cmd, length, buffer, cb);
  }.bind(this));
};

// UNTESTED and undocumented due to lack of supporting hardware
Bus.prototype.writeBlockSync = function (addr, cmd, length, buffer) {
  i2c.writeBlockSync(peripheralSync(this, addr), cmd, length, buffer);
  return this;
};

Bus.prototype.writeI2cBlock = function (addr, cmd, length, buffer, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    i2c.writeI2cBlockAsync(device, cmd, length, buffer, cb);
  }.bind(this));
};

Bus.prototype.writeI2cBlockSync = function (addr, cmd, length, buffer) {
  i2c.writeI2cBlockSync(peripheralSync(this, addr), cmd, length, buffer);
  return this;
};

Bus.prototype.i2cRead = function (addr, length, buffer, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    fs.read(device, buffer, 0, length, 0, cb);
  }.bind(this));
};

Bus.prototype.i2cReadSync = function (addr, length, buffer) {
  return fs.readSync(peripheralSync(this, addr), buffer, 0, length, 0);
};

Bus.prototype.i2cWrite = function (addr, length, buffer, cb) {
  peripheral(this, addr, function (err, device) {
    if (err) {
      return cb(err);
    }

    fs.write(device, buffer, 0, length, 0, cb);
  }.bind(this));
};

Bus.prototype.i2cWriteSync = function (addr, length, buffer) {
  return fs.writeSync(peripheralSync(this, addr), buffer, 0, length, 0);
};

