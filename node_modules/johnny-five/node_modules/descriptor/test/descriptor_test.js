var Descriptor = require("../lib/Descriptor.js"),
    nop = function() {};



exports[ "isDescriptor" ] = {
  setUp: function( done ) {
    // setup here
    done();
  },
  "false": function( test ) {
    test.expect( 4 );

    test.equal( Descriptor.isDescriptor(), false, "empty" );
    test.equal( Descriptor.isDescriptor({}), false, "plain" );
    test.equal( Descriptor.isDescriptor({ get: 0 }), false, "w/ get:0" );
    test.equal( Descriptor.isDescriptor({ set: 0 }), false, "w/ set:0" );

    test.done();
  },
  "true": function( test ) {
    test.expect( 3 );

    test.equal( Descriptor.isDescriptor({ value: 0 }), true, "w/ value:0" );
    test.equal( Descriptor.isDescriptor({ get: nop }), true, "w/ get:fn" );
    test.equal( Descriptor.isDescriptor({ set: nop }), true, "w/ set:fn" );

    test.done();
  }
};


exports[ "Descriptor" ] = {
  setUp: function( done ) {
    // setup here
    done();
  },
  "value": function( test ) {
    test.expect( 8 );

    function nop() {}

    var descriptor, array, object;

    descriptor = new Descriptor("");
    test.equal( descriptor.value, "", "string" );

    descriptor = new Descriptor(0);
    test.equal( descriptor.value, 0, "number" );

    descriptor = new Descriptor(false);
    test.equal( descriptor.value, false, "boolean" );

    descriptor = new Descriptor(undefined);
    test.equal( descriptor.value, undefined, "undefined" );

    descriptor = new Descriptor(null);
    test.equal( descriptor.value, null, "null" );

    descriptor = new Descriptor(nop);
    test.equal( descriptor.value, nop, "function (nop)" );

    array = [];
    descriptor = new Descriptor(array);
    test.equal( descriptor.value, array, "array" );

    object = [];
    descriptor = new Descriptor(object);
    test.equal( descriptor.value, object, "object" );


    test.done();
  },
  "accessor": function( test ) {
    test.expect( 2 );

    var descriptor, data;

    descriptor = new Descriptor({
      get: function() {
        return "foo";
      }
    });

    test.equal( descriptor.get(), "foo", "get:(foo)" );

    descriptor = new Descriptor({
      set: function( value ) {
        data = value;
      },
      get: function() {
        return data;
      }
    });
    console.log( descriptor );

    descriptor.set("value");
    test.equal( descriptor.get(), "value", "set:(value);get()" );

    test.done();
  },
  "configure": function( test ) {
    test.expect( 8 );

    var descriptor, data;

    descriptor = new Descriptor( "foo", "!enumerable" );

    test.equal( descriptor.value, "foo", "value:(foo)" );
    test.equal( descriptor.enumerable, false, "enumerable:false" );
    test.equal( descriptor.writable, true, "writable:true" );
    test.equal( descriptor.configurable, true, "configurable:true" );

    descriptor = new Descriptor( "foo", "!enumerable,!configurable,!writable" );

    test.equal( descriptor.value, "foo", "value:(foo)" );
    test.equal( descriptor.enumerable, false, "enumerable:false" );
    test.equal( descriptor.writable, false, "writable:false" );
    test.equal( descriptor.configurable, false, "configurable:false" );

    test.done();
  },
  "complete": function( test ) {
    test.expect( 4 );

    var target, descriptor, data;

    target = {};

    descriptor = new Descriptor({
      set: function( value ) {
        data = value;
      },
      get: function() {
        return data;
      }
    });

    Object.defineProperty( target, "prop", descriptor );

    test.equal( target.prop, undefined, "target.prop undefined" );

    target.prop = "foobar";
    test.equal( target.prop, "foobar", "target.prop foobar" );
    test.equal( data, "foobar", "data foobar" );

    data = "backdoor";

    test.equal( target.prop, "backdoor", "target.prop backdoor" );



    test.done();
  }
};




// value: "foo",
// meta: [ "enumerable" ]



/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
