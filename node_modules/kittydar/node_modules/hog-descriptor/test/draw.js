var Canvas = require("canvas"),
    fs = require("fs"),
    hog = require("../hog");

var file = __dirname + "/beachball.jpg";

drawImgToCanvas(file, function(canvas) {
  drawThings(canvas)
});

function drawThings(canvas) {
  var greyscale = cloneCanvas(canvas);
  hog.drawGreyscale(greyscale);

  writeCanvasToFile(greyscale, __dirname + "/greyscale.jpg", function() {
    console.log("wrote greyscale");
  })

  var gradx = cloneCanvas(canvas);
  hog.drawGradient(gradx, 'x');

  writeCanvasToFile(gradx, __dirname + "/gradient-x.jpg", function() {
    console.log("wrote gradient-x");
  })

  var grady = cloneCanvas(canvas);
  hog.drawGradient(grady, 'y');

  writeCanvasToFile(grady, __dirname + "/gradient-y.jpg", function() {
    console.log("wrote gradient-y");
  })

  var mag = cloneCanvas(canvas);
  hog.drawMagnitude(mag);

  writeCanvasToFile(mag, __dirname + "/magnitude.jpg", function() {
    console.log("wrote magnitude");
  })
}

function cloneCanvas(canvas) {
  var c2 = new Canvas(canvas.width, canvas.height);
  var imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
  c2.getContext("2d").putImageData(imageData, 0, 0);

  return c2;
}

function drawImgToCanvas(file, callback) {
  fs.readFile(file, function(err, data) {
    if (err) throw err;

    var img = new Canvas.Image();
    img.src = new Buffer(data, 'binary');

    var canvas = new Canvas(img.width, img.height);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    callback(canvas);
  });
}

function writeCanvasToFile(canvas, file, callback) {
  var out = fs.createWriteStream(file)
  var stream = canvas.createJPEGStream();

  stream.on('data', function(chunk) {
    out.write(chunk);
  });

  stream.on('end', function() {
    callback();
  });
}
