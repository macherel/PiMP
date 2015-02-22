/**
 * Created by Pihemde on 22/02/15.
 */

let Playlist = (function(){
	"use strict";
	const DEBUG = true;

	function PlaylistClass(videos, vlc) {
		console.log("new Playlist()", videos, vlc);
		this.videos = videos;
		this.vlc = vlc;
		this.vlc.addEventListener("MediaPlayerEndReached", this.continuePlaying.bind(this), false);
		this.clear();
		this.playlistEndReachedListeners = [];
	}

	PlaylistClass.prototype.clear = function() {
		console.log("Playlist.", "clear()");
		this.vlc.playlist.clear();
		this.playlist = [];
		this.current = -1;
		this.videos.forEach(function (video) {
			delete video.vlcId;
		});
	};

	PlaylistClass.prototype.add = function(id) {
		console.log("Playlist.", "add()", id);
		if(typeof id === "string" && this.videos[id]) {
			this.clear();
			this.videos[id].vlcId = this.vlc.playlist.add(this.videos[id].url, this.videos[id].name || "");
			this.playlist.push(this.videos[id]);
			this.current = 0;
			return true;
		}
		console.error("param is not defined or not s string", id);
		return false;
	};

	PlaylistClass.prototype.addAll = function(videoIds) {
		console.log("Playlist.", "addAll()", videoIds);
		if(typeof videoIds !== "undefined" && Array.isArray(videoIds)) {
			this.clear();
			videoIds.forEach(function(id) {
				if (this.videos[id]) {
					this.videos[id].vlcId = this.vlc.playlist.add(this.videos[id].url, this.videos[id].name || "");
					this.playlist.push(this.videos[id]);
				} else {
					console.error("video does not exists", id);
				}
			}, this);
			if(this.playlist.length) {
				this.current = 0;
			}
			return true;
		}
		console.error("param is not defined or not an array", videoIds);
		return false;
	};

	PlaylistClass.prototype.pause = function() {
		console.log("Playlist.", "pause()");
		if(this.vlc.playlist.isPlaying) {
			this.vlc.playlist.pause();
			return true;
		}
		return false;
	};

	PlaylistClass.prototype.stop = function() {
		console.log("Playlist.", "stop()");
		if(this.vlc.playlist.isPlaying) {
			this.vlc.playlist.stop();
			return true;
		}
		return false;
	};

	PlaylistClass.prototype.play = function() {
		console.log("Playlist.", "play()");
		if(!this.vlc.playlist.isPlaying && this.current !== -1) {
			this.vlc.playlist.play();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
			return true;
		}
		return false;
	};

	PlaylistClass.prototype.continuePlaying = function() {
		console.log("Playlist.", "continuePlaying()");
		if(this.current !== -1 && (this.current + 1) !== this.playlist.length) {
			this.current++;
			this.vlc.playlist.play();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
		} else {
			this.current = 0; /* 0 => loop playlist or clear() */
			this.playlistEndReachedListeners.forEach(function(listener) {
				listener.call(this);
			}, this);
		}
	};

	PlaylistClass.prototype.next = function() {
		console.log("Playlist.", "next()");
		if(this.current !== -1 && (this.current + 1) !== this.playlist.length) {
			this.current++;
			this.vlc.playlist.next();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
			return true;
		}
		return false;
	};

	PlaylistClass.prototype.previous = function() {
		console.log("Playlist.", "previous()");
		if(this.current !== -1 && this.current !== 0) { // ======>(this.current > 0) yes, I know
			this.current--;
			this.vlc.playlist.prev();
			if(DEBUG) {
				this.vlc.input.position = 0.6;
				this.vlc.audio.mute = true;
			}
			return true;
		}
		return false;
	};

	PlaylistClass.prototype.addEventListener = function(eventName, callback) {
		if(eventName === "playlistEndReached") {
			this.playlistEndReachedListeners.push(callback);
		}
	};

	PlaylistClass.prototype.removeEventListener = function(eventName, callback) {
		if(eventName === "playlistEndReached") {
			this.playlistEndReachedListeners = this.playlistEndReachedListeners.filter(function (c) {
				return c !== callback;
			});
		}
	};

	return PlaylistClass;
})();
