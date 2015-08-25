'use strict';

// Test the sychronous raspio-i2c methods
// Assumes that a DS1621 temperature sensor is wired up to the Pi

var assert = require('assert'),
  I2C = require('../').I2C,
  i2c = new I2C();

var DS1621_ADDR = 0x48,
  CMD_ACCESS_CONFIG = 0xac,
  CMD_ACCESS_TL = 0xa2;

// Wait while non volatile memory busy
function waitForWrite() {
  while (i2c.readByteSync(DS1621_ADDR, CMD_ACCESS_CONFIG) & 0x10) {
  }
}

// Test i2cReadSync and i2cWriteSync without specifying a register
// Change value of tl to 27 and verify that tl has been changed
function readWriteBlockNoRegister() {
  var cmdSetTL = new Buffer([CMD_ACCESS_TL, 27, 0]);
  var cmdGetTL = new Buffer([CMD_ACCESS_TL]);
  var tl;
  var undef;

  undef = i2c.writeSync(DS1621_ADDR, cmdSetTL);
  assert.strictEqual(undef, undefined, 'expected i2cWriteSync to return undefined');
  waitForWrite();

  undef = i2c.writeSync(DS1621_ADDR, cmdGetTL);
  assert.strictEqual(undef, undefined, 'expected i2cWriteSync to return undefined');

  tl = i2c.readSync(DS1621_ADDR, 2);
  assert.strictEqual(tl.length, 2, 'expected i2cReadSync to read 2 bytes');
  assert.strictEqual(tl.readUInt16LE(0), 27, 'expected i2cReadSync to read value 27');
}

// Test i2cReadSync and i2cWriteSync
// Change value of tl to 26 and verify that tl has been changed
function readWriteBlock() {
  var tlbuf = new Buffer(2);
  var newtl;
  var undef;

  tlbuf.writeUInt16LE(26, 0);
  undef = i2c.writeSync(DS1621_ADDR, CMD_ACCESS_TL, tlbuf);
  assert.strictEqual(undef, undefined, 'expected i2cWriteSync to return undefined');
  waitForWrite();

  newtl = i2c.readSync(DS1621_ADDR, CMD_ACCESS_TL, 2);
  assert.strictEqual(newtl.length, 2, 'expected i2cReadSync to read 2 bytes');
  assert.strictEqual(newtl.readUInt16LE(0), 26, 'expected i2cReadSync to read value 26');
}

// Test readWordSync (but not writeWordSync) without specifying a register
// Change value of tl to 25 and verify that tl has been changed
function readWriteWordNoRegister() {
  var newtl;
  var undef;

  // Note that only readWordSync is called without specifying a register.
  // Is there anything where it makes sense to call writeWordSync 
  // without specifying a register? Write config maybe?

  undef = i2c.writeWordSync(DS1621_ADDR, CMD_ACCESS_TL, 25);
  assert.strictEqual(undef, undefined, 'expected writeWordSync to return undefined');
  waitForWrite();

  undef = i2c.writeByteSync(DS1621_ADDR, CMD_ACCESS_TL);
  assert.strictEqual(undef, undefined, 'expected writeByteSync to return undefined');
  newtl = i2c.readWordSync(DS1621_ADDR);
  assert(typeof newtl === 'number' && newtl >= 0 && newtl <= 0xffff, 'expeted readWordSync to read a word');
  assert.strictEqual(newtl, 25, 'expected readWordSync to read value 25');
}

// Test readWordSync and writeWordSync
// Change value of tl to 24 and verify that tl has been changed
function readWriteWord() {
  var newtl;
  var undef;

  undef = i2c.writeWordSync(DS1621_ADDR, CMD_ACCESS_TL, 24);
  assert.strictEqual(undef, undefined, 'expected writeWordSync to return undefined');
  waitForWrite();

  newtl = i2c.readWordSync(DS1621_ADDR, CMD_ACCESS_TL);
  assert(typeof newtl === 'number' && newtl >= 0 && newtl <= 0xffff, 'expeted readWordSync to read a word');
  assert.strictEqual(newtl, 24, 'expected readWordSync to read value 24');
}

// Test readByteSync and writeByteSync without specifying a register
// Verify that one shot mode has been entered
function readWriteByteNoRegister() {
  var config;
  var undef;

  undef = i2c.writeByteSync(DS1621_ADDR, CMD_ACCESS_CONFIG);
  assert.strictEqual(undef, undefined, 'expected writeByteSync to return undefined');

  config = i2c.readByteSync(DS1621_ADDR);
  assert(typeof config === 'number' && config >= 0 && config <= 0xff, 'expeted readByteSync to read a byte');
  assert.strictEqual(config & 0x1, 1, 'one shot mode not eneterd');
}

// Test readByteSync and writeByteSync
// Enter one shot mode and verify that one shot mode has been entered
function readWriteByte() {
  var config;
  var undef;

  undef = i2c.writeByteSync(DS1621_ADDR, CMD_ACCESS_CONFIG, 0x01);
  assert.strictEqual(undef, undefined, 'expected writeByteSync to return undefined');
  waitForWrite();

  config = i2c.readByteSync(DS1621_ADDR, CMD_ACCESS_CONFIG);
  assert(typeof config === 'number' && config >= 0 && config <= 0xff, 'expeted readByteSync to read a byte');
  assert.strictEqual(config & 0x1, 1, 'one shot mode not eneterd');
}

readWriteByte();
readWriteByteNoRegister();
readWriteWord();
readWriteWordNoRegister();
readWriteBlock();
readWriteBlockNoRegister();

i2c.destroy();

console.log('ok - ds1621-sync');

