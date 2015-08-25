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

var entryRegex = /[^=]*=.*/;


module.exports = {
  parse: parse,
  hasPath: hasPath,
  find: find,
  serialize: serialize
};

function parse(rawData, options) {

  rawData = rawData.toString();

  options = options || {};
  options.commentDelimiter = options.commentDelimiter || ';';

  var data = [];
  var commentBlockStart = 0;
  var lines = rawData.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var inlineCommentStart = line.indexOf(options.commentDelimiter);
    var lineWithoutComments = line;
    if (inlineCommentStart != -1) {
      lineWithoutComments = line.substr(0, inlineCommentStart).trim();
    }
    if (entryRegex.test(lineWithoutComments)) {
      if (commentBlockStart != i) {
        data.push({
          comment: lines.slice(commentBlockStart, i).join('\n')
        });
      }
      commentBlockStart = i + 1;
      var entry = {};
      if (inlineCommentStart != -1) {
        entry.comment = line.substr(inlineCommentStart);
      }
      lineWithoutComments = lineWithoutComments.split('=');
      entry.value = lineWithoutComments.pop();
      entry.path = lineWithoutComments.map(function(segment) {
        return segment.trim();
      });
      data.push(entry);
    }
  }
  if (commentBlockStart != i) {
    data.push({
      comment: lines.slice(commentBlockStart, i).join('\n')
    })
  }
  return data;
}

function hasPath(data, path) {
  return !!find(data, path);
}

function find(data, path) {
  if (!Array.isArray(path)) {
    path = [ path ];
  }
  for (var i = data.length - 1; i >= 0; i--) {
    var entry = data[i];
    if (entry.path && entry.path.length == path.length && entry.path.every(function (currentValue, index) {
      return path[index] == currentValue;
    })) {
      return entry;
    }
  }
}

function serialize(data, options) {
  options = options || {};
  options.commentDelimiter = options.commentDelimiter || ';';
  var rawData = '';
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    if (entry.path) {
      rawData += entry.path.join('=');
      rawData += '=' + entry.value;
      if (entry.comment) {
        rawData += ' ' + entry.comment;
      }
    } else if (entry.comment) {
      rawData += entry.comment;
    }
    if (i != data.length - 1) {
      rawData += '\n';
    }
  }
  return rawData;
}