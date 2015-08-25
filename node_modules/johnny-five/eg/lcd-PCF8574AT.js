var five = require("../");
var board = new five.Board();

board.on("ready", function() {

  var l = new five.LCD({
    controller: "PCF8574AT"
  });

  l.useChar("heart");
  l.cursor(0, 0).print("hello :heart:");
  l.blink();
  l.cursor(1, 0).print("Blinking? ");
});

