/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.filetransfer', [])
    .service('FileTransferServer', ['$rootScope', 'Config', 'PeerList', 'Peer', function($rootScope, Config, PeerList, Peer) {

        var fs = require('fs');

        this.start = function(callback) {

            var server = require('http').createServer();
            var socket = require('socket.io')(server);
            server.listen(Config.fileTransferPort());

            socket.on('connection', function (socket) {

                socket.on('file.download.offer', function(data) {
                    console.log("File offered: " + data.filename);
                    var peerList = PeerList.list();
                    peerList[data.peername].files.push({ name : data.filename });
                    $rootScope.$broadcast('update peers');
                })

                    .on('file.download.request', function(data) {
                        console.log("File to download: " + data.filename + " from " + data.peername);

                        fs.stat(data.filename, function(err, stats) {
                            if(err) {
                                console.log("There was a problem reading " + data.filename + ": " + err);
                            }
                            else {
                                var peerList = PeerList.list();
                                var fileSize = stats.size;
                                console.log(data.filename + " is size " + fileSize);
                                var readableFile = fs.ReadStream(data.filename);
                                readableFile
                                    .on('open', function() {
                                        console.log("Opened file: " + data.filename + " to " + data.peername + " who is " + peerList[data.peername].name);
                                        peerList[data.peername].socket.emit('file.download.start', { name: data.filename, size: fileSize });
                                    })

                                    .on('readable', function () {
                                        var chunk;
                                        while (null !== (chunk = readableFile.read())) {
                                            //console.log("chunk size: " + chunk.length);
                                            peerList[data.peername].socket.emit('file.download.data', { name: data.filename, data: chunk });
                                        }
                                    })

                                    .on('end', function () {
                                        console.log("Finished reading file");
                                        peerList[data.peername].socket.emit('file.download.end', { name: data.filename });
                                    })

                                    .on('error', function(err) {
                                        console.log("Error opening file: " + err);
                                    });

                            }
                        });

                    })

                    .on('file.download.start', function(data) {

                        console.log("Server Received download start message: " + data);
                        var dlLocation = Peer.myPeer().downloadingFiles[data.name].downloadLocation;
                        Peer.myPeer().downloadingFiles[data.name].dlStream = fs.createWriteStream(dlLocation);

                    })

                    .on('file.download.data', function(data) {

                        Peer.myPeer().downloadingFiles[data.name].dlStream.write(data.chunk);
                        //console.log("Received download end message: " + data);

                    })

                    .on('file.download.end', function(data) {

                        Peer.myPeer().downloadingFiles[data.name].dlStream.end();
                        console.log("Server Received download end message: " + data);

                    })

                    .on('disconnect', function () {

                        socket.emit('user disconnected');

                    });

            });

            callback();

        };

    }]);