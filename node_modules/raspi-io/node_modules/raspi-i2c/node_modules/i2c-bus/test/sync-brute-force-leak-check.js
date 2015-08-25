'use strict';

var assert = require('assert'),
  i2c = require('../'),
  i2c1 = i2c.openSync(1);

var DS1621_ADDR = 0x48,
  CMD_ACCESS_TL = 0xa2;

(function () {
  var tlbuf,
    bytesRead,
    i;

  for (i = 1; i <= 1000000; i += 1) {
    tlbuf = new Buffer(1000000);
    bytesRead = i2c1.readI2cBlockSync(DS1621_ADDR, CMD_ACCESS_TL, 2, tlbuf);
    assert.strictEqual(bytesRead, 2, 'expected readI2cBlockSync to read 2 bytes');
    if (i % 1000 === 0) {
      console.log(i);
    }
  }

  i2c1.closeSync();
}());

