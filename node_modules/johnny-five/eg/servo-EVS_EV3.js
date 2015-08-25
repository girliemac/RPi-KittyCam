var five = require("../lib/johnny-five.js");
var board = new five.Board();

board.on("ready", function() {

  var servo = new five.Servo({
    controller: "EVS_EV3",
    pin: "BBM1",

  });

  servo.on("move:complete", function() {
    console.log("COMPLETE");
    console.log("Position: ", this.value);
  });
  // Add servo to REPL for live control (optional)
  this.repl.inject({
    servo: servo
  });

  servo.to(360, 10000);
});


// 375ms to travel 360 at 100% speed




// 100% = 170rpm = 1020dps

// 75% = 127rpm = 765dps

// 50% = 85rpm = 510dps;

// 25% = 43rpm = 255dps;


// 90° = 2000ms = 45dps

// (90 / 2000) * 1000


// (degrees / time) * 1000 = Rdps

// (Rdps / MAXdps) * 100;




// 100% = 160rpm = 960dps

// 75% = 120rpm = 720dps

// 50% = 80rpm = 480dps;

// 25% = 40rpm = 240dps;

// 90° = 2000ms = 45dps

// (90 / 2000) * 1000


// (degrees / time) * 1000 = Rdps

// (Rdps / MAXdps) * 100;

