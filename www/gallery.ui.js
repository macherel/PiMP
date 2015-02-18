/**
 * Created by Pihemde on 18/02/15.
 */
"use strict";

(function() {
	const GALLERY_ID = "gallery";

	window.addEventListener("pimp:begin", function(event) {
		if (!document.getElementById("GALLERY_ID")) {
			let gallery = document.createElement("div");
			gallery.id = GALLERY_ID;
			document.appendChild(gallery);
			// Backup css display property value, after all CSS applied
			document.getElementById(GALLERY_ID).setAttribute("data-display", document.getElementById(GALLERY_ID).style.display);
		}
	});

	window.addEventListener("pimp:configure", function(event) {
		let configuration = event.detail;
		console.log("loading configuration", configuration);
		if (configuration) {
			if (configuration.videos) {
				configuration.videos.forEach(function(video) {
					console.log("configuring a video", video);
					let title = document.createElement("h1");
					title.appendChild(document.createTextNode(video.title));
					let description = document.createElement("p");
					description.appendChild(document.createTextNode(video.description));
					let thumbnail = document.createElement("img");
					thumbnail.src = video.thumbnail;
					let container = document.createElement("div");
					container.id = video.id;
					container.appendChild(title);
					container.appendChild(description);
					container.appendChild(thumbnail);
					document.getElementById(GALLERY_ID).appendChild(container);
				});
			} else {
				console.log("no video in configuration", configuration.videos);
			}
		} else {
			console.log("configuration empty", configuration);
		}
	});

	window.addEventListener("pimp:play", function (event) {
		// Hide gallery
		document.getElementById(GALLERY_ID).style.display = "none";
	});

	window.addEventListener("pimp:stop", function() {
		//
	});

	window.addEventListener("pimp:stopped", function(event) {
		// Restore css display property value
		document.getElementById(GALLERY_ID).style.display = document.getElementById(GALLERY_ID).getAttribute("data-display");
	});

	window.addEventListener("pimp:end", function(event) {
		//
	});
})();
