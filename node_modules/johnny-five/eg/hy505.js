var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var led = new five.Led(8);
  var temp = new five.Temperature({
    controller: "GROVE",
    pin: "A2"
  });
  var sensor = new five.Sensor("A0");

  sensor.on("change", function() {
    if (this.value < 25) {
      led.on();
      console.log("Slot interrupted @ %d", Date.now());
      console.log("Temperature: %d°C", Math.round(temp.celsius));
    } else {
      led.off();
    }
  });
});
