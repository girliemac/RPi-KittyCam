## i2c-bus

**i2c-bus is io.js and Node.js compatable**

I2C serial computer bus access on Linux boards such as the Raspberry Pi or
BeagleBone Black. All methods have asynchronous and synchronous forms.

## Installation

    $ npm install i2c-bus

See
[Configuring I2C on the Raspberry Pi](https://github.com/fivdi/i2c-bus/blob/master/doc/raspberry-pi-i2c.md)
if you're a Pi user.

## Example Temperature Sensor Circuits

Some of the examples programs use a
[DS1621 temperature sensor](http://www.maximintegrated.com/en/products/analog/sensors-and-sensor-interface/DS1621.html)
to show how the i2c-bus package functions. 

**DS1621 temperature sensor connected to a Raspberry Pi**
<img src="https://github.com/fivdi/i2c-bus/raw/master/example/ds1621-pi.png">

**DS1621 temperature sensor connected to a BeagleBone Black**
<img src="https://github.com/fivdi/i2c-bus/raw/master/example/ds1621-bb.png">

## Example 1 - Determine Temperature Synchronously

Determine the temperature with a DS1621 temperature sensor Synchronously.

```js
var i2c = require('i2c-bus'),
  i2c1 = i2c.openSync(1);

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
  var rawTemp;

  // Enter one shot mode (this is a non volatile setting)
  i2c1.writeByteSync(DS1621_ADDR, CMD_ACCESS_CONFIG, 0x01);

  // Wait while non volatile memory busy
  while (i2c1.readByteSync(DS1621_ADDR, CMD_ACCESS_CONFIG) & 0x10) {
  }

  // Start temperature conversion
  i2c1.sendByteSync(DS1621_ADDR, CMD_START_CONVERT);

  // Wait for temperature conversion to complete
  while ((i2c1.readByteSync(DS1621_ADDR, CMD_ACCESS_CONFIG) & 0x80) === 0) {
  }

  // Display temperature
  rawTemp = i2c1.readWordSync(DS1621_ADDR, CMD_READ_TEMP);
  console.log('temp: ' + toCelsius(rawTemp));

  i2c1.closeSync();
}());
```

## Example 2 - Determine Temperature Asynchronously

Determine the temperature with a DS1621 temperature sensor Asynchronously.
Example 2 does exactly the same thing as example 1, but uses the asynchronous
rather than the synchronous API.

```js
var async = require('async'),
  i2c = require('i2c-bus'),
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
```

## Example 3 - Accessing Multiple Devices Asynchronously and Concurrently

This example demonstrates concurrent asynchronous access to two devices on the
same bus, a DS1621 temperature sensor and an
[Adafruit TSL2561 digital luminosity/lux/light sensor](http://www.adafruit.com/products/439).

```js
var i2c = require('i2c-bus'),
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
```

## API

All methods have asynchronous and synchronous forms.

The asynchronous form always take a completion callback as its last argument.
The arguments passed to the completion callback depend on the method, but the
first argument is always reserved for an exception. If the operation was
completed successfully, then the first argument will be null or undefined.

When using the synchronous form any exceptions are immediately thrown. You can
use try/catch to handle exceptions or allow them to bubble up. 

### Methods

- [open(busNumber, cb)](https://github.com/fivdi/i2c-bus#openbusnumber-cb)
- [openSync(busNumber)](https://github.com/fivdi/i2c-bus#opensyncbusnumber)

### Class Bus

- Free resources
  - [bus.close(cb)](https://github.com/fivdi/i2c-bus#busclosecb)
  - [bus.closeSync()](https://github.com/fivdi/i2c-bus#busclosesync)

- Information
  - [bus.i2cFuncs(cb)](https://github.com/fivdi/i2c-bus#busi2cfuncscb)
  - [bus.i2cFuncsSync()](https://github.com/fivdi/i2c-bus#busi2cfuncssync)

- Plain I2C
  - [bus.i2cRead(addr, length, buffer, cb)](https://github.com/fivdi/i2c-bus#busi2creadaddr-length-buffer-cb)
  - [bus.i2cReadSync(addr, length, buffer)](https://github.com/fivdi/i2c-bus#busi2creadsyncaddr-length-buffer)
  - [bus.i2cWrite(addr, length, buffer, cb)](https://github.com/fivdi/i2c-bus#busi2cwriteaddr-length-buffer-cb)
  - [bus.i2cWriteSync(addr, length, buffer)](https://github.com/fivdi/i2c-bus#busi2cwritesyncaddr-length-buffer)

- SMBus
  - [bus.readByte(addr, cmd, cb)](https://github.com/fivdi/i2c-bus#busreadbyteaddr-cmd-cb)
  - [bus.readByteSync(addr, cmd)](https://github.com/fivdi/i2c-bus#busreadbytesyncaddr-cmd)
  - [bus.readWord(addr, cmd, cb)](https://github.com/fivdi/i2c-bus#busreadwordaddr-cmd-cb)
  - [bus.readWordSync(addr, cmd)](https://github.com/fivdi/i2c-bus#busreadwordsyncaddr-cmd)
  - [bus.readI2cBlock(addr, cmd, length, buffer, cb)](https://github.com/fivdi/i2c-bus#busreadi2cblockaddr-cmd-length-buffer-cb)
  - [bus.readI2cBlockSync(addr, cmd, length, buffer)](https://github.com/fivdi/i2c-bus#busreadi2cblocksyncaddr-cmd-length-buffer)
  - [bus.receiveByte(addr, cb)](https://github.com/fivdi/i2c-bus#busreceivebyteaddr-cb)
  - [bus.receiveByteSync(addr)](https://github.com/fivdi/i2c-bus#busreceivebytesyncaddr)
  - [bus.sendByte(addr, byte, cb)](https://github.com/fivdi/i2c-bus#bussendbyteaddr-byte-cb)
  - [bus.sendByteSync(addr, byte)](https://github.com/fivdi/i2c-bus#bussendbytesyncaddr-byte)
  - [bus.writeByte(addr, cmd, byte, cb)](https://github.com/fivdi/i2c-bus#buswritebyteaddr-cmd-byte-cb)
  - [bus.writeByteSync(addr, cmd, byte)](https://github.com/fivdi/i2c-bus#buswritebytesyncaddr-cmd-byte)
  - [bus.writeWord(addr, cmd, word, cb)](https://github.com/fivdi/i2c-bus#buswritewordaddr-cmd-word-cb)
  - [bus.writeWordSync(addr, cmd, word)](https://github.com/fivdi/i2c-bus#buswritewordsyncaddr-cmd-word)
  - [bus.writeQuick(addr, bit, cb)](https://github.com/fivdi/i2c-bus#buswritequickaddr-bit-cb)
  - [bus.writeQuickSync(addr, bit)](https://github.com/fivdi/i2c-bus#buswritequicksyncaddr-bit)
  - [bus.writeI2cBlock(addr, cmd, length, buffer, cb)](https://github.com/fivdi/i2c-bus#buswritei2cblockaddr-cmd-length-buffer-cb)
  - [bus.writeI2cBlockSync(addr, cmd, length, buffer)](https://github.com/fivdi/i2c-bus#buswritei2cblocksyncaddr-cmd-length-buffer)

### Class I2cFuncs

- [funcs.i2c](https://github.com/fivdi/i2c-bus#funcsi2c---boolean)
- [funcs.tenBitAddr](https://github.com/fivdi/i2c-bus#funcstenbitaddr---boolean)
- [funcs.protocolMangling](https://github.com/fivdi/i2c-bus#funcsprotocolmangling---boolean)
- [funcs.smbusPec](https://github.com/fivdi/i2c-bus#funcssmbuspec---boolean)
- [funcs.smbusBlockProcCall](https://github.com/fivdi/i2c-bus#funcssmbusblockproccall---boolean)
- [funcs.smbusQuick](https://github.com/fivdi/i2c-bus#funcssmbusquick---boolean)
- [funcs.smbusReceiveByte](https://github.com/fivdi/i2c-bus#funcssmbusreceivebyte---boolean)
- [funcs.smbusSendByte](https://github.com/fivdi/i2c-bus#funcssmbussendbyte---boolean)
- [funcs.smbusReadByte](https://github.com/fivdi/i2c-bus#funcssmbusreadbyte---boolean)
- [funcs.smbusWriteByte](https://github.com/fivdi/i2c-bus#funcssmbuswritebyte---boolean)
- [funcs.smbusReadWord](https://github.com/fivdi/i2c-bus#funcssmbusreadword---boolean)
- [funcs.smbusWriteWord](https://github.com/fivdi/i2c-bus#funcssmbuswriteword---boolean)
- [funcs.smbusProcCall](https://github.com/fivdi/i2c-bus#funcssmbusproccall---boolean)
- [funcs.smbusReadBlock](https://github.com/fivdi/i2c-bus#funcssmbusreadblock---boolean)
- [funcs.smbusWriteBlock](https://github.com/fivdi/i2c-bus#funcssmbuswriteblock---boolean)
- [funcs.smbusReadI2cBlock](https://github.com/fivdi/i2c-bus#funcssmbusreadi2cblock---boolean)
- [funcs.smbusWriteI2cBlock](https://github.com/fivdi/i2c-bus#funcssmbuswritei2cblock---boolean)

### open(busNumber, cb)
- busNumber - the number of the I2C bus/adapter to open, 0 for /dev/i2c-0, 1 for /dev/i2c-1, ...
- cb - completion callback

Asynchronous open. Returns a new Bus object. The callback gets one argument (err).

### openSync(busNumber)
- busNumber - the number of the I2C bus/adapter to open, 0 for /dev/i2c-0, 1 for /dev/i2c-1, ...

Synchronous open. Returns a new Bus object.

### bus.close(cb)
- cb - completion callback

Asynchronous close. The callback gets one argument (err).

### bus.closeSync()

Synchronous close.

### bus.i2cFuncs(cb)
- cb - completion callback

Determine functionality of the bus/adapter asynchronously. The callback gets
two argument (err, funcs). funcs is a frozen
[I2cFuncs](https://github.com/fivdi/i2c-bus#class-i2cfuncs)
object describing the functionality available.
See also [I2C functionality](https://www.kernel.org/doc/Documentation/i2c/functionality).

### bus.i2cFuncsSync()

Determine functionality of the bus/adapter Synchronously. Returns a frozen
[I2cFuncs](https://github.com/fivdi/i2c-bus#class-i2cfuncs)
object describing the functionality available.
See also [I2C functionality](https://www.kernel.org/doc/Documentation/i2c/functionality).

### bus.i2cRead(addr, length, buffer, cb)
- addr - I2C device address
- length - an integer specifying the number of bytes to read
- buffer - the buffer that the data will be written to (must conatin at least length bytes)
- cb - completion callback

Asynchronous plain I2C read. The callback gets three argument (err, bytesRead, buffer).
bytesRead is the number of bytes read.

### bus.i2cReadSync(addr, length, buffer)
- addr - I2C device address
- length - an integer specifying the number of bytes to read
- buffer - the buffer that the data will be written to (must conatin at least length bytes)

Synchronous plain I2C read. Returns the number of bytes read.

### bus.i2cWrite(addr, length, buffer, cb)
- addr - I2C device address
- length - an integer specifying the number of bytes to write
- buffer - the buffer containing the data to write (must conatin at least length bytes)
- cb - completion callback

Asynchronous plain I2C write. The callback gets three argument (err, bytesWritten, buffer).
bytesWritten is the number of bytes written.

### bus.i2cWriteSync(addr, length, buffer)
- addr - I2C device address
- length - an integer specifying the number of bytes to write
- buffer - the buffer containing the data to write (must conatin at least length bytes)

Synchronous plain I2C write. Returns the number of bytes written.

### bus.readByte(addr, cmd, cb)
- addr - I2C device address
- cmd - command code
- cb - completion callback

Asynchronous SMBus read byte. The callback gets two arguments (err, byte).

### bus.readByteSync(addr, cmd)
- addr - I2C device address
- cmd - command code

Synchronous SMBus read byte. Returns the byte read.

### bus.readWord(addr, cmd, cb)
- addr - I2C device address
- cmd - command code
- cb - completion callback

Asynchronous SMBus read word. The callback gets two arguments (err, word).

### bus.readWordSync(addr, cmd)
- addr - I2C device address
- cmd - command code

Synchronous SMBus read word. Returns the word read.

### bus.readI2cBlock(addr, cmd, length, buffer, cb)
- addr - I2C device address
- cmd - command code
- length - an integer specifying the number of bytes to read (max 32)
- buffer - the buffer that the data will be written to (must conatin at least length bytes)
- cb - completion callback

Asynchronous I2C block read (not defined by the SMBus specification). Reads a
block of bytes from a device, from a designated register that is specified by
cmd. The callback gets three arguments (err, bytesRead, buffer). bytesRead is
the number of bytes read.

### bus.readI2cBlockSync(addr, cmd, length, buffer)
- addr - I2C device address
- cmd - command code
- length - an integer specifying the number of bytes to read (max 32)
- buffer - the buffer that the data will be written to (must conatin at least length bytes)

Synchronous I2C block read (not defined by the SMBus specification). Reads a
block of bytes from a device, from a designated register that is specified by
cmd. Returns the number of bytes read.

### bus.receiveByte(addr, cb)
- addr - I2C device address
- cb - completion callback

Asynchronous SMBus receive byte. The callback gets two arguments (err, byte).

### bus.receiveByteSync(addr)
- addr - I2C device address

Synchronous SMBus receive byte. Returns the byte received.

### bus.sendByte(addr, byte, cb)
- addr - I2C device address
- byte - data byte
- cb - completion callback

Asynchronous SMBus send byte. The callback gets one argument (err).

### bus.sendByteSync(addr, byte)
- addr - I2C device address
- byte - data byte

Synchronous SMBus send byte.

### bus.writeByte(addr, cmd, byte, cb)
- addr - I2C device address
- cmd - command code
- byte - data byte
- cb - completion callback

Asynchronous SMBus write byte. The callback gets one argument (err).

### bus.writeByteSync(addr, cmd, byte)
- addr - I2C device address
- cmd - command code
- byte - data byte

Synchronous SMBus write byte.

### bus.writeWord(addr, cmd, word, cb)
- addr - I2C device address
- cmd - command code
- word - data word
- cb - completion callback

Asynchronous SMBus write word. The callback gets one argument (err).

### bus.writeWordSync(addr, cmd, word)
- addr - I2C device address
- cmd - command code
- word - data word

Synchronous SMBus write word.

### bus.writeQuick(addr, bit, cb)
- addr - I2C device address
- bit - bit to write (0 or 1)
- cb - completion callback

Asynchronous SMBus quick command. Writes a single bit to the device.
The callback gets one argument (err).

### bus.writeQuickSync(addr, bit)
- addr - I2C device address
- bit - bit to write (0 or 1)

Synchronous SMBus quick command. Writes a single bit to the device.

### bus.writeI2cBlock(addr, cmd, length, buffer, cb)
- addr - I2C device address
- cmd - command code
- length - an integer specifying the number of bytes to write (max 32)
- buffer - the buffer containing the data to write (must conatin at least length bytes)
- cb - completion callback

Asynchronous I2C block write (not defined by the SMBus specification). Writes a
block of bytes to a device, to a designated register that is specified by cmd.
The callback gets three argument (err, bytesWritten, buffer). bytesWritten is
the number of bytes written.

### bus.writeI2cBlockSync(addr, cmd, length, buffer)
- addr - I2C device address
- cmd - command code
- length - an integer specifying the number of bytes to write (max 32)
- buffer - the buffer containing the data to write (must conatin at least length bytes)

Synchronous I2C block write (not defined by the SMBus specification). Writes a
block of bytes to a device, to a designated register that is specified by cmd.

### funcs.i2c - boolean
Specifies whether or not the adapter handles plain I2C-level commands (Pure
SMBus adapters typically can not do these,
I2C_FUNC_I2C).

### funcs.tenBitAddr - boolean
Specifies whether or not the adapter handles the 10-bit address extensions
(I2C_FUNC_10BIT_ADDR).

### funcs.protocolMangling - boolean
Specifies whether or not the adapter knows about the I2C_M_IGNORE_NAK,
I2C_M_REV_DIR_ADDR and I2C_M_NO_RD_ACK flags (which modify the I2C protocol!
I2C_FUNC_PROTOCOL_MANGLING).

### funcs.smbusPec - boolean
Specifies whether or not the adapter handles packet error checking
(I2C_FUNC_SMBUS_PEC).

### funcs.smbusBlockProcCall - boolean
Specifies whether or not the adapter handles the SMBus block process call
command
(I2C_FUNC_SMBUS_BLOCK_PROC_CALL).

### funcs.smbusQuick - boolean
Specifies whether or not the adapter handles the SMBus quick command
(I2C_FUNC_SMBUS_QUICK).

### funcs.smbusReceiveByte - boolean
Specifies whether or not the adapter handles the SMBus receive byte command
(I2C_FUNC_SMBUS_READ_BYTE).

### funcs.smbusSendByte - boolean
Specifies whether or not the adapter handles the SMBus send byte command
(I2C_FUNC_SMBUS_WRITE_BYTE).

### funcs.smbusReadByte - boolean
Specifies whether or not the adapter handles the SMBus read byte command
(I2C_FUNC_SMBUS_READ_BYTE_DATA).

### funcs.smbusWriteByte - boolean
Specifies whether or not the adapter handles the SMBus write byte command
(I2C_FUNC_SMBUS_WRITE_BYTE_DATA).

### funcs.smbusReadWord - boolean
Specifies whether or not the adapter handles the SMBus read word command
(I2C_FUNC_SMBUS_READ_WORD_DATA).

### funcs.smbusWriteWord - boolean
Specifies whether or not the adapter handles the SMBus write word command
(I2C_FUNC_SMBUS_WRITE_WORD_DATA).

### funcs.smbusProcCall - boolean
Specifies whether or not the adapter handles the SMBus process call command
(I2C_FUNC_SMBUS_PROC_CALL).

### funcs.smbusReadBlock - boolean
Specifies whether or not the adapter handles the SMBus read block command
(I2C_FUNC_SMBUS_READ_BLOCK_DATA).

### funcs.smbusWriteBlock - boolean
Specifies whether or not the adapter handles the SMBus write block command
(I2C_FUNC_SMBUS_WRITE_BLOCK_DATA).

### funcs.smbusReadI2cBlock - boolean
Specifies whether or not the adapter handles the SMBus read I2C block command
(I2C_FUNC_SMBUS_READ_I2C_BLOCK).

### funcs.smbusWriteI2cBlock - boolean
Specifies whether or not the adapter handles the SMBus write i2c block command
(I2C_FUNC_SMBUS_WRITE_I2C_BLOCK).

