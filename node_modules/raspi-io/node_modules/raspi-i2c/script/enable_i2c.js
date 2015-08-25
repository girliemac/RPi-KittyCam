#!/usr/bin/env node
/*
The MIT License (MIT)

Copyright (c) 2015 Bryan Hughes <bryan@theoreticalideations.com>

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
*/

var fs = require('fs');
var iniBuilder = require('ini-builder');

console.log('Checking if I2C is enabled at boot time');
var config = iniBuilder.parse(fs.readFileSync('/boot/config.txt').toString(), { commentDelimiter: '#' });
var changes = false;

var i2c_arm = iniBuilder.find(config, ['dtparam', 'i2c_arm']);
if (!i2c_arm) {
  config.push({
    path: ['dtparam', 'i2c_arm'],
    value: 'on'
  });
  changes = true;
} else if (i2c_arm.value != 'on') {
  i2c_arm.value = 'on';
  changes = true;
}

var i2c = iniBuilder.find(config, ['dtparam', 'i2c']);
if (!i2c) {
  config.push({
    path: ['dtparam', 'i2c'],
    value: 'on'
  });
  changes = true;
} else if (i2c.value != 'on') {
  i2c.value = 'on';
  changes = true;
}

var i2c_arm_baudrate = iniBuilder.find(config, ['dtparam', 'i2c_arm_baudrate']);
if (!i2c_arm_baudrate) {
  config.push({
    path: ['dtparam', 'i2c_arm_baudrate'],
    value: '100000'
  });
  changes = true;
}

if (changes) {
  console.log('Enabled I2C at boot time');
  fs.writeFileSync('/boot/config.txt', iniBuilder.serialize(config));
  console.warn('YOU MUST REBOOT YOUR PI BEFORE USING I2C!');
} else {
  console.log('I2C is already enabled at boot time');
}
