Raspi-io
========

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nebrius/raspi-io?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Raspi-io is a Firmata API compatible library for Raspbian running on the [Raspberry Pi](http://www.raspberrypi.org/) that
can be used as an I/O plugin with [Johnny-Five](https://github.com/rwaldron/johnny-five). The API docs for this module can be
found on the [Johnny-Five Wiki](https://github.com/rwaldron/johnny-five/wiki/IO-Plugins). Raspi IO supports the Model B Rev 1, Model B Rev 2, Model A+, Model B+, and Raspberry Pi 2 Model B, but does _not_ support the Model A.

If you have a bug report, feature request, or wish to contribute code, please be sure to check out the [Contributing Guide](blob/master/CONTRIBUTING.md).

## Installation

```
npm install raspi-io
```

## Usage

Using raspi-io inside of Johnny-Five is pretty straightforward, although does take an extra step compared to the Arduino Uno:

```JavaScript
var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {

  // Create an Led on pin 7 (GPIO4) on P1 and strobe it on/off
  // Optionally set the speed; defaults to 100ms
  (new five.Led('P1-7')).strobe();

});
```

The ```io``` property must be specified explicitly to differentiate from trying to control, say, an Arduino Uno that is plugged into the Raspberry Pi. Note that we specify the pin as ```"P1-7"```, not just ```7```. See the [section on pins](#pin-naming) below for an explanation of the pin numbering scheme on the Raspberry Pi.

Note: This module is not intended to be used directly. If you do not want to use Johnny-Five, I recommend taking a look at [Raspi.js](https://github.com/bryan-m-hughes/raspi), which underpins this library and is a little more straight-forward to use than using raspi-io directly.

## Pin Naming

The pins on the Raspberry Pi are a little complicated. There are multiple headers on some Raspberry Pis with extra pins, and the pin numbers are not consistent between Raspberry Pi board versions.

To help make it easier, you can specify pins in three ways. The first is to specify the pin by function, e.g. ```'GPIO18'```. The second way is to specify by pin number, which is specified in the form "P[header]-[pin]", e.g. ```'P1-7'```. The final way is specify the [Wiring Pi virtual pin number](http://wiringpi.com/pins/), e.g. ```7```. If you specify a number instead of a string, it is assumed to be a Wiring Pi number.

Be sure to read the [full list of pins](https://github.com/bryan-m-hughes/raspi-io/wiki) on the supported models of the Raspberry Pi.

## I2C notes

There are a few limitations and extra steps to be aware of when using I2C on the Raspberry Pi.

First and foremost, be aware that once you use an I2C pin for GPIO, you _cannot_ use it for I2C again until you _reboot_ your Raspberry Pi! If you run the following code, you will get an exception stating "I2C pins not in I2C mode."

```
var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {
  new five.Pin('SDA');
  board.io.i2cWrite(0x18, 0x5, 'hello');
});
```

Also note that you will need to edit ```/boot/config.txt``` in order to change the I2C baud rate from the default, if you need to. If you notice that behavior is unstable while trying to communicate with another microcontroller, try setting the baudrate to 10000 from the default 100000. This instability has been observed on the Arduino Nano before.

Finally, if you try to access a device that doesn't exist, you will get an error stating ```EIO, i/o error``` (sorry it's not very descriptive).

License
=======

The MIT License (MIT)

Copyright (c) 2014 Bryan Hughes bryan@theoreticalideations.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
