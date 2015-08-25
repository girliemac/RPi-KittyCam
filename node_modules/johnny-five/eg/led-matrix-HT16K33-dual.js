var five = require("../lib/johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var k = 999;

  var a = new five.Led.Matrix({
    address: 0x70,
    controller: "HT16K33",
    rotation: 3,
  });

  var b = new five.Led.Matrix({
    address: 0x71,
    controller: "HT16K33",
    rotation: 3,
  });

  var order = [a, b];

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

    for (var i = 0; i < order.length; i++) {
      order[i].draw(chunks[i]);
    }
  }
});
