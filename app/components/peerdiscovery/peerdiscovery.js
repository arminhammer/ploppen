/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.peerdiscovery', [])
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