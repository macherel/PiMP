/**
 * Created by Pihemde on 18/02/15.
 */
"use strict";

const PLAYER_ID = "player";
var videos = [];

window.addEventListener('pimp:begin', function (event) {
	if(!document.getElementById(PLAYER_ID)) {
		var player = document.createElement('embed');
		player.id = PLAYER_ID;
		player.target="test.mp4";
		player.type="application/x-vlc-plugin";
		player.autoplay="no";
		player.loop="no";
		player.width="800";
		player.height="600";
		player.controls="false";
		player.branding="no";
		player.style.display= 'none';
		document.body.appendChild(player);
	}
});

window.addEventListener('pimp:configure', function (event) {
	var configuration = event.detail;
	console.log( "loading configuration", configuration);
	if(!!configuration) {
		if(!!configuration.videos) {
			configuration.videos.forEach(function(video) {
				console.log('adding video', video);
				videos[video.id] = video;
			});
		} else {
			console.log('no video in configuration', configuration.videos);
		}
	} else {
		console.log('configuration empty', configuration);
	}
});

window.addEventListener('pimp:play', function (event) {
	var id = event.detail;
	console.log('command >start< received', id);
	if(!!videos[id]) {
		var video = videos[id];
		console.log('playing video', video);

		var player = document.getElementById(PLAYER_ID);
		/*
		 * Player need to be visible before accessing API
		 */
		player.style.display = 'block';
		player.playlist.stop();
		player.playlist.clear();
		player.playlist.add(video.url);
		/*
		 * When reach end of playlist
		 */
		player.playlist.play();
		player.input.position = 0.6; /* only for tests ; TO BE REMOVED !!!!!!!!!!!!!!!!! */
		player.addEventListener("MediaPlayerEndReached", triggerStopped, false);
		/*
		 * video need to be played for changing fullscreen mode
		 */
		player.video.fullscreen = true;
	} else {
		console.log('video does not exists', id);
		event.stopImmediatePropagation();
		triggerStopped(event);
	}
});

function triggerStopped(event) {
	window.dispatchEvent(new Event('pimp:stopped'));
}

window.addEventListener('pimp:stop', function (event) {
	var player = document.getElementById(PLAYER_ID);

	/*
	 * video need to be playing for changing fullscreen mode
	 */
	player.video.fullscreen = false;
	player.playlist.stop();
});

window.addEventListener('pimp:stopped', function (event) {
	player.video.fullscreen = false;
	document.getElementById(PLAYER_ID).style.display = 'none';
});

window.addEventListener('pimp:end', function (event) {
	var player = document.getElementById(PLAYER_ID);
	if(!!player.removeEventListener) {
		player.removeEventListener("MediaPlayerEndReached", triggerStopped, false);
	}
});