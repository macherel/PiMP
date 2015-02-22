var fs = require('fs');

var configurationFile = 'data/configuration.json';

var configuration = JSON.parse(
    fs.readFileSync(configurationFile)
);

function getConfig(type) {
	var config = {};

	for(var i=0; i<configuration.videos.length; i++) {
		var video = configuration.videos[i];
		var triggerConfig = video.trigger[type];
		if(!!triggerConfig) config[video.id] = triggerConfig;
	}

	return config;
}

module.exports = getConfig;
