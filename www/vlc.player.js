/**
 *
 * Created by Pihemde on 18/02/15.
 *
 */
"use strict";

(function() {

	const PLAYER_ID = "player";
	let vlc = null;
	let playlist = null;

	/**
	 * Send event "pimp:stopped"
	 */
	function triggerStopped() {
		window.dispatchEvent(new Event("pimp:stopped"));
	}

	function onVLCError(event) {
		console.log("VLC has encountered an error", event);
	}

	/**
	 * Create embed tag if not exists and set "p" global variable to vlc player
	 */
	window.addEventListener("pimp:begin", function() {
		if (!document.getElementById(PLAYER_ID)) {
			let playerTag = document.createElement("embed");
			playerTag.id = PLAYER_ID;
			playerTag.type = "application/x-vlc-plugin";
			playerTag.width = "1";
			playerTag.height = "1";
			playerTag.style.position = "absolute";
			playerTag.style.top = "0px";
			playerTag.style.right = "0px";
			playerTag.setAttribute("autoplay", "false");
			playerTag.setAttribute("loop", "false"); // default false
			playerTag.setAttribute("autoloop", "false"); // default false
			playerTag.setAttribute("controls", "false");
			playerTag.setAttribute("toolbar", "false"); // alias for controls
			playerTag.setAttribute("branding", "false"); // vlc logo
			document.body.appendChild(playerTag);
		}
		vlc = document.getElementById(PLAYER_ID);
		vlc.addEventListener("MediaPlayerStopped", triggerStopped, false);
		vlc.addEventListener("MediaPlayerEncounteredError", onVLCError, false)
	});

	/**
	 * Fill "videos" array with content of configuration
	 */
	window.addEventListener("pimp:configure", function({detail: configuration}) {
		console.log("loading configuration", configuration);
		let videos = [];
		if (configuration) {
			if (configuration.videos) {
				configuration.videos.forEach(function(video) {
					console.log("adding video", video);
					videos[video.id] = video;
				});
			} else {
				console.warn("no video in configuration", configuration.videos);
			}
		} else {
			console.warn("configuration empty", configuration);
		}
		playlist = new Playlist(videos, vlc);
		playlist.addEventListener("playlistEndReached", triggerStopped);
	});

	/**
	 * Clear playlist and add to playlist videos corresponding to identifiers from array parameter
	 * @param videoIds array of video Ids (from configuration)
	 */
	window.addEventListener("pimp:load", function({detail: videoIds}) {
		playlist.addAll(videoIds);
	});

	/**
	 * Resume from pause or play content of playlist and switch to fullscreen.
	 * If id param is set, playlist is cleared and video corresponding to id is add to playlist before playing.
	 * @param id (optional) a video id
	 */
	window.addEventListener("pimp:play", function(event) {
		let id = event.detail;
		if (typeof id === "string" && !playlist.add(id)) {
			/*
			 * video not played. we need to inform other modules
			 */
			event.stopImmediatePropagation();
			triggerStopped();
		}

		if(playlist.play()) {
			vlc.video.fullscreen = true;
		}
	});

	/**
	 * Jump to next video form playlist
	 */
	window.addEventListener("pimp:previous", function() {
		playlist.previous();
	});

	/**
	 * Jump to previous video from playlist
	 */
	window.addEventListener("pimp:next", function() {
		playlist.next();
	});

	/**
	 * Pause video playing.
	 */
	window.addEventListener("pimp:pause", function() {
		playlist.pause();
	});

	/**
	 * Stop video playing.
	 */
	window.addEventListener("pimp:stop", function() {
		playlist.stop();
	});

	/**
	 * Exit fullscreen.
	 */
	window.addEventListener("pimp:stopped", function() {
		vlc.video.fullscreen = false;
	});

	/**
	 * Remove vlc event listeners.
	 */
	window.addEventListener("pimp:end", function() {
		vlc.removeEventListener("MediaPlayerStopped", triggerStopped, false);
		vlc.removeEventListener("MediaPlayerEncounteredError", onVLCError, false);
		playlist.removeEventListener("playlistEndReached", triggerStopped);
	});

})();
