var five = require("johnny-five");
var Edison = require("galileo-io");
var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
  console.log("ready");
  var led = new five.Led(11);
  led.blink();

  this.repl.inject({
    led: led
  });
});
