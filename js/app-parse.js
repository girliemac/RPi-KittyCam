(function() {
  var queryLimit = 100;
    // var pubnub = PUBNUB.init({
    //   publish_key: 'demo-36',
    //   subscribe_key: 'demo-36'
    // });

  Parse.initialize('D96SB0YXQUIXrS62dqRCuarC3M5VNV7S3LiaaWnR', 'CwxZpUjYs59B2GYf5RAnK41imVe8GvFcVYP2iO9m');

  var PiCam = Parse.Object.extend('PiCam');
  var query = new Parse.Query(PiCam);
  
  query.descending('createdAt');
  query.find({
    success: function(results) {
      console.log(results)

      for (var i = 0; i < queryLimit; i++) { 
        var object = results[i];
        var filedata = object.get('fileData');

        var photo =  document.createElement('div');
        photo.setAttribute('class', 'photo');

        var elem = document.createElement('img');
        elem.setAttribute('src', filedata);

        var filename = object.createdAt.toString();
        var text = document.createElement('figcaption');
        text.innerHTML = filename.split('GMT')[0];

        photo.appendChild(elem);
        photo.appendChild(text)
        document.getElementById('photos').appendChild(photo);
      }
    },
    error: function(error) {
      alert('Error: ' + error.code + ' ' + error.message);
    }
  });

})();