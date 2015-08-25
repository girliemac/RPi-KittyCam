'use strict';

var assert = require('assert'),
  i2c = require('../'),
  i2c1;

var DS1621_ADDR = 0x48,
  CMD_ACCESS_TL = 0xa2;

function leakTest(testRuns) {
  var tlbuf = new Buffer(1000000);

  i2c1.readI2cBlock(DS1621_ADDR, CMD_ACCESS_TL, 2, tlbuf, function (err, bytesRead, buffer) {
    assert(!err, 'can\'t read block data from tl');
    assert.strictEqual(bytesRead, 2, 'expected readI2cBlock to read 2 bytes');

    if (testRuns % 1000 === 0) {
      console.log(testRuns);
    }

    testRuns -= 1;
    if (testRuns === 0) {
      i2c1.closeSync();
    } else {
      leakTest(testRuns);
    }
  });
}

i2c1 = i2c.open(1, function (err) {
  assert(!err, 'can\'t open i2c bus');
  leakTest(1000000);
});

