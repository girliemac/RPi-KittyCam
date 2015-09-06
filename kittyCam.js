/* 
 * KittyCam
 * A Raspberry Pi app using a camera PIR motion sensor, with cat facial detection
 *
 * Tomomi Imura (@girlie_mac)
 */

var config = require('./config');
var fs = require('fs');
var child_process = require('child_process');

require('events').EventEmitter.prototype._maxListeners = 20;

// Johnny-Five for RPi
var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({io: new raspi()});

var i = 0;

board.on('ready', function() {
  console.log('board is ready');

  // Create a new `motion` hardware instance.
  var motion = new five.Motion('P1-7'); //a PIR is wired on pin 7 (GPIO 4)

  // 'calibrated' occurs once at the beginning of a session
  motion.on('calibrated', function() {
    console.log('calibrated');
  });

  // Motion detected
  motion.on('motionstart', function() {
    console.log('motionstart');

    // Run raspistill command to take a photo with the camera module  
    var filename = 'photo/image_'+i+'.jpg';
    var args = ['-w', '320', '-h', '240', '-o', filename, '-t', '1'];
    var spawn = child_process.spawn('raspistill', args);

    spawn.on('exit', function(code) {
      console.log('A photo is saved as '+filename+ ' with exit code, ' + code);
      var timestamp = Date.now();
      i++;

      // Detect cats from photos

      if((/jpg$/).test(filename)) { // Ignore the temp filenames like image_001.jpg~
        var imgPath = __dirname + '/' + filename;

        // Child process: read the file and detect cats with KittyDar
        var args = [imgPath];
        var fork = child_process.fork(__dirname + '/detectCatsFromPhoto.js');
        fork.send(args);

        // the child process is completed
        fork.on('message', function(base64) {
          if(base64) {
            uploadToCloudinary(base64, timestamp);
          }
          
          // Once done, delete the photo to clear up the space
          deletePhoto(imgPath);
        });
      }
      
    })
  });

  // 'motionend' events
  motion.on('motionend', function() {
    console.log('motionend');
  });
});


function deletePhoto(imgPath) {
  fs.unlink(imgPath, function(err) {
    if (err) {
       return console.error(err);
    }
    console.log(imgPath + ' is deleted.');
  });
}


// PubNub to publish the data
// to make a separated web/mobile interface can subscribe the data to stream the photos in realtime.

var pubnub = require('pubnub');
var channel = 'kittyCam';

pubnub = pubnub.init({
  subscribe_key: config.pubnub.subscribe_key,
  publish_key: config.pubnub.publish_key
});

function publish(url, timestamp) {
  pubnub.publish({
    channel: channel, 
    message: {image: url, timestamp: timestamp},
    callback: function(m) {console.log(m);},
    error: function(err) {console.log(err);}
  });
}


// Cloudinary to store the photos

var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: config.cloudinary.cloud_name, 
  api_key: config.cloudinary.api_key, 
  api_secret: config.cloudinary.api_secret 
});

function uploadToCloudinary(base64Img, timestamp) {
  cloudinary.uploader.upload(base64Img, function(result) { 
    console.log(result);
    publish(result.url, timestamp); 
  });
}

// Ctrl-C
process.on('SIGINT', function(){
  process.exit();
});
