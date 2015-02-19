var util         = require('util');
var EventEmitter = require('events').EventEmitter;

function KeyboardTrigger() {
	var trigger = this;
	EventEmitter.call(this);
	var stdin = process.openStdin();
	stdin.setRawMode(true);
	stdin.on('data', function(chunk) {
		if(chunk=='\3') process.exit();
		else if(chunk=='a') trigger.emit("trigger", 1);
		else if(chunk=='z') trigger.emit("trigger", 2);
		else if(chunk=='e') trigger.emit("trigger", 3);
	});
}

util.inherits(KeyboardTrigger, EventEmitter);

module.exports = new KeyboardTrigger;
