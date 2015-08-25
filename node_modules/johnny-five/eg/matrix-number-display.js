var five = require("../");
var board = new five.Board();



board.on("ready", function() {
  var votes = 5;

  var bumper = new five.Button({
    isPullup: true,
    pin: 8
  });
  var matrix = new five.Led.Matrix({
    pins: {
      data: 2,
      clock: 3,
      cs: 4
    }
  });

  matrix.clear().draw(votes);

  bumper.on("hit", function() {
    votes++;

    matrix.draw(votes);
  });
});
