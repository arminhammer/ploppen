/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('ploppen.peer.discovery.listener', [])
    .service('PeerDiscoveryListener', ['$rootScope', 'Peer', 'Config', 'PeerList', function($rootScope, Peer, Config, PeerList) {

        var dgram = require('dgram');
        var server;
		//var bServer;

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

                //console.log("MULTI MESSAGE: " + remote.address + ':' + remote.port +' - ' + messageJSON);

                if(Peer.localAddressList().indexOf(remote.address) < 0) {

                    var message = JSON.parse(messageJSON);
                    var peer = message.peer;
                    peer.address = remote.address;

                    PeerList.addPeer(peer, function (added) {

                        if (added) {
                            console.log("Peer " + peer.name + " was added.");
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

			//bServer.close();

            callback();

        };

    }]);