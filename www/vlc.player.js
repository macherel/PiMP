/**
 *
 * Created by Pihemde on 18/02/15.
 *
 */
"use strict";

(function() {

	const PLAYER_ID = "player";
	let vlcWrapper = null;

	/**
	 * Send event "pimp:stopped"
	 */
	function triggerStopped() {
		window.dispatchEvent(new Event("pimp:stopped"));
	}

	/**
	 * Create or retrieve VLC tag and create wrapper
	 */
	window.addEventListener("pimp:begin", function() {
		let vlc = document.getElementById(PLAYER_ID) || PLAYER_ID;
		vlcWrapper = new VLCWrapper(vlc);
		vlcWrapper.addEventListener("stopped", triggerStopped);
	});

	/**
	 * Retrieve video definition and pass them to wrapper
	 */
	window.addEventListener("pimp:configure", function({detail: configuration}) {
		console.log("loading configuration", configuration);
		let videos = [];
		if (configuration) {
			if (configuration.videos) {
				vlcWrapper.putVideoDefinitions(configuration.videos);
			} else {
				console.warn("no video in configuration", configuration.videos);
			}
		} else {
			console.warn("configuration empty", configuration);
		}
	});

	/**
	 * Clear playlist and add to playlist videos corresponding to identifiers from array parameter
	 * @param videoIds array of video Ids (from configuration)
	 */
	window.addEventListener("pimp:load", function({detail: videoIds}) {
		vlcWrapper.addAll(videoIds);
	});

	/**
	 * Resume from pause or play content of playlist and switch to fullscreen.
	 * If id param is set, playlist is cleared and video corresponding to id is add to playlist before playing.
	 * @param id (optional) a video id
	 */
	window.addEventListener("pimp:play", function(event) {
		let id = event.detail;
		if (typeof id === "string" && !vlcWrapper.add(id)) {
			/*
			 * video not played. we need to inform other modules
			 */
			event.stopImmediatePropagation();
			triggerStopped();
		}

		if(vlcWrapper.play()) {
			vlcWrapper.fullscreen(true);
		} else {
			/*
			 * video not played. we need to inform other modules
			 */
			event.stopImmediatePropagation();
			triggerStopped();
		}
	});

	/**
	 * Jump to next video form playlist
	 */
	window.addEventListener("pimp:previous", function() {
		vlcWrapper.previous();
	});

	/**
	 * Jump to previous video from playlist
	 */
	window.addEventListener("pimp:next", function() {
		vlcWrapper.next();
	});

	/**
	 * Pause video playing.
	 */
	window.addEventListener("pimp:pause", function() {
		vlcWrapper.pause();
	});

	/**
	 * Stop video playing.
	 */
	window.addEventListener("pimp:stop", function() {
		vlcWrapper.stop();
	});

	/**
	 * Exit fullscreen.
	 */
	window.addEventListener("pimp:stopped", function() {
		vlcWrapper.fullscreen(false);
	});

	/**
	 * Remove vlc event listeners.
	 */
	window.addEventListener("pimp:end", function() {
		vlcWrapper.removeEventListener("stopped", triggerStopped);
	});

})();
