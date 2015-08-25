"use strict";

var temporal = require("../lib/temporal.js");
var Emitter = require("events").EventEmitter;


function sum(a, b) {
  return a + b;
}

function fuzzy(actual, expected, tolerance) {
  return actual === expected ||
    (Math.abs(actual - expected) <= (tolerance === undefined ? 10 : tolerance));
}


exports["temporal"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    temporal.clear();
    done();
  },
  emitter: function(test) {
    test.expect(1);
    test.ok(temporal instanceof Emitter);
    test.done();
  },
  busy: function(test) {
    test.expect(2);

    temporal.on("busy", function() {
      test.ok(true);
    });

    temporal.wait(1, function() {
      test.ok(true);
      test.done();
    });
  },
  idle: function(test) {
    test.expect(2);

    temporal.on("idle", function() {
      test.ok(true);
      test.done();
    });

    temporal.wait(1, function() {
      test.ok(true);
    });
  }
};

exports["context"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    temporal.clear();
    done();
  },
  loop: function(test) {
    test.expect(1);

    temporal.loop(200, function(context) {
      // console.log(context);

      test.ok(context === this);

      if (context.called === 1) {
        this.stop();
        test.done();
      }
    });
  }
};

exports["clear"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    temporal.clear();
    done();
  },
  clear: function(test) {
    test.expect(1);

    temporal.wait(20, function() {
      // this will never happen.
      console.log("shouldn't happen");
      test.ok(false);
    });

    temporal.wait(10, function() {
      console.log("kill it");
    });

    setTimeout(function() {
      temporal.clear();
      test.ok(true);
      test.done();
    }, 1);
  }
};

exports["loops"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    temporal.clear();
    done();
  },
  stop: function(test) {
    test.expect(1);

    var temporaldAt, completeds, last;

    temporaldAt = Date.now();

    completeds = [];

    temporal.loop(100, function(loop) {
      // console.log( "a", a );
      if (loop.called === 1) {
        completeds.push(loop.called);
        this.stop();
      }
    });

    temporal.loop(100, function(loop) {
      // console.log( "b", b );
      if (loop.called === 3) {
        completeds.push(loop.called);
        this.stop();
      }
    });

    last = temporal.loop(100, function(loop) {
      // console.log( "c", c );
      if (loop.called === 5) {
        completeds.push(loop.called);
        loop.stop();
      }
    });


    last.on("stop", function() {
      var result = completeds.reduce(sum, 0);

      test.equal(result, 9, "sum of loop.called counters is 9");
      test.done();
    });
  }
};



exports["delay"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    temporal.clear();
    done();
  },
  delay: function(test) {
    test.expect(13);

    var completed = 0;
    var times = [
      1, 2, 5, 10, 20, 50, 100, 150, 200, 250, 500, 750, 1000
    ];

    times.forEach(function(time) {

      var temporaldAt = Date.now(),
        expectAt = temporaldAt + time;

      temporal.delay(time, function() {
        var actual = Date.now();

        test.ok(
          fuzzy(actual, expectAt),
          "time: " + time + " ( " + Math.abs(actual - expectAt) + ")"
        );

        if (++completed === times.length) {
          test.done();
        }
        // console.log(completed, time);
      });
    });
  }
};

exports["repeat"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    temporal.clear();
    done();
  },
  repeat: function(test) {
    test.expect(1);

    var completed = 0;

    temporal.repeat(2, 500, function() {
      if (++completed === 2) {
        test.ok(true, "repeat called twice");
        test.done();
      }
    });
  },
  returns: function(test) {
    test.expect(5);

    var repeat = temporal.repeat(2, 500, function() {});

    test.ok(repeat);
    test.ok(repeat.stop);
    test.ok(repeat.calledAt);
    test.ok(repeat.now);
    test.equal(repeat.called, 0);

    test.done();
  }
};


