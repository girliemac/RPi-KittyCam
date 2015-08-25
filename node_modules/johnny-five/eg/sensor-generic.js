var five = require("../lib/johnny-five.js");
var board = new five.Board({
  port: "/dev/cu.usbmodem1411"
});

board.on("ready", function() {

  var sensor = new five.Sensor({
    pin: "A0",
    freq: 2000
  });

    var B = 3975;
    var R = (1023 - 498) * 10000 / 498;
    var T = 1 / (Math.log(R / 10000) / B + 1 / 298.15) - 273.15;
    console.log(T);

  // sensor.on("data", function() {

  //   var B = 3975;
  //   var R = (1023 - this.raw) * 10000 / this.raw;
  //   var T = 1 / (Math.log(R / 10000) / B + 1 / 298.15) - 273.15;
  //   console.log(T);
  //   // console.log(this.value, this.raw);
  // });
});


