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

        this.peersList = function() {

            return peers;

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
    .service('PeerDiscoveryListener', ['Peer', 'PeerDiscoveryConfig', function(Peer, PeerDiscoveryConfig) {

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

            server.on('message', function (message, remote) {
                console.log(remote.address + ':' + remote.port +' - ' + message);
                //var peerMessage = JSON.parse(message);

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
        var message = new Buffer("Host: " + JSON.stringify(Peer.myPeer()));

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
