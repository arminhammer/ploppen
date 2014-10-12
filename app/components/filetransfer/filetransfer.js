/**
 * Created by armin on 9/28/14.
 */
'use strict';

/**
 * Module that handles file transfers
 * TODO: Add unit testing, currently not possible without being able to inject external dependencies
 */
angular.module('ploppen.filetransfer', [])
    .service('FileTransferServer', ['$rootScope', 'Config', 'PeerList', 'Peer', function($rootScope, Config, PeerList, Peer) {

        var fs = require('fs');
        var server;
        var io;
        var socketStream;

        /**
         * Starts the file transfer server
         * @param callback
         */
        this.start = function(callback) {

            server = require('http').createServer();
            io = require('socket.io')(server);

            server.listen(Config.fileTransferPort());
            socketStream = require('socket.io-stream');

            // When a peer connects, establish the socket rules
            io.on('connection', function (socket) {

                socket
                    // Obsolete, should eliminate
                    .on('file.download.offer', function(data) {

                        console.log("File offered: " + data.filename);
                        var peerList = PeerList.list();
                        peerList[data.peername].files.push({ name : data.filename });
                        $rootScope.$broadcast('update peers');

                    })

                    // What to do when peer disconnects.
                    // TODO: Add peer disconnect handling.
                    .on('disconnect', function () {

                        socket.emit('user disconnected');

                    });

                /**
                 * Handle a request from a peer to download a file
                 */
                socketStream(socket).on('file.download.request', function(stream, data) {

                    fs.stat(data.filename, function(err, stats) {

                        if(err) {

                            console.log("There was a problem reading " + data.filename + ": " + err);
                        }

                        else {

                            console.log("Starting file stream...");
                            var peerList = PeerList.list();
                            var fileSize = stats.size;
                            console.log(data.filename + " is size " + fileSize);
                            console.log("Starting file stream...");

                            var readStream = fs.createReadStream(data.filename);

                            readStream.pipe(stream);

                            readStream.on('data', function(chunk) {

                                console.log("Reading chunk size " + chunk.length);

                            });

                            readStream.on('end', function() {

                                console.log("Finished sending file");

                            });

                        }
                    });
                });

            });

            callback();

        };

        /**
         * When a file is added to the local available files, alert the other peers that there is an
         * updated file list
         */
        this.updateFileList = function() {

            io.emit('filelist.update', { peername : Peer.myPeer().name, filelist: Peer.myPeer().availableFiles });
            console.log("Updating fileList: " + Peer.myPeer().availableFiles);

        };

    }]);