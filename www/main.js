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
		console.log('playing video', video);

		var player = $('#player')[0];
		$("#gallery").hide();
		/*
		 * Player MUST be visible before use api.
		 * $("#player").show() doesn't work.
		 */
		$("#player").css('display', 'block');
		player.playlist.stop();
		player.playlist.clear();
		player.playlist.add(video.url);
		/*
		 * When reach end of playlist
		 */
		player.playlist.play();
		/*
		 * video need to be played for changing fullscreen mode
		 */
		player.addEventListener("MediaPlayerEndReached", stop, false);
		player.video.fullscreen=true;
	} else {
		console.log('video does not exists', id);
	}
}

function stop() {
	var player = $('#player')[0];
	//$("#player").css('display', 'block');

	/*
	 * video need to be played for changing fullscreen mode
	 */
	player.video.fullscreen=false;
	//player.playlist.stop();
	player.playlist.clear();
	player.removeEventListener("MediaPlayerEndReached", stop, false);
	$("#player").hide();
	$("#gallery").show();
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