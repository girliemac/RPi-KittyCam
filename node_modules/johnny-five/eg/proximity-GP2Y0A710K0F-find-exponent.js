var Barcli = require("barcli");
var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {
  var g1 = new Barcli({
    label: "Modifier",
    range: [0, 4]
  });

  var g2 = new Barcli({
    label: "CM",
    range: [55, 182]
  });

  var proximity = new five.Proximity({
    controller: "GP2Y0A710K0F",
    pin: "A0"
  });

  var modifier = new five.Sensor("A1").scale(0, 4);

  proximity.on("change", function() {
    g1.update(modifier.value);
    g2.update(3.8631e8 * Math.pow(this.cm, -modifier.value));
  });
});
