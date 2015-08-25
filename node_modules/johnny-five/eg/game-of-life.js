// var fs = require("fs");
// var five = require("../lib/johnny-five");
// var board = new five.Board();

// board.on("ready", function() {

//   var game = new GameOfLife({
//     auto: true,
//     interval: 500,
//     maxCycles: Infinity,
//     render: function(bytes, world) {
//       console.log(String(world));
//       console.log("----------------");

//       if (this.inPattern) {
//         matrix.draw(bytes);
//       } else {
//         matrix.clear();
//       }
//     }
//   });

//   var matrix = new five.Led.Matrix({
//     addresses: [0x70],
//     controller: "HT16K33",
//     rotation: 2,
//   });

//   var button = new five.Button({
//     isPullup: true,
//     pin: 8
//   });

//   button.on("hold", function() {
//     game.reset().start();
//   });

//   button.on("press", function() {
//     fs.writeFile("gol-pattern-" + Date.now() + ".json", JSON.stringify(game.pattern, null, 2), "utf8");
//   });

//   // this.repl.inject({
//   //   GameOfLife: GameOfLife,
//   //   World: GameOfLife.World,
//   //   game: game
//   // });
// });






// var priv = new Map();

// function random(howBig) {
//   howBig >>>= 0;
//   return Math.random() * howBig | 0;
// }

// function toBytes(world) {
//   var out = [0, 0, 0, 0, 0, 0, 0, 0];
//   for (var row = 0; row < 8; row++) {
//     for (var col = 0; col < 8; col++) {
//       out[row] |= world[row][col] << col;
//     }
//   }
//   return out;
// }

// function GameOfLife(options) {
//   var layout;

//   if (Array.isArray(options)) {
//     layout = options;
//     options = {
//       layout: layout
//     };
//   }

//   var state = {
//     auto: options.auto || false,
//     dimensions: options.dimensions || [8, 8],
//     interval: options.interval || 500,
//     layout: options.layout || null,
//     maxCycles: options.maxCycles || 255,
//     render: options.render || console.log.bind(console),
//     inPattern: false,
//     isStill: false,
//     cycle: 0,
//     timer: null,
//     history: [],
//     pattern: [],
//     mod: function(num) {
//       num >>>= 0;
//       return (num + this.dimensions[0]) % this.dimensions[0];
//     }
//   };

//   priv.set(this, state);

//   Object.defineProperties(this, {
//     inPattern: {
//       get: function() {
//         return state.inPattern;
//       }
//     },
//     pattern: {
//       get: function() {
//         return state.pattern.slice();
//       }
//     }
//   });

//   this.reset();

//   if (options.auto) {
//     this.start();
//   }
// }

// GameOfLife.prototype.randomize = function() {
//   var state = priv.get(this);

//   for (var row = 0; row < state.dimensions[0]; row++) {
//     for (var col = 0; col < state.dimensions[1]; col++) {
//       if (random(state.dimensions[1] - (state.dimensions[1] / 4)) > (state.dimensions[1] / 2)) {
//         this.present[row][col] ^= 1;
//       }
//     }
//   }
// };

// GameOfLife.prototype.reset = function() {
//   var state = priv.get(this);

//   this.stop();

//   this.present = new GameOfLife.World(state.layout || state.history.pop());
//   this.next = new GameOfLife.World();

//   state.isStill = false;
//   state.inPattern = false;

//   state.pattern.length = 0;
//   state.cycle = state.maxCycles;


//   if (!state.layout) {
//     this.randomize();
//     this.randomize();
//   }

//   return this;
// };

// GameOfLife.prototype.start = function() {
//   var state = priv.get(this);
//   state.timer = setInterval(function() {
//     this.generation();

//     if (!--state.cycle || state.isStill) {
//       this.reset();

//       if (state.auto) {
//         this.start();
//       }
//     }
//   }.bind(this), state.interval);
//   return this;
// };

// GameOfLife.prototype.stop = function() {
//   var state = priv.get(this);
//   if (state.timer) {
//     clearInterval(state.timer);
//   }
//   return this;
// };

// GameOfLife.prototype.generation = function() {
//   var state = priv.get(this);

//   for (var row = 0; row < state.dimensions[0]; row++) {
//     for (var col = 0; col < state.dimensions[1]; col++) {
//       // Count living neighbors
//       var alive = 0;

//       for (var cellX = -1; cellX <= 1; cellX++) {
//         for (var cellY = -1; cellY <= 1; cellY++) {
//           if (this.present[state.mod(row + cellX)][state.mod(col + cellY)] !== 0) {
//             alive++;
//           }
//         }
//       }

//       if (this.present[row][col]) {
//         if (alive < 2 || alive > 3) {
//           // Any cell with < 2 neighbors dies, due to under-population.
//           // Any cell with > 3 neighbors dies, due to over-crowding.
//           this.next[row][col] = 0;
//         } else {
//           // Any cell with 2 or 3 neighbors lives on to the next generation.
//           this.next[row][col] = 1;
//         }
//       } else {
//         if (alive === 3) {
//           // Re-animate a dead cell if it has exactly 3 live neighbors.
//           this.next[row][col] = 1;
//         }
//       }
//     }
//   }

//   // Copy next generation to present.
//   var isStill = true;

//   for (var row = 0; row < state.dimensions[0]; row++) {
//     for (var col = 0; col < state.dimensions[1]; col++) {
//       isStill &= ((this.present[row][col] > 0) === (this.next[row][col] > 0));
//       // isStill &= this.present[row][col] === this.next[row][col];
//       this.present[row][col] = this.next[row][col];
//     }
//   }

//   // The World is dead.
//   if (toBytes(this.present).reduce(function(a, b) {return a + b; }) === 0) {
//     this.reset().start();
//     return;
//   }


//   state.isStill = Boolean(isStill);
//   state.history.push(new GameOfLife.World(this.present));
//   state.render.call(this, toBytes(this.present), state.history[state.history.length - 1]);

//   state.history = state.history.slice(-32);

//   var wasInPattern = state.inPattern;

//   for (var i = 0; i < 31; i++) {
//     state.inPattern = false;
//     if (this.present.equals(state.history[i])) {
//       state.inPattern = true;
//       state.pattern.push(this.present);
//       break;
//     }
//   }

//   if (wasInPattern) {
//     if (!state.inPattern) {
//       state.pattern.length = 0;
//     } else {
//       // console.log("pattern: ", state.pattern);
//     }
//   }
// };

// GameOfLife.World = function(source, dimensions) {
//   Array.call(this);

//   if (!dimensions) {
//     dimensions = [8, 8];
//   }

//   for (var i = 0; i < dimensions[0]; i++) {
//     this.push(source ? source[i].slice() : new Array(dimensions[1]).fill(0));
//   }
// };

// GameOfLife.World.prototype = Object.create(Array.prototype, {
//   constructor: {
//     value: GameOfLife.World
//   }
// });

// GameOfLife.World.prototype.equals = function(other) {
//   var a = toBytes(this);
//   var b = toBytes(other);

//   for (var i = 0; i < (a.length / 2); i++) {
//     if (a[i] !== b[i] || a[(a.length - 1) - i] !== b[(a.length - 1) - i]) {
//       return false;
//     }
//   }
//   return true;
// };

// GameOfLife.World.prototype.toString = function() {
//   return this.reduce(function(accum, row) {
//     accum += row.join("").replace(/0/g, "  ").replace(/1/g, " ●") + "\n";
//     return accum;
//   }, "");
// };
