var epsilon = 0.00001;

module.exports = {
  L1: function(vector) {
    var norm = 0;
    for (var i = 0; i < vector.length; i++) {
      norm += Math.abs(vector[i]);
    }
    var denom = norm + epsilon;

    for (var i = 0; i < vector.length; i++) {
      vector[i] /= denom;
    }
  },

 'L1-sqrt': function(vector) {
    var norm = 0;
    for (var i = 0; i < vector.length; i++) {
      norm += Math.abs(vector[i]);
    }
    var denom = norm + epsilon;

    for (var i = 0; i < vector.length; i++) {
      vector[i] = Math.sqrt(vector[i] / denom);
    }
  },

  L2: function(vector) {
    var sum = 0;
    for (var i = 0; i < vector.length; i++) {
      sum += Math.pow(vector[i], 2);
    }
    var denom = Math.sqrt(sum + epsilon);
    for (var i = 0; i < vector.length; i++) {
      vector[i] /= denom;
    }
  }
}