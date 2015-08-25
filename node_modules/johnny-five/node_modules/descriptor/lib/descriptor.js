/*
 * descriptor
 * https://github.com/rick/descriptor
 *
 * Copyright (c) 2012 Rick Waldron
 * Licensed under the MIT license.
 */

function assign( target, source ) {
  Object.keys( source ).forEach(function( key ) {
    this[ key ] = source[ key ];
  }, target );

  return target;
}

function Put( source ) {
  return assign( this, source );
}

function isDescriptor( o ) {
  return !!(
    o && typeof o === "object" &&
    ( "value" in o ||
      (
        ("get" in o && typeof o.get === "function") &&
        !("writable" in o)
      ) ||
      (
        ("set" in o && typeof o.set === "function") &&
        !("writable" in o)
      )
    )
  );
}

var options, defaults;

options = [ "writable", "configurable", "enumerable" ];
defaults = options.reduce(function( target, prop ) {
  return (target[ prop ] = true, target);
}, {});

function Descriptor( map, opts ) {
  var descriptor, fields;

  if ( !(this instanceof Descriptor) ) {
    return new Descriptor( map, opts || "" );
  }

  // Setup defaults on descriptor map:
  //  [ "writable", "configurable", "enumerable" ] = true
  descriptor = assign( {}, defaults );

  // If descriptor map overrides are present, parse the string
  // and set the fields accordingly.
  if ( opts !== undefined ) {
    opts.split(",").reduce(function( target, prop ) {
      // Parse, eg. "!enumerable"
      if ( prop[0] === "!" ) {
        target[ prop.slice(1) ] = false;
      }

      return target;
    }, descriptor);
  }

  fields = assign( descriptor, !isDescriptor(map) ? { value: map } : map );

  // Last Descriptor validation tests

  if ( !isDescriptor(fields) ) {
    if ( fields.get || fields.set ) {
      if ( fields.writable ) {
        delete fields.writable;
      }
      // Intentially sub conditioned to allow for
      // further additions
    }
    // If explicitly designing an accessor,
    // get rid of the value field
    if ( typeof map === "object" && (map.get || map.set) ) {
      if ( fields.value ) {
        delete fields.value;
      }
      // Intentially sub conditioned to allow for
      // further additions
    }
  }

  Put.call( this, fields );
}


Descriptor.isDescriptor = isDescriptor;


module.exports = Descriptor;
