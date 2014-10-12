/**
 * Created by armin on 9/28/14.
 */
'use strict';

/**
 * Module to listen for incoming UDP or IP Broadcast discovery messages from other peers
 */
angular.module('ploppen.peer.discovery.listener', [])
    .service('PeerDiscoveryListener', ['$rootScope', 'Peer', 'Config', 'PeerList', function($rootScope, Peer, Config, PeerList) {

        var dgram = require('dgram');
        var server;
		//var bServer;

        /**
         * Start the service
         * @param callback
         */
        this.start = function(callback) {

            server = dgram.createSocket('udp4');

            /**
             * Bind to the multicast port
             */
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

            /**
             * If a message is received, see if the peer should be added to the peer list
             */
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

        /**
         * Stop the multicast listener service
         * @param callback
         */
        this.stop = function(callback) {

            server.dropMembership(Config.multicastAddress());
            server.close();

			//bServer.close();

            callback();

        };

    }]);