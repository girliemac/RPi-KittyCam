# Descriptor

Generate property descriptor maps

## Getting Started
Install the module with: `npm install descriptor`

```javascript
var Descriptor = require("descriptor");

```

## Examples
```js
var Descriptor = require("descriptor");

// `new` is optional
new Descriptor( "foo" );

{ // defaults to `true`
  writable: true,
  configurable: true,
  enumerable: true,
  value: 'foo'
}

new Descriptor( "foo", "!enumerable" );

{
  writable: true,
  configurable: true,
  enumerable: false,
  value: 'foo'
}

var data = "";

new Descriptor({
  get: function() {
    return data;
  },
  set: function( value ) {
    data = value;
  }
});

{
  configurable: true,
  enumerable: true,
  set: [Function],
  get: [Function]
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Rick Waldron
Licensed under the MIT license.
