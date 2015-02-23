//"use strict";

var util = require("util");
var EventEmitter = require("events").EventEmitter;
var config = require("./config")("keyboard");

function KeyboardTrigger() {
	var trigger = this;
	EventEmitter.call(this);
	var stdin = process.openStdin();
	stdin.setRawMode(true);
	stdin.on("data", function(chunk) {
		if(chunk == "\3") { // Don't use octal: '\3'. Use '\u....' instead
			process.exit(); // Don't use process.exit(); throw an error instead
		}
		for(var id in config) {
			var key = config[id];
			if(chunk == key) {
				trigger.emit("trigger", id);
			}
		}
	});
}

util.inherits(KeyboardTrigger, EventEmitter);

module.exports = new KeyboardTrigger();
