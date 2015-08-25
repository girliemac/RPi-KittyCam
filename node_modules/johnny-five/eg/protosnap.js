var five = require("../lib/johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var button = new five.Button({
    pin: 7,
    isPullup: true
  });

  var rgb = new five.Led.RGB({
    pins: [3, 5, 6],
    isAnode: true
  });

  button.on("down", function(value) {
    rgb.color(rainbow[colors[index++]]);

    if (index === colors.length) {
      index = 0;
    }
  });

  button.on("up", function() {
    rgb.stop();
  });

  button.on("hold", function() {
    rgb.pulse(500);
  });

  this.repl.inject({
    rgb: rgb
  });
});

var rgb = {
  red:    [0xff, 0x00, 0x00],
  orange: [0xff, 0x7f, 0x00],
  yellow: [0xff, 0xff, 0x00],
  green:  [0x00, 0xff, 0x00],
  blue:   [0x00, 0x00, 0xff],
  indigo: [0x31, 0x00, 0x62],
  violet: [0x4b, 0x00, 0x82],
  white:  [0xff, 0xff, 0xff],
};

var rainbow = Object.keys(rgb).reduce(function(colors, color) {
  // While testing, I found that the BlinkM produced
  // more vibrant colors when provided a 7 bit value.
  return (colors[color] = rgb[color].map(to7bit), colors);
}, {});

var colors = Object.keys(rainbow);
var index = 0;

function scale(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) /
    (inMax - inMin) + outMin;
}

function to7bit(value) {
  return scale(value, 0, 255, 0, 127) | 0;
}
