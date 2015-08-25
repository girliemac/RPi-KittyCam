/*
Copyright (c) 2015 Bryan Hughes <bryan@theoreticalideations.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the 'Software'), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var iniBuilder = require(__dirname + '/../index.js');

module.exports = {
  'basic': function (test) {
    var data = 'foo=bar';
    var parsed = iniBuilder.parse(data);
    test.equal(parsed.length, 1, 'has the proper number of entries');
    test.ok(iniBuilder.hasPath(parsed, 'foo'), 'has the proper path');
    test.equal(iniBuilder.find(parsed, 'foo').value, 'bar', 'has the proper value');
    test.done();
  },
  'multi-segment-path': function(test) {
    var data = 'foo=bar=baz';
    var parsed = iniBuilder.parse(data);
    test.equal(parsed.length, 1, 'has the proper number of entries');
    test.ok(iniBuilder.hasPath(parsed, ['foo', 'bar']), 'has the proper path');
    test.equal(iniBuilder.find(parsed, ['foo', 'bar']).value, 'baz', 'has the proper value');
    test.done();
  },
  'test-with-comments': function (test) {
    var data = '; This is a comment\n' +
      'foo=bar ; This is a different comment';
    var parsed = iniBuilder.parse(data);
    test.equal(parsed.length, 2, 'has the proper number of entries');
    test.equal(parsed[0].comment, '; This is a comment', 'has the proper block comment');
    test.ok(iniBuilder.hasPath(parsed, 'foo'), 'has the proper path');
    test.equal(iniBuilder.find(parsed, 'foo').value, 'bar', 'has the proper value');
    test.equal(iniBuilder.find(parsed, 'foo').comment, '; This is a different comment', 'has the proper inline comment');
    test.done();
  },
  'serialize-with-comments': function (test) {
    var data = '; This is a comment\n' +
      'foo=bar ; This is a different comment';
    var parsed = iniBuilder.parse(data);
    iniBuilder.find(parsed, 'foo').value = 'baz';
    test.equal(iniBuilder.serialize(parsed), '; This is a comment\n' +
      'foo=baz ; This is a different comment'
    );
    test.done();
  }
};