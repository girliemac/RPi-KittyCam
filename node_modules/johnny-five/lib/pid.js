if (typeof Map !== "function") {
  require("/usr/local/lib/node_modules/es6-shim");
}

var priv = new Map();

// * (P)roportional
// * (I)ntegral
// * (D)erivative
function PID(opts) {

  var state = {
    range: opts.range || [0, 180],
    direction: opts.direction || PID.FORWARD,
    sampleTime: 100,
    lastTime: Date.now() - 100,
    lastInput: 0,
    kp: opts.kp || 1,
    ki: opts.ki || 0.05,
    kd: opts.kd || 0.25,
  };

  this.point = 0;
  this.output = 0;

  priv.set(this, state);

  this.tune(opts.kp, opts.ki, opts.kd);
}

PID.FORWARD = 1;
PID.REVERSE = -1;

PID.prototype = {
  constructor: PID,

  get range() {
    return priv.get(this).range;
  },
  set range(value) {
    var state = priv.get(this);

    if (Array.isArray(value)) {
      state.range[0] = value[0];
      state.range[1] = value[1];
    }
  },

  get direction() {
    return priv.get(this).direction;
  },
  set direction(value) {
    var state = priv.get(this);

    if (value === PID.FORWARD || value === PID.REVERSE) {
      state.direction = value;
    }
  },

  get sampleTime() {
    return priv.get(this).sampleTime;
  },
  set sampleTime(value) {
    var state, ratio;

    if (value > 0) {
      state = priv.get(this);

      ratio = value / state.sampleTime;

      state.ki *= ratio;
      state.kd /= ratio;

      state.sampleTime = value;
    }
  },

  tune: function(kp, ki, kd) {
    var state, seconds;

    if (kp < 0 || ki < 0 || kd < 0) {
      return false;
    }

    state = priv.get(this);
    seconds = state.sampleTime / 1000;

    state.kp = kp;
    state.ki = ki * seconds;
    state.kd = kd / seconds;

    state.kp *= state.direction;
    state.ki *= state.direction;
    state.kd *= state.direction;

    return true;
  },

  compute: function(input) {
    var state = priv.get(this);
    var now = Date.now();
    var diffTime = (now - state.lastTime);
    var min = state.range[0];
    var max = state.range[1];
    var temp = this.output;
    var output, error, diffInput;

    if (diffTime >= state.sampleTime) {
      state.lastInput = input;
      state.lastTime = now;

      error = this.point - input;

      temp += state.ki * error;
      temp = Math.max(Math.min(temp, max), min);

      diffInput = input - state.lastInput;

      output = (state.kp * error) + temp - (state.kd * diffInput);
      output = Math.max(Math.min(output, max), min);

      this.output = output;
    }

    return this.output;
  }
};

/*
var PITCH_P_VAL = 0.5;
var PITCH_I_VAL = 0;
var PITCH_D_VAL = 1;

var pitch = new PID({
  kp: PITCH_P_VAL,
  ki: PITCH_I_VAL,
  kd: PITCH_D_VAL,
  direction: PID.REVERSE,
  range: [-20, 20]
});

// Update to speed value.
pitch.point = 30;


var last = 10;
setInterval(function() {
  var value = ++last;

  last = value;

  console.log( value, pitch.compute(value) );

  if (value > 30) {
    last = 30;
  }
}, 50);
*/

module.exports = PID;


// kp=0.25, ki=0.0009, kd=0.002
