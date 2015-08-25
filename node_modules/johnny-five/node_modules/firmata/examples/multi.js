var Board = require("../lib/firmata").Board;
var SerialPort = require("serialport");
var rport = /usb|acm|^com/i;

SerialPort.list(function(err, ports) {
  ports.forEach(function(port) {
    if (rport.test(port.comName)) {
      console.log("ATTEMPTING: ", port.comName);
      var board = new Board(port.comName, function(error) {
        console.log(error);
      });

      board.on("ready", function() {
        console.log("CONNECTED: ", port.comName);

        var byte = 1;
        var pin = 13;

        this.pinMode(pin, this.MODES.OUTPUT);

        setInterval(function() {
          this.digitalWrite(pin, (byte ^= 1));
        }.bind(this), 500);
      });
    }
  });
});
