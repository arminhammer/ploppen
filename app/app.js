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
    .service('PeerDiscoveryListener', ['MyPeer', 'PeerDiscoveryConfig', function(MyPeer, PeerDiscoveryConfig) {

        var dgram = require('dgram');
        var server;

        this.start = function(callback) {

            server = dgram.createSocket('udp4');

            server.bind(1234, function() {
                server.addMembership(PeerDiscoveryConfig.address());
                server.setBroadcast(true);
                server.setMulticastTTL(5);
                server.setMulticastLoopback(false);
            });

            callback();

        };

        this.stop = function(callback) {

            server.dropMembership(PeerDiscoveryConfig.address());
            server.close();

            callback();

        };

    }])
    .service('PeerDiscoveryBroadcaster', ['MyPeer', 'PeerDiscoveryConfig', function(MyPeer, PeerDiscoveryConfig) {

        var dgram = require('dgram');
        var message = new Buffer("Host: " + MyPeer.myPeer().name);


        function broadCastMessage() {

            var client = dgram.createSocket('udp4');

            client.send(message, 0, message.length, PeerDiscoveryConfig.port(), PeerDiscoveryConfig.address(), function(err, bytes) {

                if (err) throw err;
                console.log("UDP message: " + message + " sent to " + PeerDiscoveryConfig.address() +":"+ PeerDiscoveryConfig.port());
                client.close();

            })

        }

        this.start = function(callback) {
            setInterval(broadCastMessage, 3000);

            callback();

        }

    }]);
