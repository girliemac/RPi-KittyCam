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

import events from 'events';
import { getPinNumber } from 'raspi-board';

const registeredPins = global.raspiPinUsage = global.raspiPinUsage || {};

export class Peripheral extends events.EventEmitter {
  constructor(pins) {
    super();
    this.alive = true;
    if (!Array.isArray(pins)) {
      pins = [ pins ];
    }
    this.pins = [];
    pins.map((pin) => {
      pin = getPinNumber(pin);
      this.pins.push(pin);
      if (registeredPins[pin]) {
        registeredPins[pin].destroy();
      }
      registeredPins[pin] = this;
    });
  }
  destroy() {
    if (this.alive) {
      this.alive = false;
      for (let i = 0; i < this.pins.length; i++) {
        delete registeredPins[this.pins[i]];
      }
      this.emit('destroyed');
    }
  }
  validateAlive() {
    if (!this.alive) {
      throw new Error('Attempted to access a destroyed peripheral');
    }
  }
}
