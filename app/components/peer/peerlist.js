'use strict';

/**
 * This module contains the PeerList service, which maintains the state of the list of other
 * peers in the network
 */
angular.module('ploppen.peer.peerlist', [])
    .service('PeerList', ['$rootScope', 'Peer', function($rootScope, Peer) {

        // Object that keeps the peer list state
        var peers = {};

        /*
         peers['Peer1'] = {
         name : 'Peer1',
         address: '127.0.0.1',
         port: 9996,
         availableFiles : [
         { filename : "File 1" },
         { filename : "File 2" }
         ]
         };
         */

        /**
         * Return the peers list state object
         * @returns {{}}
         */
        this.list = function() {

            return peers;

        };

        /**
         * Returns the number of peers in the list
         * @returns {number}
         */
        this.count = function() {

            var count = 0;

            for (var key in peers) {

                if (peers.hasOwnProperty(key)) {

                    count++;

                }
            }

            return count;

        };

        /**
         * Returns true if the peer is in the list, false if it is not present
         * @param peer
         * @returns {boolean|*}
         */
        this.contains = function(peer) {

            return peers.hasOwnProperty(peer.name);

        };

        /**
         * Add a peer to the list
         * TODO: Add unit testing for this function, currently not able to test it because angular can't inject the PeerList service if
         * it has external dependencies (socket.io-client)
         * @param peer
         * @param callback
         */
        this.addPeer = function(peer, callback) {

            var added = false;

            if(!this.contains(peer)) {

                console.log("this.peers[peer.name]: " + peers[peer.name]);
                console.log(peer);
                peers[peer.name] = peer;
                console.log("this.peers[peer.name]: " + peers[peer.name]);

                var ioc = require('socket.io-client');
                var socketStream = require('socket.io-stream');
                var fs = require('fs');

                peers[peer.name].socket = ioc.connect('http://' + peer.address + ':' + peer.port);
                console.log("Connecting to http://" + peer.address + ':' + peer.port);

                peers[peer.name].socket

                    .on('filelist.update', function(data) {

                        peers[data.peername].availableFiles = data.filelist;
                        console.log("Client Received filelistupdate: " + data.peername + " " + data.filelist);
                        $rootScope.$broadcast('peerList.update');

                    })

                    .on('disconnect', function() {

                        console.log(peer.name + " disconnected.");

                    });


                socketStream(peers[peer.name].socket).on('file.download.data', function(stream, data) {

                    console.log("Server Received download data message: " + data.filename);

                    fs.createWriteStream(Peer.myPeer().downloadingFiles[data.filename].downloadLocation).pipe(stream);

                });

                peers[peer.name].files = [];

                added = true;

            }
            else{

                //console.log(peer.name + " is already in the list!");

            }

            callback(added);

            return;
        };

    }]);