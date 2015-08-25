var five = require("../lib/johnny-five.js");
var board = new five.Board({ port: "/dev/cu.usbmodem1411" });

board.on("ready", function() {
  var expander = new five.Expander("PCF8574");

  var virtual = new five.Board.Virtual(expander);

  var led = new five.Led({
    board: virtual,
    pin: 0,
  });

  // led.on();

  var button = new five.Button({
    board: virtual,
    pin: 7,
  });

  button.on("press", function() {
    console.log("button press");
    led.on();
  });

  button.on("release", function() {
    console.log("button release");
    led.off();
  });
});

