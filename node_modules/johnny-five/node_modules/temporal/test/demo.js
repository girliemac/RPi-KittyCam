"use strict";

var temporal = require("../lib/temporal.js"),
  startAt = Date.now();


temporal.queue([{
  delay: 500,
  task: function() {
    console.log("A", Date.now() - startAt);
  }
}, {
  delay: 200,
  task: function() {
    console.log("B", Date.now() - startAt);
  }
}, {
  delay: 200,
  task: function() {
    console.log("C", Date.now() - startAt);
  }
}]);


// queue.stop();
// console.log(queue);


// temporal.queue([
//   {
//     delay: 100,
//     task: function() {
//       console.log( "A", Date.now() - startAt );
//     }
//   },
//   {
//     delay: 100,
//     task: function() {
//       console.log( "B", Date.now() - startAt );
//     }
//   },
//   {
//     delay: 100,
//     task: function() {
//       console.log( "C", Date.now() - startAt );
//     }
//   }
// ]);
