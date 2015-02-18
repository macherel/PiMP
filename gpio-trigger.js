var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var gpio         = require('gpio');

function GpioTrigger() {
	var trigger = this;
	EventEmitter.call(this);

	var pins = [ 17, 27, 22 ];
	var gpios = [];

	for(var i=0; i<pins.length; i++) {
		var pin = pins[i];
		var tmp = gpio.export(pin, {
			direction: 'in',
			ready: function() {
				console.log('GPIO' + this.headerNum + ' ready.')
			}
		});
		tmp.on('change', function(value) {
			console.log('GPIO' + this.headerNum + " changed : " + value)
			if(!!value) trigger.emit('trigger', pins.indexOf(this.headerNum)+1);
		});
		gpios.push(tmp);
	}
}

util.inherits(GpioTrigger, EventEmitter);

module.exports = new GpioTrigger;
