var SerialPort = require("serialport").SerialPort;

var sp = new SerialPort("/dev/cu.usbmodem1421", {
  baudRate: 57600,
  bufferSize: 1
});

sp.on("open", function(data) {
  console.log(this === sp);
});
