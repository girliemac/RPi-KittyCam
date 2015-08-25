var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {
  var led = new five.Led("A3");

  led.blink();
});
