'use strict';

// When run, this program will output the same information as the
// command 'i2cdetect -F 1'
var i2c = require('../'),
  i2c1;

function boolToYesNo(bool) {
  return bool ? 'yes' : 'no';
}

i2c1 = i2c.open(1, function (err) {
  if (err) {
    throw err;
  }

  i2c1.i2cFuncs(function (err, i2cFuncs) {
    if (err) {
      throw err;
    }

    console.log('Functionalities implemented by /dev/i2c-1:');
    console.log('I2C                              ' + boolToYesNo(i2cFuncs.i2c));
    console.log('SMBus Quick Command              ' + boolToYesNo(i2cFuncs.smbusQuick));
    console.log('SMBus Send Byte                  ' + boolToYesNo(i2cFuncs.smbusSendByte));
    console.log('SMBus Receive Byte               ' + boolToYesNo(i2cFuncs.smbusReceiveByte));
    console.log('SMBus Write Byte                 ' + boolToYesNo(i2cFuncs.smbusWriteByte));
    console.log('SMBus Read Byte                  ' + boolToYesNo(i2cFuncs.smbusReadByte));
    console.log('SMBus Write Word                 ' + boolToYesNo(i2cFuncs.smbusWriteWord));
    console.log('SMBus Read Word                  ' + boolToYesNo(i2cFuncs.smbusReadWord));
    console.log('SMBus Process Call               ' + boolToYesNo(i2cFuncs.smbusProcCall));
    console.log('SMBus Block Write                ' + boolToYesNo(i2cFuncs.smbusWriteBlock));
    console.log('SMBus Block Read                 ' + boolToYesNo(i2cFuncs.smbusReadBlock));
    console.log('SMBus Block Process Call         ' + boolToYesNo(i2cFuncs.smbusBlockProcCall));
    console.log('SMBus PEC                        ' + boolToYesNo(i2cFuncs.smbusPec));
    console.log('I2C Block Write                  ' + boolToYesNo(i2cFuncs.smbusWriteI2cBlock));
    console.log('I2C Block Read                   ' + boolToYesNo(i2cFuncs.smbusReadI2cBlock));
  });
});

