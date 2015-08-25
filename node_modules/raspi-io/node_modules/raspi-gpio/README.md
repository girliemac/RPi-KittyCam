Raspi GPIO
==========

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nebrius/raspi-io?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Raspi GPIO is part of the [Raspi.js suite of libraries](https://github.com/bryan-m-hughes/raspi) that provides access to the hardware GPIO pins on a Raspberry Pi.

If you have a bug report, feature request, or wish to contribute code, please be sure to check out the [Contributing Guide](blob/master/CONTRIBUTING.md).

## Installation

First, be sure that you have installed [Raspi.js](https://github.com/bryan-m-hughes/raspi).

Install with NPM:

```Shell
npm install raspi-gpio
```

## Example Usage

```JavaScript
var raspi = require('raspi');
var gpio = require('raspi-gpio');

raspi.init(function() {
  var input = new gpio.DigitalInput({
    pin: 'P1-3',
    pullResistor: gpio.PULL_UP
  });
  var output = new gpio.DigitalOutput('P1-5');
 
  output.write(input.read());
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
    <td>LOW</td>
    <td>A logic low value, one of the two possible return values from digital reads and arguments to digital writes</td>
  </tr>
  <tr>
    <td>HIGH</td>
    <td>A logic high value, one of the two possible return values from digital reads and arguments to digital writes</td>
  </tr>
  <tr>
    <td>PULL_NONE</td>
    <td>Do not use a pull up or pull down resistor with a pin, one of the three possible values for the ```pullResistor``` in the pin configuration object.</td>
  </tr>
  <tr>
    <td>PULL_DOWN</td>
    <td>Use the internal pull down resistor for a pin, one of the three possible values for the ```pullResistor``` in the pin configuration object.</td>
  </tr>
  <tr>
    <td>PULL_UP</td>
    <td>Use the internal pull up resistor for a pin, one of the three possible values for the ```pullResistor``` in the pin configuration object.</td>
  </tr>
</table>

### new DigitalInput(config)

Instantiates a new GPIO input instance.

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
    <td>config</td>
    <td>Number | String | Object</td>
    <td>The configuration for the GPIO pin. If the config is a number or string, it is assumed to be the pin number for the peripheral. If it is an object, the following properties are supported:</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tr>
          <td>pin</td>
          <td>Number | String</td>
          <td>The pin number or descriptor for the peripheral</td>
        </tr>
        <tr>
          <td>pullResistor</td>
          <td>```PULL_NONE``` | ```PULL_DOWN``` | ```PULL_UP```</td>
          <td>Which internal pull resistor to enable, if any. Defaults to ```PULL_NONE```</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

### DigitalInput Instance Methods

#### read()

Reads the current value on the pin.

_Arguments_: None

_Returns_: LOW or HIGH

### new DigitalOutput(config)

Instantiates a new GPIO output instance.

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
    <td>config</td>
    <td>Number | String | Object</td>
    <td>The configuration for the GPIO pin. If the config is a number or string, it is assumed to be the pin number for the peripheral. If it is an object, the following properties are supported:</td>
  </tr>
  <tr>
    <td></td>
    <td colspan="2">
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tr>
          <td>pin</td>
          <td>Number | String</td>
          <td>The pin number for the peripheral</td>
        </tr>
        <tr>
          <td>pullResistor</td>
          <td>```PULL_NONE``` | ```PULL_DOWN``` | ```PULL_UP```</td>
          <td>Which internal pull resistor to enable, if any. Defaults to ```PULL_NONE```</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

### DigitalOutput Instance Methods

#### write(value)

Writes the given value to the pin.

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
    <td>HIGH | LOW</td>
    <td>The value to write to the pin</td>
  </tr>
</table>

_Returns_: None

License
=======

The MIT License (MIT)

Copyright (c) 2014 Bryan Hughes bryan@theoreticalideations.com (https://theoreticalideations.com)

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