exports["queue"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    temporal.clear();
    done();
  },
  speed: function(test) {
    test.expect(4);

    var temporaldAt = Date.now(),
      expectAt = temporaldAt + 1;

    // Wait queue
    temporal.queue([{
      delay: 1,
      task: function() {
        var now = Date.now();
        test.ok(fuzzy(now, expectAt, 1), "queued fn 1: on time");
        expectAt = now + 2;
      }
    }, {
      delay: 2,
      task: function() {
        var now = Date.now();
        test.ok(fuzzy(now, expectAt, 1), "queued fn 1: on time");
        expectAt = now + 5;
      }
    }, {
      delay: 5,
      task: function() {
        var now = Date.now();
        test.ok(fuzzy(now, expectAt, 1), "queued fn 2: on time");
        test.ok(fuzzy(now, temporaldAt + 7, 1), "queue lapse correct");

        test.done();
      }
    }]);
  },
  hundredms: function(test) {
    test.expect(100);

    var queue = [];
    var k = 0;

    for (var i = 0; i < 100; i++) {
      queue.push({
        delay: 1,
        task: function() {
          var now = Date.now();
          test.ok(fuzzy(now, expectAt, 5), "queued fn " + k + ": on time");
          expectAt = now + 1;
        }
      });

      k++;
    }

    var temporaldAt = Date.now();
    var expectAt = temporaldAt + 1;


    temporal.on("idle", function() {
      temporal.clear();
      test.done();
    });

    temporal.queue(queue);
  },
  // hundredfps: function(test) {
  //   test.expect(101);

  //   var queue = [];
  //   for (var i = 0; i < 100; i++) {
  //     queue.push({
  //       delay: 10,
  //       task: function() {
  //         temporaldAt = Date.now();
  //         test.ok(fuzzy(temporaldAt, expectAt, 1), "queued fn: on time");
  //         expectAt = temporaldAt + 10;
  //       }
  //     });

  //   }

  //   var startedAt = Date.now();
  //   var temporaldAt = Date.now();
  //   var expectAt = temporaldAt + 10;


  //   temporal.on("idle", function() {
  //     test.ok(fuzzy(temporaldAt - startedAt, 1000, 1), "~1000ms " + (temporaldAt - startedAt));
  //     temporal.clear();
  //     test.done();
  //   });
  //   // Wait queue
  //   temporal.queue(queue);

  // },

  delay: function(test) {
    test.expect(3);

    var temporaldAt = Date.now(),
      expectAt = temporaldAt + 100;

    // Wait queue
    temporal.queue([{
      delay: 100,
      task: function() {
        var now = Date.now();

        test.ok(fuzzy(now, expectAt, 1), "queued fn 1: on time");
        expectAt = now + 200;
      }
    }, {
      delay: 200,
      task: function() {
        var now = Date.now();

        test.ok(fuzzy(now, expectAt, 1), "queued fn 2: on time");
        test.ok(fuzzy(now, temporaldAt + 300, 1), "queue lapse correct");

        test.done();
      }
    }]);
  },
  loop: function(test) {
    test.expect(6);

    var temporaldAt = Date.now(),
      expectAt = temporaldAt + 100;

    // Wait queue
    temporal.queue([{
      delay: 100,
      task: function() {
        var now = Date.now();

        test.ok(fuzzy(now, expectAt, 1), "queued delay fn 1: on time");
        expectAt = now + 200;
      }
    }, {
      loop: 200,
      task: function(task) {
        var now = Date.now();

        if (task.called === 1) {
          test.ok(fuzzy(now, expectAt, 1), "queued loop fn 1: on time");
          test.ok(fuzzy(now, temporaldAt + 300, 1), "queue lapse correct");
        }

        if (task.called === 2) {
          test.ok("stop" in task);
          test.ok(fuzzy(now, expectAt, 1), "queued loop fn 2: on time");
          test.ok(fuzzy(now, temporaldAt + 500, 1), "queue lapse correct");
          test.done();
        }

        expectAt = now + 200;
      }
    }]);
  },
  end: function(test) {
    test.expect(3);

    var queue;

    // Wait queue
    queue = temporal.queue([{
      delay: 100,
      task: function() {
        test.ok(true);
      }
    }, {
      delay: 100,
      task: function() {
        test.ok(true);
      }
    }]);

    queue.on("end", function() {
      test.ok(true);
      test.done();
    });
  },
  stop: function(test) {
    test.expect(1);

    var queue = temporal.queue([{
      delay: 50,
      task: function() {
        test.ok(false);
      }
    }, {
      delay: 50,
      task: function() {
        test.ok(false);
      }
    }, {
      delay: 50,
      task: function() {
        test.ok(false);
      }
    }]);

    // Stop before any tasks run.
    setTimeout(function() {
      queue.stop();
    }, 10);

    queue.on("stop", function() {
      test.ok(true);
      test.done();
    });
  }
};

exports["failsafe"] = {
  setUp: function(done) {
    done();
  },
  tearDown: function(done) {
    temporal.clear();
    done();
  },
  missed: function(test) {
    test.expect(3);

    // The previousTick patch ensures that all
    // three of these tasks are run.

    temporal.queue([{
      wait: 50,
      task: function() {
        test.ok(true);

        var blocking = Date.now() + 30;

        while (Date.now() < blocking) {}
      }
    }, {
      wait: 10,
      task: function() {
        // console.log(2);
        test.ok(true);
      }
    }, {
      wait: 30,
      task: function() {
        // console.log(3);
        test.ok(true);
        test.done();
      }
    }]);
  }
};
