/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.peerdiscovery', [])
    .service('PeerDiscoveryListener', ['$rootScope', 'Peer', 'Config', 'PeerList', function($rootScope, Peer, Config, PeerList) {

        var dgram = require('dgram');
        var server;
		var bServer;

        this.start = function(callback) {

            server = dgram.createSocket('udp4');

            server.bind(Config.multicastPort(), function() {

                server.addMembership(Config.multicastAddress());
                server.setBroadcast(true);
                server.setMulticastTTL(10);
                server.setMulticastLoopback(true);

            });

            server.on('listening', function () {

                var address = server.address();
                console.log('Peer Discovery Listener listening on ' + address.address + ":" + address.port);

            });

            server.on('message', function (messageJSON, remote) {

                console.log("MULTI MESSAGE: " + remote.address + ':' + remote.port +' - ' + messageJSON);

                if(Peer.localAddr().indexOf(remote.address) < 0) {

                    var message = JSON.parse(messageJSON);
                    var peer = message.peer;
                    peer.address = remote.address;

                    PeerList.addPeer(peer, function (added) {

                        if (added) {
                            console.log("Peer " + peer.name + " was added.");
                            $rootScope.$broadcast('peerList.update');
                        }
                        else {
                            console.log("Peer " + peer + " was not added.");
                        }

                    });
                }

            });


			bServer = dgram.createSocket('udp4');

			bServer.bind(Config.multicastPort(), function() {

				//server.addMembership(Config.multicastAddress());
				bServer.setBroadcast(true);
				//server.setMulticastTTL(10);
				//server.setMulticastLoopback(true);

			});

			bServer.on('listening', function () {

				var address = bServer.address();
				console.log('Peer Discovery Listener listening on ' + address.address + ":" + address.port);

			});

			bServer.on('message', function (messageJSON, remote) {

				console.log("BROADCAST MESSAGE: " + remote.address + ':' + remote.port +' - ' + messageJSON);

				if(Peer.localAddr().indexOf(remote.address) < 0) {

					var message = JSON.parse(messageJSON);
					var peer = message.peer;
					peer.address = remote.address;

					PeerList.addPeer(peer, function (added) {

						if (added) {
							console.log("Peer " + peer.name + " was added.");
							$rootScope.$broadcast('peerList.update');
						}
						else {
							console.log("Peer " + peer + " was not added.");
						}

					});
				}

			});


            callback();

        };

        this.stop = function(callback) {

            server.dropMembership(Config.multicastAddress());
            server.close();

			bServer.close();

            callback();

        };

    }])
    .service('PeerDiscoveryBroadcaster', ['Peer', 'Config', function(Peer, Config) {

        var dgram = require('dgram');

        function genMessage() {
            var body = {
                timestamp: Date.now(),
                peer: {
                    name: Peer.myPeer().name,
                    address: Peer.myPeer().address,
                    port: Peer.myPeer().port
                }
            };
            return new Buffer(JSON.stringify(body));
        }

        function broadCastMessage(address) {

			var messageJSON = genMessage();

            var client = dgram.createSocket('udp4');
			var localAddress = Peer.ipAddress();
			console.log(localAddress);
			client.bind(localAddress);
			client.on("listening", function () {
				client.setBroadcast(true);
				client.send(messageJSON, 0, messageJSON.length, Config.multicastPort(), address, function (err, bytes) {

					if (err) throw err;
					console.log("UDP message: " + messageJSON + " sent to " + address + ":" + Config.multicastPort());
					client.close();

				})
			});

        }

        this.start = function(callback) {

            setInterval(function(){broadCastMessage(Config.multicastAddress())}, 5000);

			setInterval(function(){broadCastMessage(Peer.broadcastAddr())}, 6000);

            callback();

        }

    }]);