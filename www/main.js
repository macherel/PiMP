"use strict";

document.addEventListener("DOMContentLoaded", function(event) {

	window.dispatchEvent(new Event("pimp:begin"));

	// Reading configuration file (configuration.json)
	var httpRequest = new XMLHttpRequest();
	if (httpRequest) {
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					var configuration = JSON.parse(httpRequest.responseText);
					window.dispatchEvent(new CustomEvent("pimp:configure", { detail: configuration }));
				} else {
					console.log("error during configuration file retrieving");
				}
			}
		};
		httpRequest.open("GET", "/configuration.json", true);
		httpRequest.send(null);
	} else {
		console.log("unable to create ajax request to load configuration file");
	}

	// listen commands on websocket
	var socket = io();
	socket.on("start", function(id) {
		window.dispatchEvent(new CustomEvent("pimp:play", {
			detail: id,
			cancelable: true
		}));
	});
	socket.on("stop", function() {
		window.dispatchEvent(new Event("pimp:stop"));
	});
});
