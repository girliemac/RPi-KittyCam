var Barcli = require("barcli");
var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {
  var graph = new Barcli({
    label: "Distance",
    range: [55, 500]
  });

  var proximity = new five.Proximity({
    controller: "GP2Y0A710K0F",
    pin: "A0"
  });

  proximity.on("change", function() {
    graph.update(Math.round(this.cm));
  });
});
