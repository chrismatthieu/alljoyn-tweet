var skynet = require("skynet");
var twitter = require('ntwitter');
var twit = new twitter({
  consumer_key: 'BT8h5qcRYxa1opHZ4VX0DuW7h',
  consumer_secret: 'xZul4Vk00ajT3wtUQrc8w2iPhP2vLRrmETaRtuk1iVGPrUvkau',
  access_token_key: '161679280-PrYepOn61aW9udfHBampyQb5ZUzP9hKMSZAP6RI1',
  access_token_secret: 'pksRxeQO1hb8i8aB5zqBBfb7Qg8RL87U1RFCyH0B1fbJd' 
});

var skynet = require('skynet');

var conn = skynet.createConnection({
  // "uuid": "ad698900-2546-11e3-87fb-c560cb0ca47b",
  // "token": "zh4p7as90pt1q0k98fzvwmc9rmjkyb9"
});

conn.on('ready', function(data){
  console.log('UUID AUTHENTICATED!');
  console.log(data);


  twit.stream('statuses/filter', { track: ['allseenphx'] }, function(stream) {
    stream.on('data', function (tweet) {
    	console.log(tweet.text);
      // Send and receive messages
      conn.message({
        "devices": "feadee3e-7cb5-4fb5-93bd-1bcdba8de1c5",
        "subdevice":"alljoyn",
        "payload": {
          "method":"notify", "message": tweet.text
        }
      });

    }); 
    stream.on('end', function() {
    	console.log("Disconnected");
    });
    stream.on('error', function(error ,code) {
      console.log("My error: " + error + ": " + code);
    });
  });

});
