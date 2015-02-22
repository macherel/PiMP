"use strict";

function loadOptionalModule(module, listModules) {
	try {
		var loadedModule = require('./lib/' + module);
		if(!!listModules) listModules.push(loadedModule);
		return loadedModule;
	} catch(e) {
		console.log('An error occurs when loading module ' + module + '.', e);
	}
}

var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var path    = require('path');
var io      = require('socket.io')(http);

var triggers = [];
loadOptionalModule('keyboard-trigger', triggers);
loadOptionalModule('gpio-trigger', triggers);
var config = require('./lib/config')

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
app.get('/static/:file', function(req, res) {
	res.sendFile(req.params.file, wwwOptions);
})
// Resources
app.use(express.static(path.join(__dirname, 'data')));


http.listen(3000, function(){
	console.log('listening on *:3000');
});

io.on('connection', function(socket){
	console.log('webpage connected');

	for(var i=0; i<triggers.length; i++) {
		var trigger = triggers[i];
		trigger.on('trigger', function(id) {
			console.log("trigger", id);
			socket.emit('play', id);
		});
	}

	socket.on('ready', function(msg){
		console.log('webpage ready');
	});

	socket.on('disconnect', function(){
		console.log('webpage disconnected');
	});
});
