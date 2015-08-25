'use strict';

var i2c = require('../'),
  i2c1 = i2c.openSync(1);

(function () {
  var i2cfuncs = i2c1.i2cFuncsSync(),
    platform = i2cfuncs.smbusQuick ? 'Raspberry Pi?' : 'BeagleBone?';

  i2c1.closeSync();

  console.log('ok - i2c-functionality-available - ' + platform);
}());

