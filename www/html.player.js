/**
 * Created by Pihemde on 18/02/15.
 */
"use strict";

(function() {
	window.addEventListener("pimp:begin", function (event) {
		console.log("html.player: pimp:begin [to be implemented]", event);
	});

	window.addEventListener("pimp:configure", function (event) {
		console.log("html.player: pimp:configure [to be implemented]", event);
	});

	window.addEventListener("pimp:play", function (event) {
		console.log("html.player: pimp:play [to be implemented]", event);
	});

	window.addEventListener("pimp:pause", function (event) {
		console.log("html.player: pimp:pause [to be implemented]", event);
	});

	window.addEventListener("pimp:stop", function (event) {
		console.log("html.player: pimp:stop [to be implemented]", event);
	});

	window.addEventListener("pimp:stopped", function (event) {
		console.log("html.player: pimp:stopped [to be implemented]", event);
	});

	window.addEventListener("pimp:end", function (event) {
		console.log("html.player: pimp:end [to be implemented]", event);
	});
}());
