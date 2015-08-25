var Barcli = require("barcli");
var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {

  var sensor = new five.Sensor("A0");
  var graph = new Barcli({
    label: "Sensor",
    range: [0, 100]
  });

  sensor.scale([0, 100]).on("change", function() {
    graph.update(this.value >>> 0);
  });
});
