var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {
  var tank = new Tank();
  var color = new five.Color({
    controller: "EVS_EV3",
    pin: "BAS1"
  });

  color.on("change", function() {
    if (five.Color.hexCode(this.rgb) !== "000000") {
      console.log("Off the line");

      if (!tank.isLooking) {
        tank.stop();
        tank.findLine(color);
      }
    } else {
      console.log("On the line, Proceed.");
      tank.fwd();
    }
  });
});

function Tank() {
  this.isLooking = false;
  this.motors = new five.Motors([
    { controller: "EVS_EV3", pin: "BAM1" },
    { controller: "EVS_EV3", pin: "BBM1" },
  ]);
}

Tank.DIRECTIONS = ["fwd", "left", "right", "rev"];

Tank.prototype.speed = function(speed) {
  return speed !== undefined ? speed : 100;
};

Tank.prototype.fwd = function(speed) {
  this.motors.rev(this.speed(speed));
};

Tank.prototype.rev = function(speed) {
  this.motors.fwd(this.speed(speed));
};

Tank.prototype.right = function(speed) {
  this.motors[0].fwd(this.speed(speed));
  this.motors[1].rev(this.speed(speed));
};

Tank.prototype.left = function(speed) {
  this.motors[0].rev(this.speed(speed));
  this.motors[1].fwd(this.speed(speed));
};

Tank.prototype.stop = function() {
  this.motors.stop();
};

Tank.prototype.findLine = function(source, attempt) {
  var timer;
  var direction;

  if (attempt === undefined) {
    attempt = 0;
  } else {
    attempt++;
  }

  if (attempt && this.isLooking === false) {
    return;
  }

  if (attempt === 9) {
    this.isLooking = false;
    return;
  }

  direction = Tank.DIRECTIONS[Math.random() * 4 | 0];

  if (attempt === 0 && direction === "fwd") {
    process.nextTick(this.findLine.bind(this, source));
    return;
  }

  this.isLooking = true;
  this[direction]();

  if (source) {
    source.once("change", function() {
      clearTimeout(timer);
      this.isLooking = false;
    }.bind(this));
  }

  timer = setTimeout(function() {
    this.stop();
    this.findLine(source, attempt);
  }.bind(this), 2000);
};
