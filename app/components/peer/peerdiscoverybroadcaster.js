/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('ploppen.peer.discovery.broadcaster', [])
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

        this.start = function(callback) {

            setInterval(function(){broadCastMessage(Config.multicastAddress())}, 5000);

            setInterval(function(){broadCastMessage(Peer.broadcastAddress())}, 6000);

            callback();

        }

    }]);