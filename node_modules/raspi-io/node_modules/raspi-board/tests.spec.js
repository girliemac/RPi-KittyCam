/*
The MIT License (MIT)

Copyright (c) 2014 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*global describe, it, expect */

global.raspiTest = true;
var board = require('./lib/index.js');

describe('Board Tests', function() {
  it('gets the correct board revision', function() {
    var revision = board.getBoardRevision();
    expect(revision).toBe(board.VERSION_2_MODEL_B);
  });
  it('can get the pins', function() {
    var pins = board.getPins();
    expect(pins[8].pins.length).toBe(3);
    expect(pins[8].pins.indexOf('GPIO2')).not.toBe(-1);
    expect(pins[8].pins.indexOf('SDA0')).not.toBe(-1);
    expect(pins[8].pins.indexOf('P1-3')).not.toBe(-1);
    expect(pins[8].peripherals.length).toBe(2);
    expect(pins[8].peripherals.indexOf('gpio')).not.toBe(-1);
    expect(pins[8].peripherals.indexOf('i2c')).not.toBe(-1);
  });
  it('can lookup pin numbers', function() {
    expect(board.getPinNumber('GPIO2')).toBe(8);
    expect(board.getPinNumber('TXD0')).toBe(15);
    expect(board.getPinNumber('P1-12')).toBe(1);
    expect(board.getPinNumber(10)).toBe(10);
    expect(board.getPinNumber('10')).toBe(10);
    expect(board.getPinNumber(50)).toBeNull();
    expect(board.getPinNumber('fake')).toBeNull();
  });
  it('returns undefined for invalid input', function(){
    expect(board.getPinNumber()).toBeNull();
    expect(board.getPinNumber([])).toBeNull();
    expect(board.getPinNumber({})).toBeNull();
    expect(board.getPinNumber(function() {})).toBeNull();
    expect(board.getPinNumber(/foo/)).toBeNull();
  });
});
