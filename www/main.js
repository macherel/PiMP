var VIDEOS = [];

function configure(configuration) {
	console.log( "loading >configuration.json<", configuration);
	if(!!configuration) {	
		if(!!configuration.videos) {
			configuration.videos.forEach(configureVideo);
		} else {
			console.log('no video in configuration', configuration.videos);
		}
	} else {
		console.log('configuration empty', configuration);
	}	
}

function configureVideo(video) {
    console.log('configuring a video', video);
	VIDEOS[video.id] = video;
	var element = $('<div id="' + video.id + '"><h1>' + video.name + '</h1><p>' + video.description + '</p><img src="' + video.thumbnail + '" /></div>');
	$("#gallery").append(element);
}

function start(id) {
	console.log('command >start< received', id);
	if(!!VIDEOS[id]) {
		var video = VIDEOS[id];
		var player = $('embed')[0];
		console.log('playing video', video);
		$("#gallery").hide();
		$("embed").css('display', 'block'); // $("embed").show() doesn't work
		player.playlist.stop();
		player.playlist.clear();
		player.playlist.add(video.url);
		player.playlist.play();
	} else {
		console.log('video does not exists', id);
	}
}

/*
 * On document ready
 */
$(function() {

	// Reading configuration file (configuration.json)
	$.get( "configuration.json", configure, "json");

	// listen commands on websocket
	var socket = io();
	socket.on('start', start);
});