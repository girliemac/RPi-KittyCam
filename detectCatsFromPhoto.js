var fs = require('fs');

// KittyDar - cat facial detection
// Note: this file and kittydar need to use the same canvas module, otherwise it failes.
// https://github.com/Automattic/node-canvas/issues/487

var kittydar = require('kittydar');
var Canvas = require('kittydar/node_modules/canvas');

process.on('message', function(m) {

  var imgPath = m[0];

  fs.readFile(imgPath, function(err, data) {
    if (err) {
      return console.error(err);
    }
    var img = new Canvas.Image; // creating an image object
    img.src = data;

    var w = img.width;
    var h = img.height;

    var canvas = new Canvas(w, h);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h);

    console.log('PID ' + process.pid + ': ditecting cats in the photo...');

    var cats = kittydar.detectCats(canvas);
    console.log('There are', cats.length, 'cats in this photo');

    var base64Img = '';

    if(cats.length > 0) {

      // Draw a rectangle around the detected cat's face
      ctx.strokeStyle = 'rgba(255, 64, 129, 0.8)';
      ctx.lineWidth = 2;

      for (var i = 0; i < cats.length; i++) {
        var cat = cats[i];
        console.log(cat);
        ctx.strokeRect(cat.x, cat.y, cat.width, cat.height);
      }

      base64Img = canvas.toDataURL(); // png by default. jpeg is currently not supported by node-canvas
    }

    process.send(base64Img);

    ctx.clearRect(0, 0, w, h);

    process.exit(0);

  });
});

process.on('error', function (err) {
    console.log('Child process error: ', err);
});
