var five = require("../lib/johnny-five.js");
var board = new five.Board({ port: "/dev/cu.usbmodem1411" });

board.on("ready", function() {
  var expander = new five.Expander("PCF8574");
  var pin = 1;

  setInterval(function() {
    if (pin > 0) {
      expander.digitalWrite(pin - 1, 0);
    }
    expander.digitalWrite(pin++, 1);

    if (pin === 7) {
      pin = 0;
    }
  }, 500);


});

