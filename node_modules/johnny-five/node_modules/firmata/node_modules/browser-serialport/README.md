# browser-serialport

Robots in the browser. Just like [node-serialport](https://npmjs.org/package/serialport) but for browser apps.


## Why not Node.js?

[Nodebots](http://nodebots.io/) are awesome but HTML5 apps have access to a lot of APIs that make sense for robotics like the [GamepadAPI](http://www.html5rocks.com/en/tutorials/doodles/gamepad/), [WebRTC Video and Data](http://www.webrtc.org/), [Web Speech API](http://www.google.com/intl/en/chrome/demos/speech.html), etc. Also you get a nice GUI and its easier to run. I have also made a fork of [Johnny-Five](https://github.com/garrows/johnny-five) to work with [Browserify](http://browserify.org/) as well by modifying it's dependancy [Firmata](https://github.com/garrows/firmata) to use browser-serialport.

## Restrictions

You will not be able to add this to your normal website.

This library only works in a [Chrome Packaged App](http://developer.chrome.com/apps/about_apps.html) as this is the only way to get access to the [serial ports API](http://developer.chrome.com/apps/serial.html) in the browser.

If you want help making your first Chrome App, read the ["Create Your First App"](http://developer.chrome.com/apps/first_app.html) tutorial.

There is currently no Firefox extension support but that might come soon if possible.


Known incompatibilities with node-serialport
-------------------------------------------
* Parsers not implemented
* Inconsistent error messages
* Chrome has a slightly different options set:
    * __dataBits__: 7, 8
    * __stopBits__: 1, 2
    * __parity__: 'none', 'even', 'mark', 'odd', 'space'
    * __flowControl__: 'RTSCTS'


## Installation

```
npm install browser-serialport
```

To Use
------

Opening a serial port:

```js
var SerialPort = require("browser-serialport").SerialPort
var serialPort = new SerialPort("/dev/tty-usbserial1", {
  baudrate: 57600
});
```

When opening a serial port, you can specify (in this order).

1. Path to Serial Port - required.
1. Options - optional and described below.

The options object allows you to pass named options to the serial port during initialization. The valid attributes for the options object are the following:

* baudrate: Baud Rate, defaults to 9600. Should be one of: 115200, 57600, 38400, 19200, 9600, 4800, 2400, 1800, 1200, 600, 300, 200, 150, 134, 110, 75, or 50. Custom rates as allowed by hardware is supported.
* databits: Data Bits, defaults to 8. Must be one of: 8, 7, ~~6~~, or ~~5~~.
* stopbits: Stop Bits, defaults to 1. Must be one of: 1 or 2.
* parity: Parity, defaults to 'none'. Must be one of: 'none', 'even', 'mark', 'odd', 'space'
* buffersize: Size of read buffer, defaults to 255. Must be an integer value.
* parser: The parser engine to use with read data, defaults to rawPacket strategy which just emits the raw buffer as a "data" event. Can be any function that accepts EventEmitter as first parameter and the raw buffer as the second parameter.

**Note, we have added support for either all lowercase OR camelcase of the options (thanks @jagautier), use whichever style you prefer.**

open event
----------

You MUST wait for the open event to be emitted before reading/writing to the serial port. The open happens asynchronously so installing 'data' listeners and writing
before the open event might result in... nothing at all.

Assuming you are connected to a serial console, you would for example:

```js
serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });
  serialPort.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});
```

You can also call the open function, in this case instanciate the serialport with an additional flag.

```js
var SerialPort = require("browser-serialport").SerialPort
var serialPort = new SerialPort("/dev/tty-usbserial1", {
  baudrate: 57600
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('open');
    serialPort.on('data', function(data) {
      console.log('data received: ' + data);
    });
    serialPort.write("ls\n", function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });
  }
});
```

List Ports
----------

You can also list the ports along with some metadata as well.

```js
var serialPort = require("browser-serialport");
serialPort.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
});
```

Parsers
-------

Browser-serialport doesn't as of 2.0.0 support parsers.


You can get updates of new data from the Serial Port as follows:

```js
serialPort.on("data", function (data) {
  sys.puts("here: "+data);
});
```

You can write to the serial port by sending a string or buffer to the write method as follows:

```js
serialPort.write("OMG IT WORKS\r");
```

Enjoy and do cool things with this code.
