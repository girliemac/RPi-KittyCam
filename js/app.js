(function() {
  var channel = 'kittyCam';

  var pubnub = PUBNUB.init({
      subscribe_key: 'sub-c-f762fb78-2724-11e4-a4df-02ee2ddab7fe',
      publish_key:   'pub-c-156a6d5f-22bd-4a13-848d-b5b4d4b36695'
  });

  pubnub.subscribe({
    channel: channel,
    restore: true,
    connect: getHistory,
    disconnect: function(res){
      console.log('disconnected');
    },
    reconnect: function(res){
      console.log('reconnecting to PubNub');
    },
    callback: function(m) { 
      if(m.image) {
        displayPhoto(m);
      }
    }
  });

  function getHistory() {
    pubnub.history({
      channel  : channel,
      count: 30,
      callback : function(messages) {
        messages[0].forEach(function(m){ 
          displayPhoto(m);
        });
      }
    });
  }

  function displayPhoto(m) {
    var time = new Date(m.timestamp).toLocaleString();

    var photo =  document.createElement('div');
    photo.setAttribute('class', 'photo');

    var elem = document.createElement('img');
    elem.setAttribute('src', m.image);

    elem.addEventListener('error', function(e){ 
      // broken image
      this.parentNode.style.display = 'none';
    })

    var text = document.createElement('figcaption');
    text.textContent = time;

    photo.appendChild(elem);
    photo.appendChild(text);

    var parentElement = document.getElementById('photos');
    var firstChild = parentElement.firstChild;
    parentElement.insertBefore(photo, firstChild);
  }

})();