var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var gpio         = require('gpio');
var config       = require('./config')('gpio');

function GpioTrigger() {
	var trigger = this;
	EventEmitter.call(this);

	for(var key in config) {
		var pin = config[key];
		var tmp = gpio.export(pin, {
			direction: 'in',
			ready: function() {
				console.log('GPIO' + this.headerNum + ' ready.')
			}
		});
		tmp.on('change', (function(value) {
			//console.log('GPIO' + this.headerNum + " changed : " + value)
			if(!!value) trigger.emit('trigger', this);
		}).bind(key));
	}
}

util.inherits(GpioTrigger, EventEmitter);

module.exports = new GpioTrigger;
