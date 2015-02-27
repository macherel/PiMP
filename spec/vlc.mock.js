let VLCMock = (function(){
	"use strict";

	function VLCMockClass() {
		this.nodeName = "EMBED";
	}

	VLCMockClass.prototype.addEventListener = function() {
		console.log("addEventListener");
	};

	VLCMockClass.prototype.removeEventListener = function() {
		console.log("removeEventListener");
	};

	function Playlist() {

	}

	Playlist.prototype.clear = function() {
		console.log("clear");
	};

	VLCMockClass.prototype.playlist = new Playlist();

	return VLCMockClass;
})();