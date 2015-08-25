'use strict';

// Test errors/exceptions

var assert = require('assert'),
  I2C = require('../').I2C,
  i2c = new I2C();

var DS1621_ADDR = 0x48,
  CMD_ACCESS_CONFIG = 0xac,
  CMD_ACCESS_TL = 0xa2;

var INVALID_ADDR = 0x80,
  INVALID_REGISTER = 0x100,
  INVALID_LENGTH = 33,
  INVALID_CALLBACK = 'This is a string, not a callback',
  INVALID_BUFFER = 123456789,
  INVALID_BYTE = 0x1234,
  INVALID_WORD = -1;

function invalidAddress() {
  assert.throws(
    function () {
      i2c.writeByteSync(INVALID_ADDR, CMD_ACCESS_CONFIG, 0x01);
    },
    /Invalid I2C address 128. Valid addresses are 0 through 0x7f./
  );
}

function invalidRegister() {
  assert.throws(
    function () {
      i2c.writeByteSync(DS1621_ADDR, INVALID_REGISTER, 0x01);
    },
    /Invalid I2C register 256. Valid registers are 0 through 0xff./
  );
}

function invalidLength() {
  assert.throws(
    function () {
      i2c.readSync(DS1621_ADDR, CMD_ACCESS_CONFIG, INVALID_LENGTH);
    },
    /Invalid I2C length 33. Valid lengths are 0 through 32./
  );
}

function invalidCallback() {
  assert.throws(
    function () {
      i2c.read(DS1621_ADDR, CMD_ACCESS_CONFIG, 2, INVALID_CALLBACK);
    },
    /Invalid I2C callback This is a string, not a callback/
  );
}

function invalidBuffer() {
  assert.throws(
    function () {
      i2c.writeSync(DS1621_ADDR, CMD_ACCESS_CONFIG, INVALID_BUFFER);
    },
    /Invalid I2C buffer 123456789. Valid lengths are 0 through 32./
  );
}

function invalidByte() {
  assert.throws(
    function () {
      i2c.writeByteSync(DS1621_ADDR, CMD_ACCESS_CONFIG, INVALID_BYTE);
    },
    /Invalid I2C byte 4660. Valid values are 0 through 0xff./
  );
}

function invalidWord() {
  assert.throws(
    function () {
      i2c.writeWordSync(DS1621_ADDR, CMD_ACCESS_CONFIG, INVALID_WORD);
    },
    /Invalid I2C word -1. Valid values are 0 through 0xffff./
  );
}

function invalidState() {
  assert.throws(
    function () {
      i2c.destroy();
      i2c.writeWordSync(DS1621_ADDR, CMD_ACCESS_CONFIG, 2);
    },
    /Attempted to access a destroyed I2C peripheral/
  );
}

invalidAddress();
invalidRegister();
invalidLength();
invalidCallback();
invalidBuffer();
invalidByte();
invalidWord();
invalidState();

console.log('ok - errors');

