/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.filetransfer', [])
    .service('FileTransferServer', ['$rootScope', 'Config', 'PeerList', 'Peer', function($rootScope, Config, PeerList, Peer) {

        var fs = require('fs');
        var server;
        var io;
        var socketStream;

        this.start = function(callback) {

            server = require('http').createServer();
            io = require('socket.io')(server);

            server.listen(Config.fileTransferPort());
            socketStream = require('socket.io-stream');

            io.on('connection', function (socket) {

                socket
                    .on('file.download.offer', function(data) {

                        console.log("File offered: " + data.filename);
                        var peerList = PeerList.list();
                        peerList[data.peername].files.push({ name : data.filename });
                        $rootScope.$broadcast('update peers');

                    })

                    .on('disconnect', function () {

                        socket.emit('user disconnected');

                    });

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

        this.updateFileList = function() {

            io.emit('filelist.update', { peername : Peer.myPeer().name, filelist: Peer.myPeer().availableFiles });
            console.log("Updating fileList: " + Peer.myPeer().availableFiles);

        };

    }]);