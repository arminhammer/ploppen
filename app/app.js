'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler', [
    //'ngRoute',
    'node-teiler.list'
])
    .service('MyPeer', [function() {

        var myPeer = {
            name: "localhost",
            ipAddress: ""
        };

        this.myPeer = function() {
            return myPeer;
        };

    }])
    .service('PeerDiscoveryBroadCast', ['MyPeer', function(MyPeer) {

        var multicastAddress = '224.0.0.114';
        var multicastPort = 8088;

        var dgram = require('dgram');
        var server;

        this.start = function() {

            server = dgram.createSocket('udp4');

            server.bind(1234, function() {
                server.addMembership(multicastAddress);
                server.setBroadcast(true);
                server.setMulticastTTL(5);
                server.setMulticastLoopback(false);
            });

            setInterval(broadcastNew, 3000);
        };

        this.stop = function() {

            server.dropMembership(multicastAddress);
            server.close();

        };

        function broadcastNew() {

            var message = new Buffer("Host: " + MyPeer.myPeer().name);
            server.send(message, 0, message.length, multicastPort, multicastAddress);
            console.log("Sent " + message + " to the wire...");

        }

    }]);
