var five = require("../lib/johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var k = 999;

  var matrix = new five.Led.Matrix({
    addresses: [0x70, 0x71],
    controller: "HT16K33",
    rotation: 3,
    devices: 2
  });

  var button = new five.Button({
    isPullup: true,
    pin: 8
  });

  button.on("press", function() {
    increment();
  });

  increment();

  function increment() {
    display(k);
    k++;
  }

  function display(value) {
    var chars = Array.from(String(value));
    var length = chars.length;
    var chunks = [];

    while (chars.length) {
      var slice = chars.length >= 2 ? 2 : chars.length;
      var lastTwo = chars.slice(-slice);
      // console.log(lastTwo.join(""));
      chars.length = chars.length - slice;
      chunks.push(lastTwo.join(""));
    }

    chunks = chunks.reverse();

    matrix.draw(0, chunks[0]);
    matrix.draw(1, chunks[1]);
  }
});
