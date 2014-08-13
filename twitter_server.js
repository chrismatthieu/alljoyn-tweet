var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var port = "1337";
var twitter = require('ntwitter');
//writing the OAUTH authentication for accessing Twitter API is not necessary and people usually use this library to make things a lot easier (ntwitter)
//Twitter Streaming API listens to all incoming tweets as they come in real-time

var twit = new twitter({
  consumer_key: 'BT8h5qcRYxa1opHZ4VX0DuW7h',
  consumer_secret: 'xZul4Vk00ajT3wtUQrc8w2iPhP2vLRrmETaRtuk1iVGPrUvkau',
  access_token_key: '161679280-PrYepOn61aW9udfHBampyQb5ZUzP9hKMSZAP6RI1',
  access_token_secret: 'pksRxeQO1hb8i8aB5zqBBfb7Qg8RL87U1RFCyH0B1fbJd' });

var app = express();
app.get("/", function(request, response) {
  var content = fs.readFileSync(__dirname + "/template.html");
  response.setHeader("Content-Type", "text/html");
  response.send(content);
});
var server = http.createServer(app);
server.listen(port);

var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

var count = 0;
twit.stream('statuses/filter', { track: ['naruto'] }, function(stream) {
  stream.on('data', function (tweet) {
  	console.log("Passed a tweet to Socket IO");
    count += 1;
    console.log(count);
  	io.sockets.emit("tweet", tweet);
    // if (count >= 25) {
    //   console.log("Stop twit stream since count >= 25");
    //   stream.destroy();
    // }
  }); 
  stream.on('end', function() {
  	console.log("Disconnected");
  	io.sockets.emit('ending', {message: 'OVERAGE'});
  });
  stream.on('error', function(error ,code) {
    console.log("My error: " + error + ": " + code);
  });
});


