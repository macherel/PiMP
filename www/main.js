const GALLERY_ID = "gallery";
const PLAYER_ID = "player";
var videos = [];
var currentPlayedVideo = undefined;

function configure(configuration) {
	console.log( "loading >configuration.json<", configuration);
	if(!!configuration) {	
		if(!!configuration.videos) {
			configuration.videos.forEach(configureVideo);
		} else {
			console.log('no video in configuration', configuration.videos);
		}
	} else {
		console.log('configuration empty', configuration);
	}	
}

function configureVideo(video) {
    console.log('configuring a video', video);
	videos[video.id] = video;

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

function start(id) {
	console.log('command >start< received', id);
	if(!!videos[id]) {
		currentPlayedVideo = videos[id];
		console.log('playing video', currentPlayedVideo);

		var player = document.getElementById(PLAYER_ID);
		showPlayer();
		player.playlist.stop();
		player.playlist.clear();
		player.playlist.add(currentPlayedVideo.url);
		/*
		 * When reach end of playlist
		 */
		player.playlist.play();
        player.input.position = 0.9; /* only for tests ; TO BE REMOVED !!!!!!!!!!!!!!!!! */
		/*
		 * video need to be played for changing fullscreen mode
		 */
		player.addEventListener("MediaPlayerEndReached", stop, false);
		player.video.fullscreen = true;
	} else {
		console.log('video does not exists', id);
	}
}

function stop() {
	var player = document.getElementById(PLAYER_ID);

	/*
	 * video need to be played for changing fullscreen mode
	 */
	player.video.fullscreen = false;
	//player.playlist.stop();
	player.playlist.clear();
	player.removeEventListener("MediaPlayerEndReached", stop, false);
    hidePlayer();
	currentPlayedVideo = undefined;
}

/*
 * Hide page content and show player
 */
function showPlayer() {
    for(let element of document.body.children) {
        if(element.id != PLAYER_ID) {
            element.setAttribute('data-display', element.style.display);
            element.style.display = 'none';
        }
    }
    document.getElementById(PLAYER_ID).style.display = 'block';
}

/*
 * Hide player and re-display page content
 */
function hidePlayer() {
    document.getElementById(PLAYER_ID).style.display = 'none';
    for(let element of document.body.children) {
        if(element.id != PLAYER_ID) {
            element.style.display = element.getAttribute('data-display');
        }
    }
}

/*
 * On document ready
 */
document.addEventListener("DOMContentLoaded", function(event) {

	// Reading configuration file (configuration.json)
    var httpRequest = new XMLHttpRequest();
    if (!!httpRequest) {
	    httpRequest.onreadystatechange = function() {
	        if (httpRequest.readyState == 4) {
	            if (httpRequest.status == 200) {
	                configure(JSON.parse(httpRequest.responseText));
	            } else {
	                console.log('error during configuration file retreiving')
	            }
	        }
	    };
	    httpRequest.open('GET', "/configuration.json", true);
	    httpRequest.send(null);
    } else {
    	console.log('unable to create ajax request to load configuration file')
    }

	// listen commands on websocket
	var socket = io();
	socket.on('start', start);
	socket.on('stop', stop);
	//socket.on('pause', pause);
});