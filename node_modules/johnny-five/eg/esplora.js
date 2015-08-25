var five = require("../lib/johnny-five.js");
var board = new five.Board();

// Select: Tools > Board > Arduino Leonardo
// (Ignore the "Arduino Esplora" option)
board.on("ready", function() {

  var estick = new five.Joystick({
    controller: "ESPLORA"
  });


  estick.on("change", function() {
    console.log("x", this.x);
  });
});

// --------------------------------------

// var Emitter = require("events").EventEmitter;
// var util = require("util");
// var priv = new Map();
// var axes = ["x", "y"];

// function Multiplexer(options) {
//   this.pins = options.pins;
//   this.io = options.io;

//   this.io.pinMode(this.pins[0], this.io.MODES.OUTPUT);
//   this.io.pinMode(this.pins[1], this.io.MODES.OUTPUT);
//   this.io.pinMode(this.pins[2], this.io.MODES.OUTPUT);
//   this.io.pinMode(this.pins[3], this.io.MODES.OUTPUT);
// }

// Multiplexer.prototype.select = function(channel) {
//   this.io.digitalWrite(this.pins[0], channel & 1 ? this.io.HIGH : this.io.LOW);
//   this.io.digitalWrite(this.pins[1], channel & 2 ? this.io.HIGH : this.io.LOW);
//   this.io.digitalWrite(this.pins[2], channel & 4 ? this.io.HIGH : this.io.LOW);
//   this.io.digitalWrite(this.pins[3], channel & 8 ? this.io.HIGH : this.io.LOW);
// };

// var Controllers = {
//   ESPLORA: {
//     initialize: {
//       value: function(opts, dataHandler) {
//         var multiplexer = new Multiplexer({
//           pins: [ 14, 15, 16, 17 ],
//           io: this.io
//         });
//         var channels = [ 11, 12 ];
//         var channel = 1;
//         var dataPoints = {
//           x: 0,
//           y: 0
//         };

//         this.io.analogRead(18, function(value) {
//           dataPoints[axes[channel]] = value;

//           if (channel === 1) {
//             dataHandler(dataPoints)
//           }
//         });

//         setInterval(function() {
//           multiplexer.select(channel ^= 1);
//         }, 20);
//       }
//     },
//     toAxis: function(raw) {
//       var state = priv.get(this);
//       return raw - 512;
//     }
//   }
// }

// function Joystick(opts) {
//   if (!(this instanceof Joystick)) {
//     return new Joystick(opts);
//   }

//   var controller = null;

//   var state = {
//     x: {
//       value: 0,
//       previous: 0,
//     },
//     y: {
//       value: 0,
//       previous: 0,
//     },
//   };

//   Board.Component.call(
//     this, opts = Board.Options(opts)
//   );

//   if (opts.controller && typeof opts.controller === "string") {
//     controller = Controllers[opts.controller.toUpperCase()];
//   } else {
//     controller = opts.controller;
//   }

//   if (controller == null) {
//     controller = Controllers["ANALOG"];
//   }

//   Object.defineProperties(this, controller);

//   if (!this.toAxis) {
//     this.toAxis = opts.toAxis || function(raw) { return raw; };
//   }

//   priv.set(this, state);

//   if (typeof this.initialize === "function") {
//     this.initialize(opts, function(data) {
//       var isChange = false;

//       Object.keys(data).forEach(function(axis) {
//         var value = data[axis];
//         var sensor = state[axis];

//         sensor.value = value;

//         if (this.x !== sensor.x) {
//           sensor.x = this.x;
//           isChange = true;
//         }

//         if (this.y !== sensor.y) {
//           sensor.y = this.y;
//           isChange = true;
//         }
//       }, this);

//       this.emit("data", {
//         x: state.x.value,
//         y: state.y.value
//       });

//       if (isChange) {
//         this.emit("change", {
//           x: this.x,
//           y: this.y,
//           z: this.z
//         });
//       }
//     }.bind(this));
//   }

