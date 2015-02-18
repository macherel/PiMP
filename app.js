"use strict";

var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var path    = require('path');
var io      = require('socket.io')(http);

var trigger = require('./keyboard-trigger');

// Handlers
app.all('*', function(req, res, next) {
//	console.log(req);
	next();
});
// API
app.get('/api/:action/*', function(req, res){
	io.emit(req.params.action, req.params[0]);
	res.send();
});
// Public pages
var wwwOptions = { root: __dirname + '/www/' };
app.get('/', function(req, res){
	res.sendFile('index.html', wwwOptions);
});
app.get('/socket.io-1.3.3.js', function(req, res){
	res.sendFile('socket.io-1.3.3.js', wwwOptions);
});
app.get('/main.js', function(req, res){
	res.sendFile('main.js', wwwOptions);
});
app.get('/vlc.player.js', function(req, res){
	res.sendFile('vlc.player.js', wwwOptions);
});
app.get('/html.player.js', function(req, res){
	res.sendFile('html.player.js', wwwOptions);
});
app.get('/gallery.ui.js', function(req, res){
	res.sendFile('gallery.ui.js', wwwOptions);
});
app.get('/gallery.ui.css', function(req, res){
	res.sendFile('gallery.ui.css', wwwOptions);
});
// Resources
/*var options = { root: __dirname + '/data/' };
app.get('/:file', function(req, res){
	console.log(req.params.file);
	res.sendFile(req.params.file, options);
});*/

app.use(express.static(path.join(__dirname, 'data')));


http.listen(3000, function(){
	console.log('listening on *:3000');
});

io.on('connection', function(socket){
	console.log('webpage connected');

	trigger.on('trigger', function(id) {
		console.log("trigger", id);
		socket.emit('start', id);
	});

	socket.on('ready', function(msg){
		console.log('webpage ready');
	});

	socket.on('disconnect', function(){
		console.log('webpage disconnected');
	});
});