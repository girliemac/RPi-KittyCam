'use strict';

var i2c = require('../');

var DS1621_ADDR = 0x48,
  DS1621_CMD_ACCESS_TH = 0xa1,
  DS1621_CMD_ACCESS_TL = 0xa2;

var TSL2561_ADDR = 0x39,
  TSL2561_CMD = 0x80,
  TSL2561_REG_ID = 0x0a;

function useBusMoreThanMaxFdTimes() {
  var i2c1,
    i;

  // Assuming that less than 2000 files can be opened at the same time,
  // open and close /dev/i2c-1 2000 times to make sure it works and to ensure
  // that file descriptors are being freed.
  for (i = 1; i <= 2000; i += 1) {
    i2c1 = i2c.openSync(1);
    i2c1.readWordSync(DS1621_ADDR, DS1621_CMD_ACCESS_TL);
    i2c1.closeSync();
  }
}

function useMultipleObjectsForSameBusConcurrently() {
  var buses = [],
    i;

  // Make sure many Bus objects can be opened and used for the same I2C bus at
  // the same time.
  for (i = 1; i <= 128; i += 1) {
    buses.push(i2c.openSync(1));
  }
  buses.forEach(function (bus) {
    bus.readWordSync(DS1621_ADDR, DS1621_CMD_ACCESS_TL);
  });
  buses.forEach(function (bus) {
    bus.closeSync();
  });
}

function useTwoObjectsForSameBusConcurrently() {
  var ds1621 = i2c.openSync(1),
    tsl2561 = i2c.openSync(1),
    ds1621TempHigh = ds1621.readWordSync(DS1621_ADDR, DS1621_CMD_ACCESS_TH),
    tsl2561Id = tsl2561.readByteSync(TSL2561_ADDR, TSL2561_CMD | TSL2561_REG_ID);

  console.log("  ds1621TempHigh: " + ds1621TempHigh);
  console.log("  tsl2561Id: " + tsl2561Id);
}

(function () {
  useBusMoreThanMaxFdTimes();
  useMultipleObjectsForSameBusConcurrently();
  useTwoObjectsForSameBusConcurrently();
  console.log('ok - sync-many-instances');
}());