//   Object.defineProperties(this, {
//     hasAxis: {
//       value: function(axis) {
//         return state[axis] ? state[axis].stash.length > 0 : false;
//       }
//     },
//     x: {
//       get: function() {
//         return this.toAxis(state.x.value);
//       }
//     },
//     y: {
//       get: function() {
//         return this.toAxis(state.y.value);
//       }
//     }
//   });
// }

// util.inherits(Joystick, Emitter);




// const HIGH = 1;
// const LOW = 0;
// const INPUT_PULLUP = 2;

// const MUX_ADDR_PINS = [ 14, 15, 16, 17 ];
// const MUX_COM_PIN = 18;


// const CH_SWITCH_1    = 0;
// const CH_SWITCH_2    = 1;
// const CH_SWITCH_3    = 2;
// const CH_SWITCH_4    = 3;
// const CH_SLIDER      = 4;
// const CH_LIGHT       = 5;
// const CH_TEMPERATURE = 6;
// const CH_MIC         = 7;
// const CH_TINKERKIT_A = 8;
// const CH_TINKERKIT_B = 9;
// const CH_JOYSTICK_SW = 10;
// const CH_JOYSTICK_X  = 11;
// const CH_JOYSTICK_Y  = 12;

// var channels = [
//   CH_SWITCH_1,
//   CH_SWITCH_2,
//   CH_SWITCH_3,
//   CH_SWITCH_4,
//   CH_SLIDER,
//   CH_LIGHT,
//   CH_TEMPERATURE,
//   CH_MIC,
//   CH_TINKERKIT_A,
//   CH_TINKERKIT_B,
//   CH_JOYSTICK_SW,
//   CH_JOYSTICK_X,
//   CH_JOYSTICK_Y,
// ];

// var channelNames = [
//   "CH_SWITCH_1",
//   "CH_SWITCH_2",
//   "CH_SWITCH_3",
//   "CH_SWITCH_4",
//   "CH_SLIDER",
//   "CH_LIGHT",
//   "CH_TEMPERATURE",
//   "CH_MIC",
//   "CH_TINKERKIT_A",
//   "CH_TINKERKIT_B",
//   "CH_JOYSTICK_SW",
//   "CH_JOYSTICK_X",
//   "CH_JOYSTICK_Y",
// ];



// function readChannel(channel) {
//   digitalWrite(MUX_ADDR_PINS[0], (channel & 1) ? HIGH : LOW);
//   digitalWrite(MUX_ADDR_PINS[1], (channel & 2) ? HIGH : LOW);
//   digitalWrite(MUX_ADDR_PINS[2], (channel & 4) ? HIGH : LOW);
//   digitalWrite(MUX_ADDR_PINS[3], (channel & 8) ? HIGH : LOW);

//   // workaround to cope with lack of pullup resistor on joystick switch
//   if (channel == CH_JOYSTICK_SW) {
//     pinMode(MUX_COM_PIN, INPUT_PULLUP);
//     var joystickSwitchState = (digitalRead(MUX_COM_PIN) == HIGH) ? 1023 : 0;
//     digitalWrite(MUX_COM_PIN, LOW);
//     return joystickSwitchState;
//   } else {
//     return analogRead(MUX_COM_PIN);
//   }
// }

// function pinMode(pin, mode) {
//   console.log("pinMode(%d, %d)", pin, mode);
// }

// function digitalWrite(pin, value) {
//   console.log("digitalWrite(%d, %d)", pin, value);
// }

// function digitalRead(pin) {
//   return Math.random() * 1 | 0;
// }

// function analogRead(pin) {
//   console.log("analogRead(%d)", pin);
// }


// for (var i = 0; i < channels.length; i++) {
//   console.log(channelNames[i]);
//   readChannel(i);
//   console.log("-----------");
// }
