var sf = require('../');

module.exports = {
  'no options, short string': function (test) {
    var result = sf.indent("This is a short string");
    test.equals(result, '  This is a short string');
    test.done();
  },

  'no options, multiline': function (test) {
    var result = sf.indent("Line 1\nLine 2");
    test.equals(result, ''
      + '  Line 1\n'
      + '  Line 2');
    test.done();
  },

  'no options, multiline windows line endings': function (test) {
    var result = sf.indent("Line 1\r\nLine 2");
    test.equals(result, ''
      + '  Line 1\r\n'
      + '  Line 2');
    test.done();
  },

  'prefix of a tab': function (test) {
    var result = sf.indent("Line 1\nLine 2", { prefix: '\t' });
    test.equals(result, ''
      + '\tLine 1\n'
      + '\tLine 2');
    test.done();
  },

  'wordwrap': function (test) {
    var result = sf.indent("L1 - 012345678901234567890\nL2 - Don't split words", { wordwrap: 20 });
    test.equals(result, ''
      + "  L1 -\n"
      + "  012345678901234567\n"
      + "  890\n"
      + "  L2 - Don't split\n"
      + "  words");
    test.done();
  },

  'wordwrap hyphinated word': function (test) {
    var result = sf.indent("L1 - Don't split-words", { prefix: '', wordwrap: 20 });
    test.equals(result, ''
      + "L1 - Don't split-\n"
      + "words");
    test.done();
  },

  'wordwrap empty lines': function (test) {
    var result = sf.indent("L1\n\nL2", { wordwrap: 20 });
    test.equals(result, ''
      + "  L1\n"
      + "  \n"
      + "  L2");
    test.done();
  }

};
