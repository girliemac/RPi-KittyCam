var Board = require("../lib/firmata").Board;
var board = new Board("/dev/cu.usbmodem1421");

// board.on("ready", function() {
//   this.pinMode(this.MODES.ANALOG);
//   this.analogRead("A0", function(data) {
//     console.log("A0", data);
//   });
// });

var pin = 13;
board.on("ready", function() {
  var byte = 1;

  this.pinMode(pin, this.MODES.OUTPUT);

  setInterval(function() {
    board.digitalWrite(pin, (byte ^= 1));
  }.bind(this), 500);
});
