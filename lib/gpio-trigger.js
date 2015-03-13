"use strict";

var util = require("util");
var EventEmitter = require("events").EventEmitter;
var gpio = require("gpio");
var config = require("./config")("gpio");

function onReady() {
	console.log("GPIO" + this.headerNum + " ready.");
}

function onChange(key, value) {
	console.log("GPIO" + this.button.headerNum + "(" + key + ") changed : " + value);
	if(value) {
		this.trigger.emit("trigger", key);
	}
}

function GpioTrigger() {
	var trigger = this;
	EventEmitter.call(this);

	for(var key in config) {
		var pin = config[key];
		var button = gpio.export(pin, {
			direction: "in",
			ready: onReady
		});
		button.on("change", onChange.bind({
			button: button,
			trigger: trigger
		}, key));
	}
}

util.inherits(GpioTrigger, EventEmitter);

module.exports = new GpioTrigger();
