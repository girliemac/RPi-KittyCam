var com = require("serialport");
var rport = /usb|acm|^com/i;

com.list(function(err, ports) {
  ports.forEach(function(port) {
    if (rport.test(port.comName)) {
      console.log("ATTEMPTING: ", port.comName);

      var serialPort = new com.SerialPort(port.comName, {
        baudRate: 57600,
        bufferSize: 1
      });

      serialPort.on("open",function() {
        console.log("Port open");
      });

      serialPort.on("data", function(data) {
        console.log(port.comName, Date.now());
      });
    }
  });
});
