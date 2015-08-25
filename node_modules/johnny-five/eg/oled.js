var pngtolcd = require("png-to-lcd");
var five = require("../");
var board = new five.Board();
var Oled = require("oled-js");
var font = require("oled-font-5x7");

board.on("ready", function() {

  var opts = {
    width: 128,
    height: 64,
    address: 0x3D
  };

  var oled = new Oled(board, five, opts);
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.writeString(font, 1, "Cats and dogs are really cool animals, you know.", 1, true);

  // oled.drawPixel([
  //   [127, 0, 1],
  //   [127, 31, 1],
  //   [127, 16, 1],
  //   [64, 16, 1]
  // ]);
  // // display a bitmap
  // pngtolcd(__dirname + "/johnny.png", true, function(err, bitmapbuf) {
  //   console.log(bitmapbuf);
  //   oled.buffer = bitmapbuf;
  //   // oled.update();
  // });
});
