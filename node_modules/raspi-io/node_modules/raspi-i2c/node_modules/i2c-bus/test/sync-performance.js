'use strict';

var i2c = require('../'),
  i2c1 = i2c.openSync(1);

var DS1621_ADDR = 0x48,
  CMD_ACCESS_TL = 0xa2;

(function () {
  var time, reads, readsPerSec;

  time = process.hrtime();

  for (reads = 1; reads <= 5000; reads += 1) {
    i2c1.readWordSync(DS1621_ADDR, CMD_ACCESS_TL);
  }

  time = process.hrtime(time);
  readsPerSec = Math.floor(reads / (time[0] + time[1] / 1E9));

  i2c1.closeSync();

  console.log('ok - sync-performance - ' + readsPerSec + ' reads per second');
}());

