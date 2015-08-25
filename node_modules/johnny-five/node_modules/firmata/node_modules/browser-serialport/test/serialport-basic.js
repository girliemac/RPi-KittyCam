'use strict';

var sinon = require('sinon');
var chai = require('chai');
var without = require('lodash/array/without');
var expect = chai.expect;

var MockedSerialPort = require('../');
var SerialPort = MockedSerialPort.SerialPort;

var options;

function unset(msg){
  return function(){
    throw new Error(msg);
  };
}

var serialListeners = [];

var hardware = {
  ports: {},
  createPort: function(path){
    this.ports[path] = true;
  },
  reset: function(){
    this.ports = {};
    this.onReceive = unset('onreceive unset');
    this.onReceiveError = unset('onReceiveError unset');
  },
  onReceive: unset('onReceive unset'),
  onReceiveError: unset('onReceiveError unset'),
  emitData: function(buffer){
    process.nextTick(function(){
      var readInfo = {data: MockedSerialPort.buffer2ArrayBuffer(buffer), connectionId: 1};
      serialListeners.forEach(function(cb){
        cb(readInfo);
      });
    });
  },
  disconnect: function(path){
    this.ports[path] = false;
    var info = {error: 'disconnected', connectionId: 1};
    this.onReceiveError(info);
  },
  timeout: function(path){
    this.ports[path] = false;
    var info = {error: 'timeout', connectionId: 1};
    this.onReceiveError(info);
  },
  loseDevice: function(path){
    this.ports[path] = false;
    var info = {error: 'device_lost', connectionId: 1};
    this.onReceiveError(info);
  },
  systemError: function(path){
    this.ports[path] = false;
    var info = {error: 'system_error', connectionId: 1};
    this.onReceiveError(info);
  }
};

