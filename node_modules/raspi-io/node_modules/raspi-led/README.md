Raspi LED
==========

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nebrius/raspi-io?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Raspi LED is part of the [Raspi.js suite](https://github.com/bryan-m-hughes/raspi) that provides access to the onboard status LED.

If you have a bug report, feature request, or wish to contribute code, please be sure to check out the [Contributing Guide](blob/master/CONTRIBUTING.md).

## Installation

First, be sure that you have installed [raspi](https://github.com/bryan-m-hughes/raspi).

Install with NPM:

```Shell
npm install raspi-led
```

## Example Usage

```JavaScript
var raspi = require('raspi');
var led = require('raspi-led');

raspi.init(function() {
  var statusLed = new led.LED();
  
  // Flash the LED twice a second
  setInterval(function() {
    if (statusLed.read() == led.ON) {
      statusLed.write(led.OFF); // Turn off the status LED
    } else {
      statusLed.write(led.ON); // Turn on the status LED
    }
  }, 500);
});
```

## API

### Module Constants

<table>
  <thead>
    <tr>
      <th>Constant</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>OFF</td>
    <td>Status value indicating the LED is off, one of the two possible return values from reads and arguments to writes</td>
  </tr>
  <tr>
    <td>ON</td>
    <td>Status value indicating the LED is on, one of the two possible return values from reads and arguments to writes</td>
  </tr>
</table>

### new LED()

Instantiates a new status LED instance.

_Arguments_: None

### Instance Methods

#### read()

Reads the current status of the LED.

_Arguments_: None

_Returns_: ON or OFF

#### write(value)

Turns the LED on or off.

_Arguments_:

<table>
  <thead>
    <tr>
      <th>Argument</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>value</td>
    <td>```ON``` | ```OFF```</td>
    <td>The LED status to set</td>
  </tr>
</table>

_Returns_: None

License
=======

The MIT License (MIT)

Copyright (c) 2015 Bryan Hughes bryan@theoreticalideations.com

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
