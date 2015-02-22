/**
 * Created by Pihemde on 22/02/15.
 */

let VLCWrapper = (function(){
	"use strict";
	const DEBUG = true;

	/**
	 * VLC error event listener
	 * @param event the event
	 */
	function onVLCError(event) {
		console.log("VLC has encountered an error", event);
	}

	/**
	 * Constructor.
	 * If param vlc is a string wrapper add a tag embed for VLC in content of body page @see VLCWrapperClass.createTag(id).
	 * @param vlc vlc DOM element or valid DOM ID String
	 * @constructor
	 */
	function VLCWrapperClass(vlc) {
		console.log("new VLCWrapperClass()", vlc);

		if(typeof vlc === "string") {
			this.vlc = this.createTag();
		} else {
			this.vlc = vlc;
			this.vlc.playlist.clear();
		}

		this.playlistEndReachedListeners = [];
		this.vlc.addEventListener("MediaPlayerEndReached", this.continuePlaying.bind(this), false);
		this.vlc.addEventListener("MediaPlayerStopped", this.triggerEventListeners.bind(this, "stopped"), false);
		this.vlc.addEventListener("MediaPlayerEncounteredError", onVLCError, false);

		this.videos = [];
		this.index = -1;
		this.count = 0;
	}

	/**
	 *
	 * @param id
	 * @returns {HTMLElement}
	 */
	VLCWrapperClass.prototype.createTag = function(id) {
		let playerTag = document.createElement("embed");
		playerTag.id = id;
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
		return playerTag;
	};

	VLCWrapperClass.prototype.putVideoDefinitions = function(arg) {
		if (Array.isArray(arg)) {
			arg.forEach(this.putVideoDefinitions.bind(this));
		} else {
			this.videos[arg.id] = arg;
		}
	};

	VLCWrapperClass.prototype.clear = function() {
		console.log("VLCWrapperClass.", "clear()");
		this.vlc.playlist.clear();
		this.index = -1;
		this.count = 0;
	};

	VLCWrapperClass.prototype.add = function(id) {
		console.log("VLCWrapperClass.", "add()", id);
		if(typeof id === "string" && this.videos[id]) {
			this.clear();
			this.vlc.playlist.add(this.videos[id].url, this.videos[id].name || "");
			this.count = 1;
			this.index = 0;
			return true;
		}
		console.error("param is not defined or not s string", id);
		return false;
	};

	VLCWrapperClass.prototype.addAll = function(videoIds) {
		console.log("VLCWrapperClass.", "addAll()", videoIds);
		if(typeof videoIds !== "undefined" && Array.isArray(videoIds)) {
			this.clear();
			videoIds.forEach(function(id) {
				if (this.videos[id]) {
					this.vlc.playlist.add(this.videos[id].url, this.videos[id].name || "");
					this.count++;
				} else {
					console.error("video does not exists", id);
				}
			}, this);
			if(this.count) {
				this.index = 0;
			}
			return true;
		}
		console.error("param is not defined or not an array", videoIds);
		return false;
	};

	VLCWrapperClass.prototype.pause = function() {
		console.log("VLCWrapperClass.", "pause()");
		if(this.vlc.playlist.isPlaying) {
			this.vlc.playlist.pause();
			return true;
		}
		return false;
	};

	VLCWrapperClass.prototype.stop = function() {
		console.log("VLCWrapperClass.", "stop()");
		if(this.vlc.playlist.isPlaying) {
			this.vlc.playlist.stop();
			return true;
		}
		return false;
	};

	VLCWrapperClass.prototype.play = function() {
		console.log("VLCWrapperClass.", "play()");
		if(!this.vlc.playlist.isPlaying && this.index !== -1) {
			this.vlc.playlist.play();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
			return true;
		}
		return false;
	};

	VLCWrapperClass.prototype.continuePlaying = function() {
		console.log("VLCWrapperClass.", "continuePlaying()");
		if(!this.isEmpty() && !this.isLast()) {
			this.index++;
			this.vlc.playlist.play();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
		} else {
			this.index = 0; /* 0 => loop playlist or clear() */
			this.triggerEventListeners("stopped");
		}
	};

	VLCWrapperClass.prototype.next = function() {
		console.log("VLCWrapperClass.", "next()");
		if(!this.isEmpty() && !this.isLast()) {
			this.index++;
			this.vlc.playlist.next();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
			return true;
		}
		return false;
	};

	VLCWrapperClass.prototype.previous = function() {
		console.log("VLCWrapperClass.", "previous()");
		if(!this.isEmpty() && !this.isFirst()) {
			this.index--;
			this.vlc.playlist.prev();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
			return true;
		}
		return false;
	};

	VLCWrapperClass.prototype.fullscreen = function(mode) {
		if(typeof mode === "boolean") {
			this.vlc.video.fullscreen = mode;
		}
		return this.vlc.video.fullscreen;
	};

	VLCWrapperClass.prototype.addEventListener = function(eventName, callback) {
		if(eventName === "stopped") {
			this.playlistEndReachedListeners.push(callback);
		}
	};

	VLCWrapperClass.prototype.removeEventListener = function(eventName, callback) {
		if(eventName === "stopped") {
			this.playlistEndReachedListeners = this.playlistEndReachedListeners.filter(function (c) {
				return c !== callback;
			});
		}
	};

	VLCWrapperClass.prototype.triggerEventListeners = function(eventName, data) {
		if(eventName === "stopped") {
			this.playlistEndReachedListeners.forEach(function(listener) {
				listener.call(this, data);
			}, this);
		}
	};

	/**
	 * Returns true if playlist is empty, false otherwise.
	 * @returns {boolean}
	 */
	VLCWrapperClass.prototype.isEmpty = function() {
		return this.count === 0;
	};

	/**
	 * Returns true if current playlist element is the first element in playlist, false otherwise.
	 * @returns {boolean}
	 */
	VLCWrapperClass.prototype.isFirst = function() {
		return this.index === 0;
	};

	/**
	 * Returns true if current playlist element is the last element in playlist, false otherwise.
	 * @returns {boolean}
	 */
	VLCWrapperClass.prototype.isLast = function() {
		return this.index + 1 === this.count;
	};

	return VLCWrapperClass;
})();
