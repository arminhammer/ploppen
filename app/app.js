'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler', [
	'node-teiler.list',
	'node-teiler.peerdiscovery',
	'node-teiler.filetransfer'

])
	.service('Peer', ['Config', function(Config) {

		var os = require('os');
		var dns = require('dns');

		var myPeer = {

			name: os.hostname(),
			address: getIPAddress(),
			port: Config.fileTransferPort()

		};

		//var addresses = getLocalAddresses();

		this.localAddresses = function() {

			var ifaces = os.networkInterfaces();
			var iList = [];

			for (var dev in ifaces) {
				//console.log("IFACE: " + ifaces[dev]);
				var alias = 0;
				ifaces[dev].forEach(function (details) {

					if (details.family == 'IPv4') {

						//console.log("DEETS: " + dev + (alias ? ':' + alias : ''), details.address);
						iList.push(details.address);
						++alias;

					}

				})

			}

			return iList;

		}

		this.myPeer = function() {

			return myPeer;

		};

		function getIPAddress() {

			dns.lookup(os.hostname(), function (err, add, fam) {

				console.log(add);
			});

		}

	}])

	.service('PeerList', [function() {

		var ioc = require('socket.io-client');

		var peers = {};

		peers['localhost'] = {
			name : 'localhost',
			address: '127.0.0.1',
			port: 9996,
			files : [
				{ name : "File 1" },
				{ name : "File 2" }
			]
		};

		this.list = function() {

			return peers;

		};

		this.count = function() {

			var count = 0;

			for (var key in peers) {

				if (peers.hasOwnProperty(key)) {

					count++;

				}
			}

			return count;

		};

		this.keys = function() {

			var keys = [];

			for (var key in peers) {

				if (peers.hasOwnProperty(key)) {

					keys.push(key);

				}
			}

			return keys;

		};

		this.print = function() {

			//console.log("Printing peer list:");

			for (var key in peers) {

				if (peers.hasOwnProperty(key)) {

					//console.log(peers[key].name);
					//console.log(peers[key].socket);
				}
			}

		};

		this.contains = function(peer) {

			return peers.hasOwnProperty(peer.name);

		};

		this.addPeer = function(peer, callback) {

			var added = false;

			if(!this.contains(peer)) {

                peers[peer.name] = peer;

				this.peers[peer.name].socket = ioc.connect('http://' + peer.address + ':' + peer.port);
                console.log("Connecting to http://" + peer.address + ':' + peer.port);

                this.peers[peer.name].socket.emit('private message', { peer: peer.name, message: "Hi World!"});

                this.peers[peer.name].socket.on('news', function (data) {

					console.log(data);
                    this.peers[peer.name].socket.emit('my other event', { my: 'data' });

				});

                this.peers[peer.name].socket.on('file', function(data) {
                   console.log("File received: " + data.filename);
                });

                this.peers[peer.name].socket.on('disconnect', function() {
					console.log(this.peers[peer.name].socket + "disconnected.");
				});

				//console.log("peer.socket: " + this.peers[peer.name].socket);


				//console.log(peers[peer.name].name + " added to peers");

				added = true;

			}
			else{

				console.log(peer.name + " is already in the list!");

			}

			this.print();

			callback(added);

		}

	}])
	.service('Config', [function() {

		var multicastAddress = '224.0.0.114';
		var multicastPort = 8886;

		var fileTransferPort = 9996;

		this.multicastAddress = function () {
			return multicastAddress;
		};

		this.multicastPort = function () {
			return multicastPort;
		};

		this.fileTransferPort = function() {
			return fileTransferPort;
		}

	}]);

