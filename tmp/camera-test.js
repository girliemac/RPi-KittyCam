var child_process = require('child_process');

var RaspiCam = require("raspicam");

var camera = new RaspiCam({
  mode: 'photo',
  width: 320,
  height: 240,
  output: 'photo/image_%03d.jpg',
  encoding: 'jpg',
  timeout: 0 // take the picture immediately
});

camera.on("started", function( err, timestamp ){
	console.log("photo started at " + timestamp );
});

camera.on("read", function( err, timestamp, filename ){
	console.log("photo image captured with filename: " + filename );

  if((/jpg$/).test(filename)) {
    var imgPath = __dirname + '/photo/' + filename;
    //detectCatsFromPhoto(imgPath, timestamp);

    // Child process: Detect cats from the photo
    var args = [imgPath];
    var worker = child_process.fork(__dirname + '/detectCatsFromPhoto.js');
    worker.send(args);

    worker.on('message', function(base64) {
      console.log(base64);
      if(base64) {
        uploadToCloudinary(base64, timestamp);
      }
      
      deletePhoto(imgPath);
    });
  }

});

function deletePhoto(imgPath) {
  fs.unlink(imgPath, function(err) {
    if (err) {
       return console.error(err);
    }
    console.log(imgPath + ' is deleted.');
  });
}

camera.on("exit", function( timestamp ){
	console.log("photo child process has exited at " + timestamp );
});

camera.start();



var fs = require('fs');
var kittydar = require('kittydar');
var Canvas = require('kittydar/node_modules/canvas');
// note: this file and kittydar need to use the same canvas module, otherwise it failes.
// https://github.com/Automattic/node-canvas/issues/487

// Parse REST API
// var https = require('https');
// var APP_ID = 'D96SB0YXQUIXrS62dqRCuarC3M5VNV7S3LiaaWnR';
// var REST_API_KEY = 'GSDoRmRwFhzX0MxYys1ERKYLMXj7uH8a3UO4qd8N';

// // HTTP POST
// var request = require('request');


function detectCatsFromPhoto(imgPath, timestamp) {

  fs.readFile(imgPath, function(err, data) {
    if (err) throw err;

    var img = new Canvas.Image; // creating an image object
    //img.onload = function(){
      console.log('Img onload');
      img.src = data;

      var w = img.width, h = img.height;

      var canvas = new Canvas(w, h);
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h);

      console.log('ditecting cats in the photo...');

      var cats = kittydar.detectCats(canvas);
      console.log("there are", cats.length, "cats in this photo");

      if(cats.length > 0) {

        // Draw a rectangle
        ctx.strokeStyle = 'rgba(255, 64, 129, 0.8)';
        ctx.lineWidth = 2;

        for (var i = 0; i < cats.length; i++) {
          var cat = cats[i];
          console.log(cat);
          ctx.strokeRect(cat.x, cat.y, cat.width, cat.height);
        }

        var base64Img = canvas.toDataURL(); // png by default. jpeg is currently not supported by node-canvas

        //uploadToCloudinary(base64Img, timestamp);

        ctx.clearRect(0, 0, w, h);
      }
   // };
  });
}

function uploadToParse(filename, image) {

  var data = {'fileName': filename, 'fileData': image}; 

  request.post({ 
    url: 'https://api.parse.com/1/classes/PiCam',
    headers: {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': APP_ID,
      'X-Parse-REST-API-Key': REST_API_KEY
    },
    json: data
  },
  function(err, res, body) {
    if(res.statusCode == 200 || res.statusCode == 201){
      console.log(res);
    } else {
      console.log('Error: '+res.statusCode);
    }
  });
}