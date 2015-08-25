var Board = require("../lib/firmata").Board;
var board = new Board("/dev/XYZ");

board.on("ready", function() {
  console.log("Ready");
});

board.on("error", function() {
  console.log("error");
});
