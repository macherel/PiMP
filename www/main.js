var socket = io();

socket.on('start', function (data) {
	console.log(data);
});
