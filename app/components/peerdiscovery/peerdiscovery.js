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
                server.setMulticastTTL(10);
                server.setMulticastLoopback(false);

            });

            server.on('listening', function () {

                var address = server.address();
                console.log('Peer Discovery Listener listening on ' + address.address + ":" + address.port);

            });

            server.on('message', function (messageJSON, remote) {

                //console.log("MESSAGE: " + remote.address + ':' + remote.port +' - ' + messageJSON);

                if(Peer.localAddr().indexOf(remote.address) < 0) {

                    var message = JSON.parse(messageJSON);
                    var peer = message.peer;
                    peer.address = remote.address;

                    PeerList.addPeer(peer, function (added) {

                        if (added) {
                            //console.log("Peer " + peer.name + " was added.");
                            $rootScope.$broadcast('peerList.update');
                        }
                        else {
                            //console.log("Peer " + peer + " was not added.");
                        }

                    });
                }

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

        function broadCastMessage() {

            var client = dgram.createSocket('udp4');

            var messageJSON = genMessage();

            client.send(messageJSON, 0, messageJSON.length, Config.multicastPort(), Config.multicastAddress(), function(err, bytes) {

                if (err) throw err;
                //console.log("UDP message: " + messageJSON + " sent to " + Config.multicastAddress() +":"+ Config.multicastPort());
                client.close();

            })

        }

        this.start = function(callback) {

            setInterval(broadCastMessage, 5000);

            callback();

        }

    }]);