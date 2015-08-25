var processing = {
  intensities: function(imagedata) {
    if (!imagedata.data) {
      // it's a canvas, extract the imagedata
      var canvas = imagedata;
      var context = canvas.getContext("2d");
      imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
    }

    var lumas = new Array(imagedata.height);
    for (var y = 0; y < imagedata.height; y++) {
      lumas[y] = new Array(imagedata.width);

      for (var x = 0; x < imagedata.height; x++) {
        var i = x * 4 + y * 4 * imagedata.width;
        var r = imagedata.data[i],
            g = imagedata.data[i + 1],
            b = imagedata.data[i + 2],
            a = imagedata.data[i + 3];

        var luma = a == 0 ? 1 : (r * 299/1000 + g * 587/1000
          + b * 114/1000) / 255;

        lumas[y][x] = luma;
      }
    }
    return lumas;
  },

  gradients: function(canvas) {
    var intensities = this.intensities(canvas);
    return this._gradients(intensities);
  },

  _gradients: function(intensities) {
    var height = intensities.length;
    var width = intensities[0].length;

    var gradX = new Array(height);
    var gradY = new Array(height);

    for (var y = 0; y < height; y++) {
      gradX[y] = new Array(width);
      gradY[y] = new Array(width);

      var row = intensities[y];

      for (var x = 0; x < width; x++) {
        var prevX = x == 0 ? 0 : intensities[y][x - 1];
        var nextX = x == width - 1 ? 0 : intensities[y][x + 1];
        var prevY = y == 0 ? 0 : intensities[y - 1][x];
        var nextY = y == height - 1 ? 0 : intensities[y + 1][x];

        // kernel [-1, 0, 1]
        gradX[y][x] = -prevX + nextX;
        gradY[y][x] = -prevY + nextY;
      }
    }

    return {
      x: gradX,
      y: gradY
    };
  },

  gradientVectors: function(canvas) {
    var intensities = this.intensities(canvas);
    return this._gradientVectors(intensities);
  },

  _gradientVectors: function(intensities) {
    var height = intensities.length;
    var width = intensities[0].length;

    var vectors = new Array(height);

    for (var y = 0; y < height; y++) {
      vectors[y] = new Array(width);

      for (var x = 0; x < width; x++) {
        var prevX = x == 0 ? 0 : intensities[y][x - 1];
        var nextX = x == width - 1 ? 0 : intensities[y][x + 1];
        var prevY = y == 0 ? 0 : intensities[y - 1][x];
        var nextY = y == height - 1 ? 0 : intensities[y + 1][x];

        // kernel [-1, 0, 1]
        var gradX = -prevX + nextX;
        var gradY = -prevY + nextY;

        vectors[y][x] = {
          mag: Math.sqrt(Math.pow(gradX, 2) + Math.pow(gradY, 2)),
          orient: Math.atan2(gradY, gradX)
        }
      }
    }
    return vectors;
  },

  drawGreyscale: function(canvas) {
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var intensities = this.intensities(canvas);

    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var i = (y * 4) * imageData.width + x * 4;
        var luma = intensities[y][x] * 255;

        imageData.data[i] = luma;
        imageData.data[i + 1] = luma;
        imageData.data[i + 2] = luma;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    return canvas;
  },

  drawGradient: function(canvas, dir) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var gradients = this.gradients(canvas);
    var grads = gradients[dir || "x"];

    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var i = (y * 4) * imageData.width + x * 4;
        var grad = Math.abs(grads[y][x]) * 255;

        imageData.data[i] = grad;
        imageData.data[i + 1] = grad;
        imageData.data[i + 2] = grad;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    return canvas;
  },

  drawMagnitude: function(canvas) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var vectors = processing.gradientVectors(canvas);

    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var i = (y * 4) * imageData.width + x * 4;
        var mag = Math.abs(vectors[y][x].mag) * 255;

        imageData.data[i] = mag;
        imageData.data[i + 1] = mag;
        imageData.data[i + 2] = mag;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    return canvas;
  },

  drawOrients: function(canvas) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var vectors = processing.gradientVectors(canvas);

    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var i = (y * 4) * imageData.width + x * 4;
        var orient = Math.abs(vectors[y][x].orient);
        orient *= (180 / Math.PI);
        if (orient < 0) {
          orient += 180;
        }
        orient /= 180 * 255;

        imageData.data[i] = orient;
        imageData.data[i + 1] = orient;
        imageData.data[i + 2] = orient;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    return canvas;
  }
}

module.exports = processing;
