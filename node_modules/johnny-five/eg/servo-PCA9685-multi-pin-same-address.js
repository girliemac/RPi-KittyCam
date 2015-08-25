var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {
  var a = new five.Servo({
    address: 0x40,
    controller: "PCA9685",
    pin: 0,
  });

  var b = new five.Servo({
    address: 0x40,
    controller: "PCA9685",
    pin: 1,
  });

  var c = new five.Servo({
    address: 0x40,
    controller: "PCA9685",
    pin: 2,
  });

  var d = new five.Servo({
    address: 0x40,
    controller: "PCA9685",
    pin: 3,
  });

});
