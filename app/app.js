'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler', [

    'node-teiler.list',
    'node-teiler.peerdiscovery',
    'node-teiler.filetransfer'

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

