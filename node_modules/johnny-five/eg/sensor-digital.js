var five = require("../");
var board = new five.Board();

board.on("ready", function() {

  var pin = new five.Sensor({
    pin: 8,
    type: "digital"
  });

  pin.on("data", function() {
    console.log(this.value);
  });
});
