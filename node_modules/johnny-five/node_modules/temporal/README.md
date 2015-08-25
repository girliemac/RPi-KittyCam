# temporal


[![Build Status](https://travis-ci.org/rwaldron/temporal.png?branch=master)](https://travis-ci.org/rwaldron/temporal)

Non-blocking, temporal task sequencing. `temporal` does NOT use `setTimeout` or `setInterval`.

## Presentations

- [EmpireJS](https://dl.dropboxusercontent.com/u/3531958/empirejs/index.html)
- [CascadiaJS](https://dl.dropboxusercontent.com/u/3531958/cascadiajs/index.html)




## Getting Started

```bash
npm install temporal
```


## Examples

```javascript
var temporal = require("temporal");

temporal.on("idle", function() {
  console.log("Temporal is idle");  
});

// Wait 500 milliseconds, execute a task
temporal.delay(500, function() {

  console.log("500ms later...");

});

// Loop every n milliseconds, executing a task each time
temporal.loop(500, function() {

  console.log("Every 500ms...");

  // |this| is a reference to the temporal instance
  // use it to cancel the loop by calling:
  //
  this.stop();

  // The number of times this loop has been executed:
  this.called; // number

  // The first argument to the callback is the same as |this|
});


// Queue a sequence of tasks: delay, delay
// Each delay time is added to the prior delay times.
temporal.queue([
  {
    delay: 500,
    task: function() {
      // Executes 500ms after temporal.queue(...) is called
    }
  },
  {
    delay: 500,
    task: function() {
      // Executes 1000ms after temporal.queue(...) is called

      // The last "delay" task will emit an "ended" event
    }
  }
]);

// Queue a sequence of tasks: delay then loop
// Each delay time is added to the prior delay times.
temporal.queue([
  {
    delay: 500,
    task: function() {
      // Executes 500ms after temporal.queue(...) is called
    }
  },
  {
    loop: 100,
    task: function() {
      // Executes 600ms after temporal.queue(...) is called

      // Executes every 100ms thereafter.
    }
  }
]);
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).


## License
See LICENSE file.

