/**
 * Created by armin on 9/28/14.
 */
'use strict';

/**
 * This module broadcasts UDP multicast and IP Broadcast messages
 */
angular.module('ploppen.peer.discovery.broadcaster', [])
    .service('PeerDiscoveryBroadcaster', ['Peer', 'Config', function(Peer, Config) {

        var dgram = require('dgram');

        /**
         * Generate the JSON message to be sent
         * @returns {Buffer}
         */
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

        /**
         * Broadcast the message on the given address
         * @param address
         */
        function broadCastMessage(address) {

            var messageJSON = genMessage();

            var client = dgram.createSocket('udp4');
            var localAddress = Peer.ipAddress();
            //console.log(localAddress);
            client.bind(localAddress);
            client.on("listening", function () {
                client.setBroadcast(true);
                client.send(messageJSON, 0, messageJSON.length, Config.multicastPort(), address, function (err, bytes) {

                    if (err) throw err;
                    //console.log("UDP message: " + messageJSON + " sent to " + address + ":" + Config.multicastPort());
                    client.close();

                })
            });

        }

        /**
         * Start the broadcast service.  Repeat on specified intervals
         * TODO: Move the interval parameter to Config
         * @param callback
         */
        this.start = function(callback) {

            setInterval(function(){broadCastMessage(Config.multicastAddress())}, 5000);

            setInterval(function(){broadCastMessage(Peer.broadcastAddress())}, 6000);

            callback();

        }

    }]);