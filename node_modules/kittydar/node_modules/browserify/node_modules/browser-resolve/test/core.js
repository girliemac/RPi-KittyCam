// test loading core modules
var assert = require('assert');
var resolve = require('../');

test('events', function(done) {
    resolve('events', {}, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('../builtin/events'));
        done();
    });
});

test('http', function(done) {
    resolve('http', {}, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('http-browserify'));
        done();
    });
});

test('dgram', function(done) {
    resolve('dgram', {}, function(err, path) {
        assert.ifError(err);
        assert.equal(path, require.resolve('../builtin/dgram'));
        done();
    });
});

