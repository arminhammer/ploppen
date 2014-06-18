/**
 * Main.js
 */

var IP_PORT = 33332;

// Define the class for networked peers
function Peer(name) {

	var _name = name;

	return {

		// Define a sync function
		getName : function() {
			return _name;
		},

		setName : function(newName) {
			_name = newName;
		},

		// name : peerName,

		// Define a function with async internals
		slowGreet : function slowGreet() {
			setTimeout(function() {
				console.log(message);
			}, 1000);
		}

	};
}

var peers = {};

var peer = Peer("Person1");

if (peers[peer.getName()] == null) {
	console.log("Totally empty!");
} else {
	console.log("Peer is there, it is " + peer.getName());
}

peers[peer.getName()] = peer;

if (peers[peer.getName()] == null) {
	console.log("Totally empty!");
} else {
	console.log("Peer is there, it is " + peer.getName());
}

var http = require('http'), fs = require('fs'),
// NEVER use a Sync function except at start-up!
index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/html'
	});
	res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendTime() {
	io.sockets.emit('time', {
		time : new Date().toJSON()
	});
}

// Send current time every 10 secs
setInterval(sendTime, 10000);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
	socket.emit('welcome', {
		message : 'Welcome!'
	});

	socket.on('I am a client', console.log);
});

console.log("Opening up listener on port " + IP_PORT);
app.listen(IP_PORT);

// console.log("Here is " + peer.getName());
// peer.setName("Person2");
// console.log("Here is 2 " + peer.getName());
// console.log("Peer peer's name is " + peer.name);
