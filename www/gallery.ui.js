/**
 * Created by Pihemde on 18/02/15.
 */
"use strict";

const GALLERY_ID = "gallery";

window.addEventListener('pimp:begin', function (event) {
	if(!document.getElementById('GALLERY_ID')) {
		var gallery = document.createElement('div');
		gallery.id = GALLERY_ID;
		document.appendChild(gallery);
		// Backup css display property value, after all CSS applied
		document.getElementById(GALLERY_ID).setAttribute('data-display', document.getElementById(GALLERY_ID).style.display);
	}
});

window.addEventListener('pimp:configure', function (event) {
	console.log( "loading configuration", configuration);
	var configuration = event.detail;
	if(!!configuration) {
		if(!!configuration.videos) {
			configuration.videos.forEach(configureVideo);
		} else {
			console.log('no video in configuration', configuration.videos);
		}
	} else {
		console.log('configuration empty', configuration);
	}
});

function configureVideo(video) {
	console.log('configuring a video', video);
	var title = document.createElement('h1');
	title.appendChild(document.createTextNode(video.title));
	var description = document.createElement('p');
	description.appendChild(document.createTextNode(video.description));
	var thumbnail = document.createElement('img');
	thumbnail.src = video.thumbnail;
	var container = document.createElement('div');
	container.id = video.id;
	container.appendChild(title);
	container.appendChild(description);
	container.appendChild(thumbnail);
	document.getElementById(GALLERY_ID).appendChild(container);
}

window.addEventListener('pimp:play', function (event) {
	// Hide gallery
	document.getElementById(GALLERY_ID).style.display = 'none';
});

window.addEventListener('pimp:stop', function () {
	//
});

window.addEventListener('pimp:stopped', function (event) {
	// Restore css display property value
	document.getElementById(GALLERY_ID).style.display = document.getElementById(GALLERY_ID).getAttribute('data-display');
});

window.addEventListener('pimp:end', function (event) {
	//
});