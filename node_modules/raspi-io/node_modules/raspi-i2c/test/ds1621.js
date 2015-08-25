'use strict';

// Test the asychronous raspio-i2c methods
// Assumes that a DS1621 temperature sensor is wired up to the Pi

var assert = require('assert'),
  I2C = require('../').I2C,
  i2c = new I2C();

var DS1621_ADDR = 0x48,
  CMD_ACCESS_CONFIG = 0xac,
  CMD_ACCESS_TL = 0xa2;

// Wait while non volatile memory busy
function waitForWrite(cb) {
  i2c.readByte(DS1621_ADDR, CMD_ACCESS_CONFIG, function (err, config) {
    assert(!err, 'can\'t read config to determine memory status');
    if (config & 0x10) {
      return waitForWrite(cb);
    }
    cb();
  });
}

// Test i2cRead and i2cWrite without specifying a register
// Change value of tl to 27 and verify that tl has been changed
function readWriteBlockNoRegister() {
  var cmdSetTL = new Buffer([CMD_ACCESS_TL, 27, 0]);
  var cmdGetTL = new Buffer([CMD_ACCESS_TL]);
  var undef;

  undef = i2c.write(DS1621_ADDR, cmdSetTL, function (err) {
    assert(!err, 'i2cWrite can\'t write 27 to tl');

    waitForWrite(function () {
      undef = i2c.write(DS1621_ADDR, cmdGetTL, function (err) {
        assert(!err, 'i2cWrite can\'t write access tl command');

        undef = i2c.read(DS1621_ADDR, 2, function (err, tl) {
          assert(!err, 'i2cRead can\'t read 27 from tl');
          assert.strictEqual(tl.length, 2, 'expected i2cRead to read 2 bytes');
          assert.strictEqual(tl.readUInt16LE(0), 27, 'expected i2cRead to read value 27');

          i2c.destroy();

          console.log('ok - ds1621');
        });

        assert.strictEqual(undef, undefined, 'expected i2cRead to return undefined');
      });

      assert.strictEqual(undef, undefined, 'expected i2cWrite to return undefined');
    });
  });

  assert.strictEqual(undef, undefined, 'expected i2cWrite to return undefined');
}

// Test i2cRead and i2cWrite
// Change value of tl to 26 and verify that tl has been changed
function readWriteBlock() {
  var tlbuf = new Buffer(2);
  var undef;

  tlbuf.writeUInt16LE(26, 0);
  undef = i2c.write(DS1621_ADDR, CMD_ACCESS_TL, tlbuf, function (err) {
    assert(!err, 'i2cWrite can\'t write 26 to tl');

    waitForWrite(function () {
      undef = i2c.read(DS1621_ADDR, CMD_ACCESS_TL, 2, function (err, newtl) {
        assert(!err, 'i2cRead can\'t read 26 from tl');
        assert.strictEqual(newtl.length, 2, 'expected i2cRead to read 2 bytes');
        assert.strictEqual(newtl.readUInt16LE(0), 26, 'expected i2cRead to read value 26');

        readWriteBlockNoRegister();
      });

      assert.strictEqual(undef, undefined, 'expected i2cRead to return undefined');
    });
  });

  assert.strictEqual(undef, undefined, 'expected i2cWrite to return undefined');
}


// Test readWord (but not writeWord) without specifying a register
// Change value of tl to 25 and verify that tl has been changed
function readWriteWordNoRegister() {
  var undef;

  // Note that only readWord is called without specifying a register.
  // Is there anything where it makes sense to call writeWord
  // without specifying a register? Write config maybe?

  undef = i2c.writeWord(DS1621_ADDR, CMD_ACCESS_TL, 25, function (err) {
    assert(!err, 'writeWord can\'t write 25 to tl');

    waitForWrite(function () {
      undef = i2c.writeByte(DS1621_ADDR, CMD_ACCESS_TL, function (err) {
        assert(!err, 'writeByte can\'t write access tl command');

        undef = i2c.readWord(DS1621_ADDR, function (err, newtl) {
          assert(!err, 'readWord can\'t read tl');

          assert(typeof newtl === 'number' && newtl >= 0 && newtl <= 0xffff, 'expeted readWord to read a word');
          assert.strictEqual(newtl, 25, 'expected readWord to read value 25');

          readWriteBlock();
        });

        assert.strictEqual(undef, undefined, 'expected readWord to return undefined');
      });

      assert.strictEqual(undef, undefined, 'expected writeByte to return undefined');
    });
  });

  assert.strictEqual(undef, undefined, 'expected writeWord to return undefined');
}

// Test readWord and writeWord
// Change value of tl to 24 and verify that tl has been changed
function readWriteWord() {
  var undef;

  undef = i2c.writeWord(DS1621_ADDR, CMD_ACCESS_TL, 24, function (err) {
    assert(!err, 'writeWord can\'t write 24 to tl');

    waitForWrite(function () {
      undef = i2c.readWord(DS1621_ADDR, CMD_ACCESS_TL, function (err, newtl) {
        assert(!err, 'readWord can\'t read 24 from tl');
        assert(typeof newtl === 'number' && newtl >= 0 && newtl <= 0xffff, 'expeted readWord to read a word');
        assert.strictEqual(newtl, 24, 'expected readWord to read value 24');

        readWriteWordNoRegister();
      });

      assert.strictEqual(undef, undefined, 'expected readWord to return undefined');
    });
  });

  assert.strictEqual(undef, undefined, 'expected writeWord to return undefined');
}

// Test readByte and writeByte without specifying a register
// Verify that one shot mode has been entered
function readWriteByteNoRegister() {
  var undef;

  undef = i2c.writeByte(DS1621_ADDR, CMD_ACCESS_CONFIG, function (err) {
    assert(!err, 'writeByte can\'t write access config command');

    undef = i2c.readByte(DS1621_ADDR, function (err, config) {
      assert(!err, 'readByte can\'t read from config');
      assert(typeof config === 'number' && config >= 0 && config <= 0xff, 'expeted readByte to read a byte');
      assert.strictEqual(config & 0x1, 1, 'one shot mode not eneterd');

      readWriteWord();
    });

    assert.strictEqual(undef, undefined, 'expected readByte to return undefined');
  });

  assert.strictEqual(undef, undefined, 'expected writeByte to return undefined');
}

// Test readByte and writeByte
// Enter one shot mode and verify that one shot mode has been entered
function readWriteByte() {
  var undef;

  undef = i2c.writeByte(DS1621_ADDR, CMD_ACCESS_CONFIG, 0x01, function (err) {
    assert(!err, 'writeByte can\'t write to config');

    waitForWrite(function () {
      undef = i2c.readByte(DS1621_ADDR, CMD_ACCESS_CONFIG, function (err, config) {
        assert(!err, 'readByte can\'t read from config');
        assert(typeof config === 'number' && config >= 0 && config <= 0xff, 'expeted readByte to read a byte');
        assert.strictEqual(config & 0x1, 1, 'one shot mode not eneterd');

        readWriteByteNoRegister();
      });

      assert.strictEqual(undef, undefined, 'expected readByte to return undefined');
    });
  });

  assert.strictEqual(undef, undefined, 'expected writeByte to return undefined');
}

readWriteByte();

