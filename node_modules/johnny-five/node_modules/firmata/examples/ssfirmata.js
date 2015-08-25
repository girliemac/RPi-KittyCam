var firmata = require("../lib/firmata");
var board = new firmata.Board("/dev/tty.usbmodem1411", function(err) {

  console.log(this);

  board.on("string", function(value) {
    console.log(value);
  });

  board.serialConfig();

  board.serialWrite("#10P1000T100\r\n");
});
