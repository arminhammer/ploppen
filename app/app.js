'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler', [

    'node-teiler.list'

])
    .service('Peer', [function() {

        var myPeer = {
            name: "localhost",
            ipAddress: "127.0.0.1"
        };

        this.myPeer = function() {

            return myPeer;

        };

    }])
    .service('PeerList', [function() {

        var peers = {};

        peers["Peer 1"] = {
            name : "Peer 1",
            files : [
                { name : "File 1" },
                { name : "File 2" }
            ]
        };

        peers["Peer 2"] = {
            name : "Peer 2",
            files : [
                { name : "File 3" },
                { name : "File 4" }
            ]
        };

        peers["Peer 3"] = {
            name : "Peer 3",
            files : []
        };

        this.list = function() {

            return peers;

        };

        this.contains = function(peer) {

            return peers.hasOwnProperty(peer.name);

        };

        this.addPeer = function(peer) {

            if(!this.contains(peer)) {
                peers[peer.name] = peer;
                console.log(peers[peer.name].name + " added to peers");
            }
            else{
                console.log(peer.name + " is already in the list!");
            }

        }

    }])
    .service('PeerDiscoveryConfig', [function() {

        var address = '224.0.0.114';
        var port = 8088;

        this.address = function() {
            return address;
        };

        this.port = function() {
            return port;
        }

    }])
    .service('PeerDiscoveryListener', ['$rootScope', 'Peer', 'PeerDiscoveryConfig', 'PeerList', function($rootScope, Peer, PeerDiscoveryConfig, PeerList) {

        var dgram = require('dgram');
        var server;

        this.start = function(callback) {

            server = dgram.createSocket('udp4');

            server.bind(PeerDiscoveryConfig.port(), function() {

                server.addMembership(PeerDiscoveryConfig.address());
                server.setBroadcast(true);
                server.setMulticastTTL(5);
                server.setMulticastLoopback(false);

            });

            server.on('listening', function () {

                var address = server.address();
                console.log('Peer Discovery Listener listening on ' + address.address + ":" + address.port);

            });

            server.on('message', function (messageJSON, remote) {

                console.log(remote.address + ':' + remote.port +' - ' + messageJSON);
                var message = JSON.parse(messageJSON);
                PeerList.addPeer(message.peer);
                $rootScope.$broadcast('update peers');

            });

            callback();

        };

        this.stop = function(callback) {

            server.dropMembership(PeerDiscoveryConfig.address());
            server.close();

            callback();

        };

    }])
    .service('PeerDiscoveryBroadcaster', ['Peer', 'PeerDiscoveryConfig', function(Peer, PeerDiscoveryConfig) {

        var dgram = require('dgram');
        var message = {
            timestamp: Date.now(),
            peer: Peer.myPeer()
        }

        var messageJSON = new Buffer(JSON.stringify(message));

        function broadCastMessage() {

            var client = dgram.createSocket('udp4');

            client.send(messageJSON, 0, messageJSON.length, PeerDiscoveryConfig.port(), PeerDiscoveryConfig.address(), function(err, bytes) {

                if (err) throw err;
                console.log("UDP message: " + messageJSON + " sent to " + PeerDiscoveryConfig.address() +":"+ PeerDiscoveryConfig.port());
                client.close();

            })

        }

        this.start = function(callback) {

            setInterval(broadCastMessage, 3000);

            callback();

        }

    }]);
