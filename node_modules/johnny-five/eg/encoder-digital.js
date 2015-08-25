var five = require("../lib/johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var encoder = new five.Encoder({
    pins: [ 12, 11 ],
    positions: 24,
  });


  encoder.on("change", function() {
    console.log(this.position);
  });
});
