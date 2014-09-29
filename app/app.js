'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler', [

    'node-teiler.list',
    'node-teiler.peerdiscovery',
    'node-teiler.filetransfer'

])
    .service('Peer', ['Config', function(Config) {

        var myPeer = {
            name: "localhost",
            address: "0.0.0.0",
            port: Config.fileTransferPort()
        };

        this.myPeer = function() {

            return myPeer;

        };

    }])
    .service('PeerList', [function() {

        var peers = {};

        peers["Peer 1"] = {
            name : "Peer 1",
            address: "localhost",
            port: 9999,
            files : [
                { name : "File 1" },
                { name : "File 2" }
            ]
        };

        peers["Peer 2"] = {
            name : "Peer 2",
            address: "localhost",
            port: 9999,
            files : [
                { name : "File 3" },
                { name : "File 4" }
            ]
        };

        peers["Peer 3"] = {
            name : "Peer 3",
            address: "localhost",
            port: 9999,
            files : []
        };

        this.list = function() {

            return peers;

        };

        this.count = function() {

            var count = 0;

            for (var key in peers) {

                if (peers.hasOwnProperty(key)) {

                    count++;

                }
            }

            return count;

        };

        this.keys = function() {

            var keys = [];

            for (var key in peers) {

                if (peers.hasOwnProperty(key)) {

                    keys.push(key);

                }
            }

            return keys;

        };

        this.print = function() {

            for (var key in peers) {

                if (peers.hasOwnProperty(key)) {

                    console.log(JSON.stringify(peers[key]));

                }
            }

        };

        this.contains = function(peer) {

            return peers.hasOwnProperty(peer.name);

        };

        this.addPeer = function(peer, callback) {

            if(!this.contains(peer)) {
                peers[peer.name] = peer;
                console.log(peers[peer.name].name + " added to peers");
            }
            else{
                console.log(peer.name + " is already in the list!");
            }

            callback();

        }

    }])
    .service('Config', [function() {

        var multicastAddress = '224.0.0.114';
        var multicastPort = 8888;

        var fileTransferPort = 9999;

        this.multicastAddress = function () {
            return multicastAddress;
        };

        this.multicastPort = function () {
            return multicastPort;
        };

        this.fileTransferPort = function() {
            return fileTransferPort;
        }

    }]);

