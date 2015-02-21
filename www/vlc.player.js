/**
 *
 * Created by Pihemde on 18/02/15.
 *
 */
"use strict";

(function() {

	const PLAYER_ID = "player";
	let p = null;
	let videos = [];

	/**
	 * Send event "pimp:stopped"
	 */
	function triggerStopped() {
		window.dispatchEvent(new Event("pimp:stopped"));
	}

	/**
	 * this code simulate a "normal" playlist.
	 * Next playlist video is read instead of stopping.
	 * @param arg dunno
	 */
	function nextOrStop(arg) {
		console.log("nextOrStop", arg);
		p.playlist.removeItem(0); // Deprecated but no as ease replacement now
		if(p.playlist.items.count) {
			p.playlist.play();
		} else {
			triggerStopped();
		}
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
		p = document.getElementById(PLAYER_ID);
		p.addEventListener("MediaPlayerEndReached", nextOrStop, false);
		p.addEventListener("MediaPlayerStopped", triggerStopped, false);
		p.addEventListener("MediaPlayerEncounteredError", onVLCError, false);
	});

	/**
	 * Fill "videos" array with content of configuration
	 */
	window.addEventListener("pimp:configure", function({detail: configuration}) {
		console.log("loading configuration", configuration);
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
	});

	/**
	 * Clear playlist and add to playlist videos corresponding to identifiers from array parameter
	 * @param videoIds array of video Ids (from configuration)
	 */
	window.addEventListener("pimp:load", function({detail: videoIds}) {
		if(typeof videoIds !== "undefined" && Array.isArray(videoIds)) {
			p.playlist.clear();
			videoIds.forEach(function(id) {
				if (videos[id]) {
					p.playlist.add(videos[id].url, videos[id].name || "");
				} else {
					console.error("video does not exists", id);
				}
			});
		} else {
			console.error("param is undefined or not an array", videoIds);
		}
	});

	/**
	 * Resume from pause or play content of playlist and switch to fullscreen.
	 * If id param is set, playlist is cleared and video corresponding to id is add to playlist before playing.
	 * @param id (optional) a video id
	 */
	window.addEventListener("pimp:play", function({detail: id}) {
		console.log("command play received", id);
		if(typeof id !== "undefined" && id !== null) {
			if (videos[id]) {
				let video = videos[id];
				console.log("playing video", video);
				//p.playlist.stop();
				p.playlist.items.clear();
				p.playlist.add(video.url, videos[id].name || "");
			} else {
				console.error("video does not exists", id);
				/*
				 * video not played. we need to inform other modules
				 */
				event.stopImmediatePropagation();
				triggerStopped();
			}
		}
		if(p.playlist.items.count) {
			p.playlist.play();
			/*
			 * video need to be played for changing fullscreen mode
			 */
			p.video.fullscreen = true;

			/* Only for test ; TODO remove */
			p.input.position = 0.6;
			p.audio.mute = true;
			/* / Only for test ; TODO remove */
		}
	});

	/**
	 * Jump to next video form playlist
	 */
	window.addEventListener("pimp:previous", function() {
		p.playlist.prev();
	});

	/**
	 * Jump to previous video from playlist
	 */
	window.addEventListener("pimp:next", function() {
		p.playlist.next();
	});

	/**
	 * Pause video playing.
	 */
	window.addEventListener("pimp:pause", function() {
		p.playlist.pause();
	});

	/**
	 * Stop video playing.
	 */
	window.addEventListener("pimp:stop", function() {
		p.playlist.stop();
	});

	/**
	 * Exit fullscreeen.
	 */
	window.addEventListener("pimp:stopped", function() {
		p.video.fullscreen = false;
	});

	/**
	 * Remove vlc event listeners.
	 */
	window.addEventListener("pimp:end", function() {
		p.removeEventListener("MediaPlayerEndReached", nextOrStop, false);
		p.removeEventListener("MediaPlayerStopped", triggerStopped, false);
		p.removeEventListener("MediaPlayerEncounteredError", onVLCError, false);
	});

})();
