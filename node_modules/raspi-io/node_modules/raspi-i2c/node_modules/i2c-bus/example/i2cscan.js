'use strict';

// When run, this program will output the same information as the
// command 'i2cdetect -y -r 1'
var fs = require('fs'),
  i2c = require('../'),
  i2c1 = i2c.openSync(1);

function scan(first, last) {
  var addr;

  fs.writeSync(0, '     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f');

  for (addr = 0; addr <= 127; addr += 1) {
    if (addr % 16 === 0) {
      fs.writeSync(0, '\n' + (addr === 0 ? '0' : ''));
      fs.writeSync(0, addr.toString(16) + ':');
    }

    if (addr < first || addr > last) {
      fs.writeSync(0, '   ');
    } else {
      try {
        i2c1.receiveByteSync(addr);
        fs.writeSync(0, ' ' + addr.toString(16)); // device found, print addr
      } catch (e) {
        if (e.message === 'Remote I/O error' || e.message === 'Input/output error') {
          fs.writeSync(0, ' --');
        } else if (e.message === 'Device or resource busy') {
          fs.writeSync(0, ' UU');
        } else {
          throw e; // Oops, don't know what to do!
        }
      }
    }
  }

  fs.writeSync(0, '\n');
}

scan(0x3, 0x77);

