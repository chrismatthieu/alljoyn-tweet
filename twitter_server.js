var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var port = "1337";
var twitter = require('ntwitter');
//writing the OAUTH authentication for accessing Twitter API is not necessary and people usually use this library to make things a lot easier (ntwitter)
//Twitter Streaming API listens to all incoming tweets as they come in real-time

var myModule = require("./keys.js");

var twit = new twitter(myModule.keys);
//hiding my keys for security

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


