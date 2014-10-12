'use strict';

// Declare app level module which depends on views, and components
angular.module('ploppen.peer.peerlist', [])
    .service('PeerList', ['$rootScope', 'Peer', function($rootScope, Peer) {

        var ioc = require('socket.io-client');
        var socketStream = require('socket.io-stream');
        var fs = require('fs');

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

            //console.log("Printing peer list:");

            for (var key in peers) {

                if (peers.hasOwnProperty(key)) {

                    //console.log(peers[key].name);
                    //console.log(peers[key].socket);
                }
            }

        };

        this.contains = function(peer) {

            return peers.hasOwnProperty(peer.name);

        };

        this.addPeer = function(peer, callback) {

            var added = false;

            if(!this.contains(peer)) {

                console.log("this.peers[peer.name]: " + peers[peer.name]);
                console.log(peer);
                peers[peer.name] = peer;
                console.log("this.peers[peer.name]: " + peers[peer.name]);

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

            this.print();

            callback(added);

        }

    }]);