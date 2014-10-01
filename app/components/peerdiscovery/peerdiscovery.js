/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.peerdiscovery', [])
    .service('PeerDiscoveryListener', ['$rootScope', 'Peer', 'Config', 'PeerList', function($rootScope, Peer, Config, PeerList) {

        var dgram = require('dgram');
        var server;

        this.start = function(callback) {

            server = dgram.createSocket('udp4');

            server.bind(Config.multicastPort(), function() {

                server.addMembership(Config.multicastAddress());
                server.setBroadcast(true);
                server.setMulticastTTL(5);
                server.setMulticastLoopback(false);

            });

            server.on('listening', function () {

                var address = server.address();
                console.log('Peer Discovery Listener listening on ' + address.address + ":" + address.port);

            });

            server.on('message', function (messageJSON, remote) {

                console.log(remote.multicastAddress + ':' + remote.multicastPort +' - ' + messageJSON);
                var message = JSON.parse(messageJSON);
                var peer = message.peer;
                peer.address = remote.address;

                PeerList.addPeer(peer, function(added) {

                    if(added) {
                        console.log("Peer " + peer.name + " was added.");
                        $rootScope.$broadcast('update peers');
                    }
                    else {
                        console.log("Peer " + peer + " was not added");
                    }

                });


            });

            callback();

        };

        this.stop = function(callback) {

            server.dropMembership(Config.multicastAddress());
            server.close();

            callback();

        };

    }])
    .service('PeerDiscoveryBroadcaster', ['Peer', 'Config', function(Peer, Config) {

        var dgram = require('dgram');
        var message = {
            timestamp: Date.now(),
            peer: Peer.myPeer()
        };

        var messageJSON = new Buffer(JSON.stringify(message));

        function broadCastMessage() {

            var client = dgram.createSocket('udp4');

            client.send(messageJSON, 0, messageJSON.length, Config.multicastPort(), Config.multicastAddress(), function(err, bytes) {

                if (err) throw err;
                console.log("UDP message: " + messageJSON + " sent to " + Config.multicastAddress() +":"+ Config.multicastPort());
                client.close();

            })

        }

        this.start = function(callback) {

            setInterval(broadCastMessage, 3000);

            callback();

        }

    }]);