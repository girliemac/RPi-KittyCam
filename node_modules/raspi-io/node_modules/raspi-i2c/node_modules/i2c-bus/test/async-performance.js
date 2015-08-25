'use strict';

var i2c = require('../'),
  i2c1,
  iterations = 5000,
  time,
  readsPerSec;

var DS1621_ADDR = 0x48,
  CMD_ACCESS_TL = 0xa2;

function performanceTest(testRuns) {
  i2c1.readWord(DS1621_ADDR, CMD_ACCESS_TL, function () {
    testRuns -= 1;
    if (testRuns === 0) {
      time = process.hrtime(time);
      readsPerSec = Math.floor(iterations / (time[0] + time[1] / 1E9));
      i2c1.closeSync();
      console.log('ok - async-performance - ' + readsPerSec + ' reads per second');
    } else {
      performanceTest(testRuns);
    }
  });
}

i2c1 = i2c.open(1, function () {
  time = process.hrtime();
  performanceTest(iterations);
});

