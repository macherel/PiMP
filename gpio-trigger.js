var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var wpi          = require('wiring-pi');

function GpioTrigger() {
	var trigger = this;
	EventEmitter.call(this);

	wpi.setup('wpi');
	wpi.pinMode(7, wpi.INPUT);
	wpi.pullUpDnControl(7, wpi.PUD_UP);
	wpi.wiringPiISR(7, wpi.INT_EDGE_FALLING, function(delta) {
		console.log('Pin 7 changed to LOW (', delta, ')');
	});
}

util.inherits(GpioTrigger, EventEmitter);

module.exports = new GpioTrigger;
