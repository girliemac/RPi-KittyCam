var run = require("uvrun").run;

// Do something here, like make a server to keep the event loop busy
// var TCP = process.binding("tcp_wrap").TCP;
// var server = new TCP();
// server.onconnection = function () {
//   console.log("connection!");
// };
// server.bind("0.0.0.0", 3000);
// server.listen(511);


// process.maxTickDepth = Infinity;
// process.nextTick(function tick() {

//   console.log("nextTick", Date.now());

//   process.nextTick(tick);
// });


// setInterval(function() {
//   console.log(Date.now());
// }, 0);

// Visualize each event loop tick using a custom event loop.
// console.log("Waiting for events...");
// do {
//   var ret = run();
//   console.log("tick", Date.now());
//   process.exit(0);
// } while(ret);


// process.maxTickDepth = Infinity;

// process.nextTick(function tick() {

//   console.log("tick", Date.now());

//   process.nextTick(tick);
// });



function tick(operation) {
  var now = Date.now();

  if (tick.last === now) {
    console.log("calling nextTick");
    process.nextTick(function() {
      tick(operation);
      operation();
    });
  } else {
    console.log("calling setTimeout");
    operation();
    setTimeout(function() {
      tick(operation);

    }, 0);
  }
}

tick.last = Date.now();

tick(function() {
  console.log(Date.now());
})
