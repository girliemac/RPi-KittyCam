// KittyDar - cat facial detection
// Note: this file and kittydar need to use the same canvas module, otherwise it failes.
// https://github.com/Automattic/node-canvas/issues/487

'use strict'

const fs = require('fs');
const kittydar = require('kittydar');
const Canvas = require('kittydar/node_modules/canvas');

process.on('message', (m) => {

  let imgPath = m[0];

  fs.readFile(imgPath, (err, data) => {
    if (err) {
      return console.error(err);
    }
    let img = new Canvas.Image; // creating an image object
    img.src = data;

    let w = img.width;
    let h = img.height;

    let canvas = new Canvas(w, h);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h);

    console.log('PID ' + process.pid + ': ditecting cats in the photo...');

    let cats = kittydar.detectCats(canvas);
    console.log('There are', cats.length, 'cats in this photo');

    let base64Img = '';

    if(cats.length > 0) {

      // Draw a rectangle around the detected cat's face
      ctx.strokeStyle = 'rgba(255, 64, 129, 0.8)';
      ctx.lineWidth = 2;

      for (let i = 0; i < cats.length; i++) {
        let cat = cats[i];
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

process.on('error', (err) => {
    console.log('Child process error: ', err);
});
