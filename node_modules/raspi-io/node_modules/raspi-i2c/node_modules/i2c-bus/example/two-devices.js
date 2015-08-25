'use strict';

var i2c = require('../'),
  i2c1;

var DS1621_ADDR = 0x48,
  DS1621_CMD_ACCESS_TH = 0xa1;

var TSL2561_ADDR = 0x39,
  TSL2561_CMD = 0x80,
  TSL2561_REG_ID = 0x0a;

i2c1 = i2c.open(1, function (err) {
  if (err) throw err;

  (function readTempHigh() {
    i2c1.readWord(DS1621_ADDR, DS1621_CMD_ACCESS_TH, function (err, tempHigh) {
      if (err) throw err;
      console.log(tempHigh);
      readTempHigh();
    });
  }());

  (function readId() {
    i2c1.readByte(TSL2561_ADDR, TSL2561_CMD | TSL2561_REG_ID, function (err, id) {
      if (err) throw err;
      console.log(id);
      readId();
    });
  }());
});

