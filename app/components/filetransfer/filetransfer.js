/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.filetransfer', [])
    .service('FileTransferServer', ['$rootScope', 'Config', 'PeerList', function($rootScope, Config, PeerList) {

        var fs = require('fs');

        this.start = function(callback) {

            var server = require('http').createServer();
            var socket = require('socket.io')(server);
            server.listen(Config.fileTransferPort());

            socket.on('connection', function (socket) {

                socket.emit('this', { will: 'be received by everyone'});

                socket.on('private message', function (message) {
                    console.log('I received a private message by ', message.peer, ' saying ', message.message);
                });

                socket.on('file.offer', function(data) {
                    console.log("File offered: " + data.filename);
                    var peerList = PeerList.list();
                    peerList[data.peername].files.push({ name : data.filename });
                    $rootScope.$broadcast('update peers');
                });

                socket.on('file.download', function(data) {
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
                                    console.log("Opened file: " + data.filename);
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

                });

                socket.on('disconnect', function () {
                    socket.emit('user disconnected');
                });

            });

            callback();

        };

    }]);