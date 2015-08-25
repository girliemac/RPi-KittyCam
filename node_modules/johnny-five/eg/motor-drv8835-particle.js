var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {
  var motor = new five.Motor({
    pins: { pwm: 5, dir: 4 }
  });

  this.repl.inject({
    motor: motor
  });

  // Speed is an 8bit value: 0-255
  motor.speed(255);
});
