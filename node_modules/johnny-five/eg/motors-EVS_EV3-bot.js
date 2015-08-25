var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {
  var motors = new five.Motors([
    { controller: "EVS_EV3", pin: "BAM1" },
    { controller: "EVS_EV3", pin: "BBM1" },
  ]);

  function fwd(speed) {
    motors.rev(speed);
  }

  function rev(speed) {
    motors.fwd(speed);
  }

  function right(speed) {
    motors[0].fwd(speed);
    motors[1].rev(speed);
  }

  function left(speed) {
    motors[0].rev(speed);
    motors[1].fwd(speed);
  }

  this.repl.inject(
    [ fwd, rev, left, right ].reduce(function(accum, command) {
      accum[command.name] = function(speed) {
        speed = speed !== undefined ? speed : 40;
        command(speed);
      };
      return accum;
    }, {})
  );
});
