var PID = require("../lib/pid");
var Barcli = require("barcli");
var five = require("../lib/johnny-five.js");
var board = new five.Board();


board.on("ready", function() {
  var r = new Barcli({label: "R", range: [0, 100]});
  var l = new Barcli({label: "L", range: [0, 100]});
  var i = new Barcli({label: "I", range: [0, 100]});


  var tank = new Tank();


  // var speed = new PID({
  //   kp: 1, ki: 0.25, kd: 0.25, range: [5, 65]
  // });
  var reflected = new five.Light({
    controller: "EVS_EV3",
    mode: "reflected",
    pin: "BAS1"
  });

  var Tp = 50;
  var offset = 45;

  var white = 40;
  var black = 20;
  var midpoint = ((white - black) / 2) + black;


  // var kp = 1, ki = 1, kd = 1;
  // var lasterror = 0;
  // var integral = 0;
  // var derivative = 0;


  var kp = 3, ki = 1, kd = 1;
  var lasterror = 0;
  var integral = 0;
  var derivative = 0;

  reflected.on("change", function() {
    console.log(this.level);

    i.update(this.level);


    var value = this.level;
    var error = midpoint - value;

    // var correction = kp * (midpoint - value);
    // var right = Tp + correction;
    // var left = Tp - correction;

    integral = error + integral;
    derivative = error - lasterror;

    var correction = (kp * error + ki * integral + kd * derivative) | 0;

    var right = Tp + correction;
    var left = Tp - correction;

    // console.log(error);

    // console.log("Right: ", speed + correction);
    // console.log("Left: ", speed - correction);
    // var Turn = kp * error;

    // var right = Tp + Turn;
    // var left = Tp - Turn;

    // console.log("Right: ", right);
    // console.log("Left: ", left);
    // console.log("Right: ", right);
    // console.log("Left: ", left);

    tank.fwd(right, left);
    // lasterror = error;


    r.update(right);
    l.update(left);







    // var value = this.level;
    // var error = midpoint - value;

    // integral = error + integral;
    // derivative = error - lasterror;

    // var correction = (kp * error + ki * integral + kd * derivative) | 0;


    // // console.log(error);

    // // console.log("Right: ", speed + correction);
    // // console.log("Left: ", speed - correction);

    // var right = five.Fn.constrain(speed + correction, 30, 60);
    // var left = five.Fn.constrain(speed - correction, 30, 60);

    // console.log("Right: ", speed + correction, right);
    // console.log("Left: ", speed - correction, left);
    // // console.log("Right: ", right);
    // // console.log("Left: ", left);

    // tank.fwd(right, left);
    // lasterror = error;

  //   if (five.Color.hexCode(this.rgb) !== "000000") {
  //     console.log("Off the line");

  //     if (!tank.isLooking) {
  //       tank.stop();
  //       tank.findLine(reflected);
  //     }
  //   } else {
  //     console.log("On the line, Proceed.");
  //     tank.fwd();
  //   }
  });
});

function Tank() {
  this.isLooking = false;
  this.motors = new five.Motors([
    { controller: "EVS_EV3", pin: "BAM1" },
    { controller: "EVS_EV3", pin: "BBM1" },
  ]);
}

// Tank.DIRECTIONS = ["fwd", "left", "right", "rev"];

Tank.prototype.speed = function(speed) {
  return speed !== undefined ? speed : 100;
};

Tank.prototype.fwd = function(right, left) {
  this.motors[0].rev(right);
  this.motors[1].rev(left);
};

// Tank.prototype.rev = function(speed) {
//   this.motors.fwd(this.speed(speed));
// };

// Tank.prototype.right = function(speed) {
//   this.motors[0].fwd(this.speed(speed));
//   this.motors[1].rev(this.speed(speed));
// };

// Tank.prototype.left = function(speed) {
//   this.motors[0].rev(this.speed(speed));
//   this.motors[1].fwd(this.speed(speed));
// };

// Tank.prototype.stop = function() {
//   this.motors.stop();
// };

// Tank.prototype.findLine = function(source, attempt) {
//   var timer;
//   var direction;

//   if (attempt === undefined) {
//     attempt = 0;
//   } else {
//     attempt++;
//   }

//   if (attempt && this.isLooking === false) {
//     return;
//   }

//   if (attempt === 9) {
//     this.isLooking = false;
//     return;
//   }

//   direction = Tank.DIRECTIONS[Math.random() * 4 | 0];

//   if (attempt === 0 && direction === "fwd") {
//     process.nextTick(this.findLine.bind(this, source));
//     return;
//   }

//   this.isLooking = true;
//   this[direction]();

//   if (source) {
//     source.once("change", function() {
//       clearTimeout(timer);
//       this.isLooking = false;
//     }.bind(this));
//   }

//   timer = setTimeout(function() {
//     this.stop();
//     this.findLine(source, attempt);
//   }.bind(this), 2000);
// };
