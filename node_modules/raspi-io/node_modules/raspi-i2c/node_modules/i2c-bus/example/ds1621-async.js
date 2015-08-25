'use strict';

var async = require('async'),
  i2c = require('../'),
  i2c1;

var DS1621_ADDR = 0x48,
  CMD_ACCESS_CONFIG = 0xac,
  CMD_READ_TEMP = 0xaa,
  CMD_START_CONVERT = 0xee;

function toCelsius(rawTemp) {
  var halfDegrees = ((rawTemp & 0xff) << 1) + (rawTemp >> 15);

  if ((halfDegrees & 0x100) === 0) {
    return halfDegrees / 2; // Temp +ve
  }

  return -((~halfDegrees & 0xff) / 2); // Temp -ve
}

(function () {
  async.series([
    function (cb) {
      i2c1 = i2c.open(1, cb);
    },
    function (cb) {
      // Enter one shot mode (this is a non volatile setting)
      i2c1.writeByte(DS1621_ADDR, CMD_ACCESS_CONFIG, 0x01, cb);
    },
    function (cb) {
      // Wait while non volatile memory busy
      (function read() {
        i2c1.readByte(DS1621_ADDR, CMD_ACCESS_CONFIG, function (err, config) {
          if (err) return cb(err);
          if (config & 0x10) return read();
          cb(null);
        });
      }());
    },
    function (cb) {
      // Start temperature conversion
      i2c1.sendByte(DS1621_ADDR, CMD_START_CONVERT, cb);
    },
    function (cb) {
      // Wait for temperature conversion to complete
      (function read() {
        i2c1.readByte(DS1621_ADDR, CMD_ACCESS_CONFIG, function (err, config) {
          if (err) return cb(err);
          if ((config & 0x80) === 0) return read();
          cb(null);
        });
      }());
    },
    function (cb) {
      // Display temperature
      i2c1.readWord(DS1621_ADDR, CMD_READ_TEMP, function (err, rawTemp) {
        if (err) return cb(err);
        console.log('temp: ' + toCelsius(rawTemp));
        cb(null);
      });
    },
    function (cb) {
      i2c1.close(cb);
    }
  ], function (err) {
    if (err) throw err;
  });
}());

