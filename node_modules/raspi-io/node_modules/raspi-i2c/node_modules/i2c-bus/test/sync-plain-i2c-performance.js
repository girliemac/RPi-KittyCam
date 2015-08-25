'use strict';

var i2c = require('../'),
  i2c1 = i2c.openSync(1);

var DS1621_ADDR = 0x48,
  CMD_ACCESS_TL = 0xa2;

(function () {
  var cmdGetTL = new Buffer([CMD_ACCESS_TL]),
    tl = new Buffer(2),
    operations,
    opsPerSec,
    time;

  time = process.hrtime();

  // one operation is an i2cWriteSync and an i2cReadSync, i.e., two calls
  for (operations = 1; operations <= 5000; operations += 1) {
    i2c1.i2cWriteSync(DS1621_ADDR, cmdGetTL.length, cmdGetTL);
    i2c1.i2cReadSync(DS1621_ADDR, 2, tl);
  }

  time = process.hrtime(time);
  opsPerSec = Math.floor(operations / (time[0] + time[1] / 1E9));

  i2c1.closeSync();

  console.log('ok - sync-plain-i2c-performance - ' + opsPerSec + ' (x 2) operations per second');
}());

