/**
 * Created by Pihemde on 18/02/15.
 */
"use strict";

(function() {
	const GALLERY_ID = "gallery";
	let g;

	function onClick(event) {
		let id = event.target.parentNode.id;
		window.dispatchEvent(new CustomEvent("pimp:play", {detail:id}));
	}

	/**
	 *
	 */
	window.addEventListener("pimp:begin", function() {
		if (!document.getElementById(GALLERY_ID)) {
			let galleryTag = document.createElement("div");
			galleryTag.id = GALLERY_ID;
			document.body.appendChild(galleryTag);
		}
		g = document.getElementById(GALLERY_ID);

		// Backup css display property value, after all CSS applied
		g.setAttribute("data-display", g.style.display);
	});

	/**
	 *
	 */
	window.addEventListener("pimp:configure", function({detail: configuration}) {
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
					thumbnail.onclick = onClick;
					let container = document.createElement("div");
					container.id = video.id;
					container.appendChild(title);
					container.appendChild(description);
					container.appendChild(thumbnail);
					document.getElementById(GALLERY_ID).appendChild(container);
				});
			} else {
				console.warn("no video in configuration", configuration.videos);
			}
		} else {
			console.warn("configuration empty", configuration);
		}
	});

	/**
	 * Hide gallery
	 */
	window.addEventListener("pimp:play", function () {
		g.style.display = "none";
	});

	/**
	 * (Re)Display gallery
	 */
	window.addEventListener("pimp:stopped", function () {
		// Restore css display property value
		g.style.display = g.getAttribute("data-display");
	});
})();
