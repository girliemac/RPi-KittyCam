var five = require("../");
var board = new five.Board();

board.on("ready", function() {

  var proximity = new five.Proximity({
    controller: "SRF10"
  });

  proximity.on("data", function() {
    console.log(this.cm + "cm");
  });

});
