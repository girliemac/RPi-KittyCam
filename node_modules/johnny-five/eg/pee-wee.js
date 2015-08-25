var five = require("../lib/johnny-five.js");
var keypress = require("keypress");
var board = new five.Board();


board.on("ready", function() {
  var speed = 200;
  var commands = null;
  var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;
  var motors = {
    right: new five.Motor(configs.M1),
    left: new five.Motor(configs.M2)
  };

  this.repl.inject({
    motors: motors
  });

  function controller(ch, key) {
    if (key) {
      if (key.name === "space") {
        motors.right.stop();
        motors.left.stop();
      }
      if (key.name === "up") {
        motors.right.fwd(speed);
        motors.left.fwd(speed);
      }
      if (key.name === "down") {
        motors.right.rev(speed);
        motors.left.rev(speed);
      }
      if (key.name === "right") {
        motors.right.rev(speed * 0.75);
        motors.left.fwd(speed * 0.75);
      }
      if (key.name === "left") {
        motors.right.fwd(speed * 0.75);
        motors.left.rev(speed * 0.75);
      }

      commands = [].slice.call(arguments);
    } else {
      if (ch >= 1 && ch <= 9) {
        speed = five.Fn.scale(ch, 1, 9, 0, 255);
        controller.apply(null, commands);
      }
    }
  }


  keypress(process.stdin);

  process.stdin.on("keypress", controller);
  process.stdin.setRawMode(true);
  process.stdin.resume();
});

// @markdown
//
// ![Chassis](https://www.servocity.com/assets/images/Runt-Rover-Peewee---300px.jpg)
//
// ![ArduMoto](https://cdn.sparkfun.com//assets/parts/3/8/4/9/09815-01.jpg)
//
// @markdown

