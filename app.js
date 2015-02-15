var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/video.avi', function(req, res){
  res.sendfile('video.avi');
});

app.get('/video.m4v', function(req, res){
  res.sendfile('video.m4v');
});

app.get('/devstories.webm', function(req, res){
  res.sendfile('devstories.webm');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('webpage connected');

  socket.on('ready', function(msg){
    console.log('webpage ready');
  });

  socket.on('disconnect', function(){
    console.log('webpage disconnected');
  });
});