describe('SerialPort', function () {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    global.chrome = { runtime: { lastError: null } };

    serialListeners = [];

    options = {
      serial: {
        connect: function(path, options, cb){
          if (!hardware.ports[path]) {
            global.chrome.runtime.lastError = new Error({message: 'Failed to connect to the port.'});
          }

          chai.assert.ok(options.bitrate, 'baudrate not set');
          chai.assert.ok(options.dataBits, 'databits not set');
          chai.assert.ok(options.parityBit, 'parity not set');
          chai.assert.ok(options.stopBits, 'stopbits not set');
          chai.assert.isBoolean(options.ctsFlowControl, 'flowcontrol not set');

          cb({
            bitrate: 9600,
            bufferSize: 4096,
            connectionId: 1,
            ctsFlowControl: true,
            dataBits: 'eight',
            name: '',
            parityBit: 'no',
            paused: false,
            persistent: false,
            receiveTimeout: 0,
            sendTimeout: 0,
            stopBits: 'one'
           });
        },
        onReceive: {
          addListener: function(cb){
            serialListeners.push(cb);
          },
          removeListener: function(cb){
            serialListeners = without(serialListeners, cb);
          }
        },
        onReceiveError: {
          addListener: function(cb){
            hardware.onReceiveError = cb;
          }
        },
        send: function(connectionId, buffer, cb){

        },
        disconnect: function(connectionId, cb){
          cb();
        },
        setControlSignals: function(connectionId, options, cb){
          cb();
        }
      }
    };
    // Create a port for fun and profit
    hardware.reset();
    hardware.createPort('/dev/exists');
  });

  afterEach(function () {
    options = null;

    sandbox.restore();
  });

  describe('Constructor', function () {
    it('opens the port immediately', function (done) {
      var port = new SerialPort('/dev/exists', options, function (err) {
        expect(err).to.not.be.ok;
        done();
      });
    });

    it('emits the open event', function (done) {
      var port = new SerialPort('/dev/exists', options);
      port.on('open', function(){
        done();
      });
    });

    it.skip('emits an error on the factory when erroring without a callback', function (done) {
      // finish the test on error
      MockedSerialPort.once('error', function (err) {
        chai.assert.isDefined(err, 'didn\'t get an error');
        done();
      });

      var port = new SerialPort('/dev/johnJacobJingleheimerSchmidt');
    });

    it('emits an error on the serialport when explicit error handler present', function (done) {
      var port = new SerialPort('/dev/johnJacobJingleheimerSchmidt', options);

      port.once('error', function(err) {
        chai.assert.isDefined(err);
        done();
      });
    });

    it('errors with invalid databits', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort('/dev/exists', { databits : 19 }, false, errorCallback);
    });

    it('errors with invalid stopbits', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort('/dev/exists', { stopbits : 19 }, false, errorCallback);
    });

    it('errors with invalid parity', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort('/dev/exists', { parity : 'pumpkins' }, false, errorCallback);
    });

    it('errors with invalid flow control', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort('/dev/exists', { flowcontrol : ['pumpkins'] }, false, errorCallback);
    });

    it('errors with invalid path', function (done) {
      var errorCallback = function (err) {
        chai.assert.isDefined(err, 'err is not defined');
        done();
      };

      var port = new SerialPort(null, false, errorCallback);
    });

    it('allows optional options', function (done) {
      global.chrome.serial = options.serial;
      var cb = function () {};
      var port = new SerialPort('/dev/exists', cb);
      // console.log(port);
      expect(typeof port.options).to.eq('object');
      delete global.chrome.serial;
      done();
    });

  });

  describe('Functions', function () {

    it('write errors when serialport not open', function (done) {
      var cb = function () {};
      var port = new SerialPort('/dev/exists', options, false, cb);
      port.write(null, function(err){
        chai.assert.isDefined(err, 'err is not defined');
        done();
      });
    });

    it('close errors when serialport not open', function (done) {
      var cb = function () {};
      var port = new SerialPort('/dev/exists', options, false, cb);
      port.close(function(err){
        chai.assert.isDefined(err, 'err is not defined');
        done();
      });
    });

    it('flush errors when serialport not open', function (done) {
      var cb = function () {};
      var port = new SerialPort('/dev/exists', options, false, cb);
      port.flush(function(err){
        chai.assert.isDefined(err, 'err is not defined');
        done();
      });
    });

    it('set errors when serialport not open', function (done) {
      var cb = function () {};
      var port = new SerialPort('/dev/exists', options, false, cb);
      port.set({}, function(err){
        chai.assert.isDefined(err, 'err is not defined');
        done();
      });
    });

    it('drain errors when serialport not open', function (done) {
      var cb = function () {};
      var port = new SerialPort('/dev/exists', options, false, cb);
      port.drain(function(err){
        chai.assert.isDefined(err, 'err is not defined');
        done();
      });
    });

  });

  describe('reading data', function () {

    it('emits data events by default', function (done) {
      var testData = new Buffer('I am a really short string');
      var port = new SerialPort('/dev/exists', options, function () {
        port.once('data', function(recvData) {
          expect(recvData).to.eql(testData);
          done();
        });
        hardware.emitData(testData);
      });
    });

    it('calls the dataCallback if set', function (done) {
      var testData = new Buffer('I am a really short string');
      options.dataCallback = function (recvData) {
        expect(recvData).to.eql(testData);
        done();
      };

      var port = new SerialPort('/dev/exists', options, function () {
        hardware.emitData(testData);
      });
    });

  });

  describe('#open', function () {

    it('passes the port to the bindings', function (done) {
      var openSpy = sandbox.spy(options.serial, 'connect');
      var port = new SerialPort('/dev/exists', options, false);
      port.open(function (err) {
        expect(err).to.not.be.ok;
        expect(openSpy.calledWith('/dev/exists'));
        done();
      });
    });

    it('calls back an error when opening an invalid port', function (done) {
      var port = new SerialPort('/dev/unhappy', options, false);
      port.open(function (err) {
        expect(err).to.be.ok;
        done();
      });
    });

    it('emits data after being reopened', function (done) {
      var data = new Buffer('Howdy!');
      var port = new SerialPort('/dev/exists', options, function () {
        port.close(function () {
          port.open(function () {
            port.once('data', function (res) {
              expect(res).to.eql(data);
              done();
            });
            hardware.emitData(data);
          });
        });
      });
    });

    it('does not emit data twice if reopened', function (done) {
      var data = new Buffer('Howdy!');
      var port = new SerialPort('/dev/exists', options, function () {
        port.close(function () {
          port.open(function () {
            var count = 0;
            port.on('data', function (res) {
              count++;
            });
            hardware.emitData(data);

            setTimeout(function(){
              expect(count).to.equal(1);
              done();
            }, 200);
          });
        });
      });
    });
  });

  describe('#send', function () {

    it('errors when writing a closed port', function (done) {
      var port = new SerialPort('/dev/exists', options, false);
      port.write(new Buffer(''), function(err){
        expect(err).to.be.ok;
        done();
      });
    });

  });

  describe('close', function () {
    it('fires a close event when it\'s closed', function (done) {
      var port = new SerialPort('/dev/exists', options, function () {
        var closeSpy = sandbox.spy();
        port.on('close', closeSpy);
        port.close();
        expect(closeSpy.calledOnce);
        done();
      });
    });

    it('fires a close event after being reopened', function (done) {
      var port = new SerialPort('/dev/exists', options, function () {
        var closeSpy = sandbox.spy();
        port.on('close', closeSpy);
        port.close();
        port.open();
        port.close();
        expect(closeSpy.calledTwice);
        done();
      });
    });

    it('errors when closing an invalid port', function (done) {
      var port = new SerialPort('/dev/exists', options, false);
      port.close(function(err){
        expect(err).to.be.ok;
        done();
      });
    });

    it('emits a close event', function (done) {
      var port = new SerialPort('/dev/exists', options, function () {
        port.on('close', function () {
          done();
        });
        port.close();
      });
    });
  });

  describe('disconnect', function () {
    it('fires a disconnect event', function (done) {
      options.disconnectedCallback = function (err) {
          expect(err).to.be.ok;
          done();
        };
      var port = new SerialPort('/dev/exists', options, function () {
        hardware.disconnect('/dev/exists');
      });
    });

    it('emits a disconnect event', function (done) {
      var port = new SerialPort('/dev/exists', options, function () {
        port.on('disconnect', function () {
          done();
        });
        hardware.disconnect('/dev/exists');
      });
    });
  });

});

