"use strict";

/**
 * Dispatch browser Event with name "pimp:<name argument>".
 * If args isn't undefined a CustomEvent with "args" argument for detail is used.
 * @param name suffix event name. "pimp:<name argument>"
 * @param args (optional) custom event detail if set
 */
function sendEvent(name, args) {
	let event;
	let eventName = "pimp:" + name;
	if(typeof args !== "undefined") {
		event = new CustomEvent(eventName, {detail: args});
	} else {
		event = new Event(eventName);
	}
	window.dispatchEvent(event);
}

/**
 * Bind sendEvent with parameters.
 * If "args" is undefined a proxy is set and is first arg will be used for sendEvent 2nd arg
 * @param name use for sendEvent name argument
 * @param args (optional) use for sendEvent args argument if set
 */
function bindEvent(name, args) {
	if(typeof args !== "undefined") {
		return sendEvent.bind(null, name, args);
	} else {
		return function(event) {
			sendEvent(name, event);
		};
	}
}

/**
 * Retrieve configuration file (configuration.json), read it and send "videos" part by "configure" event
 */
function retrieveConfiguration() {
	var httpRequest = new XMLHttpRequest();
	if (httpRequest) {
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					var configuration = JSON.parse(httpRequest.responseText);
					sendEvent("configure", configuration);
				} else {
					console.error("error during configuration file retrieving");
				}
			}
		};
		httpRequest.open("GET", "/configuration.json", true);
		httpRequest.send(null);
	} else {
		console.error("unable to create ajax request to load configuration file");
	}
}

/**
 * Browser start (DOM load)
 */
document.addEventListener("DOMContentLoaded", function(event) {
	// Browser is ready and DOM is loaded, we can send "pimp:begin"
	sendEvent("begin", event);

	// Retrieve configuration and send event "configure"
	retrieveConfiguration();

	// listen commands on websocket
	var socket = io();
	socket.on("load", bindEvent("load"));
	socket.on("play", bindEvent("play"));
	socket.on("next", bindEvent("next"));
	socket.on("previous", bindEvent("previous"));
	socket.on("pause", bindEvent("pause", undefined));
	socket.on("stop", bindEvent("stop", undefined));
});

/**
 * Browser is about to close ; send "end" event
 */
document.addEventListener("unload", bindEvent("end"));
