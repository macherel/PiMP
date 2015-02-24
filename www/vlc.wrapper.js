/**
 * Created by Pihemde on 22/02/15.
 */

let VLCWrapper = (function(){
	"use strict";
	const DEBUG = true;
	const STATES = {
		"IDLE": 0,
		"OPENING": 1,
		"BUFFERING": 2,
		"PLAYING": 3,
		"PAUSED": 4,
		"STOPPING": 5,
		"ENDED": 6,
		"ERROR": 7
	};

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
			this.vlc = this.createTag(vlc);
		} else if(vlc.nodeName === "EMBED") {
			this.vlc = vlc;
			this.vlc.playlist.clear();
		} else {
			throw new Error("invalid argument");
		}

		this.playlistEndReachedListeners = [];
		this.vlc.addEventListener("MediaPlayerEndReached", this.continuePlaying.bind(this), false);
		this.vlc.addEventListener("MediaPlayerStopped", this.triggerEventListeners.bind(this, "stopped"), false);
		this.vlc.addEventListener("MediaPlayerEncounteredError", onVLCError, false);

		this.videos = [];
		this.index = -1;
	}

	/**
	 * Add an <embed> tag in page body.
	 * @param id tag id attribute
	 * @returns {HTMLElement} embed element created
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

	/**
	 * Empty playlist
	 */
	VLCWrapperClass.prototype.clear = function() {
		console.log("VLCWrapperClass.", "clear()");
		this.vlc.playlist.clear();
		this.index = -1;
	};

	/**
	 * Add a video to playlist according to id from definitions
	 * @param id video id
	 * @returns {boolean} true if video added, otherwise false
	 */
	VLCWrapperClass.prototype.add = function(id) {
		console.log("VLCWrapperClass.", "add()", id);
		if(typeof id === "string" && this.videos[id]) {
			this.clear();
			this.vlc.playlist.add(this.videos[id].url, this.videos[id].name || "");
			this.index = 0;
			return true;
		}
		console.error("param is not defined or not s string", id);
		return false;
	};

	/**
	 * Add videos to playlist according to their ids from definitions
	 * @param videoIds
	 * @returns {boolean} true if videos added, otherwise false
	 */
	VLCWrapperClass.prototype.addAll = function(videoIds) {
		console.log("VLCWrapperClass.", "addAll()", videoIds);
		if(typeof videoIds !== "undefined" && Array.isArray(videoIds)) {
			this.clear();
			videoIds.forEach(function(id) {
				if (this.videos[id]) {
					this.vlc.playlist.add(this.videos[id].url, this.videos[id].name || "");
				} else {
					console.error("video does not exists", id);
				}
			}, this);
			if(this.vlc.playlist.items.count) {
				this.index = 0;
			}
			return true;
		}
		console.error("param is not defined or not an array", videoIds);
		return false;
	};

	/**
	 * Pause video and return true or return false if can't
	 * @returns {boolean}
	 */
	VLCWrapperClass.prototype.pause = function() {
		console.log("VLCWrapperClass.", "pause()");
		if(this.vlc.playlist.isPlaying) {
			this.vlc.playlist.pause();
			return true;
		}
		return false;
	};

	/**
	 * Stop video and return true or return false if can't
	 * @returns {boolean}
	 */
	VLCWrapperClass.prototype.stop = function() {
		console.log("VLCWrapperClass.", "stop()");
		if(this.inStates(STATES.OPENING, STATES.BUFFERING, STATES.PLAYING, STATES.PAUSED)) {
			this.vlc.playlist.stop();
			return true;
		}
		return false;
	};

	/**
	 * Play current or first playlist video and return true or return false if a video is already currently playing or playlist is empty
	 * @returns {boolean}
	 */
	VLCWrapperClass.prototype.play = function() {
		console.log("VLCWrapperClass.", "play()");
		if(!this.vlc.playlist.isPlaying && !this.isEmpty()) {
			this.vlc.playlist.play();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
			return true;
		}
		return false;
	};

	/**
	 * INTERNAL FUNCTION. DON'T CALL IT !
	 */
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

	/**
	 * Jump to the next playlist video and return true or return false if playlist is empty or current video is the last video of the playlist
	 * @returns {boolean}
	 */
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

	/**
	 * Jump to the previous playlist video and return true or return false if playlist is empty or current video is the first video of the playlist
	 * @returns {boolean}
	 */
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

	/**
	 * Change fullscreen state according to parameter and return new fullscreen state
	 * @param mode true for fullscreen, false otherwise
	 * @returns {boolean} return true for fullscreen, false otherwise
	 */
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

	/**
	 * INTERNAL FUNCTION. DON'T CALL IT !
	 */
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
		return this.vlc.playlist.items.count === 0;
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
		return this.index + 1 === this.vlc.playlist.items.count;
	};

	/**
	 * Return true if current vlc.input.state is include in states in parameters
	 * @param states somes states to check
	 * @returns {boolean}
	 */
	VLCWrapperClass.prototype.inStates = function(...states) {
		return states.indexOf(this.vlc.input.state) != -1;
	};

	return VLCWrapperClass;
})();
