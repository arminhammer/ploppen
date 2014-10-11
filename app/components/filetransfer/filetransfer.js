/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.filetransfer', [])
    .service('FileTransferServer', ['$rootScope', 'Config', 'PeerList', 'Peer', function($rootScope, Config, PeerList, Peer) {

        var fs = require('fs');
        var server;
        var socket;

        this.start = function(callback) {

            server = require('http').createServer();
            socket = require('socket.io')(server);

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

                                fs.readFile(data.filename, function(err, buffer) {
                                    console.log("Read file, buffer: " + buffer);
                                });

                                /*
                                var readableFile = fs.ReadStream(data.filename);
                                readableFile
                                    .on('open', function() {
                                        console.log("Opened file: " + data.filename + " to " + data.peername + " who is " + peerList[data.peername].name);
                                        peerList[data.peername].socket.emit('file.download.start', { filename: data.filename, filesize: fileSize });
                                    })

                                    .on('readable', function () {
                                        var chunk;
                                        while (null !== (chunk = readableFile.read())) {
                                            console.log("chunk size: " + chunk.length);
                                            peerList[data.peername].socket.emit('file.download.data', { filename: data.filename, filedata: chunk });
                                        }
                                    })

                                    .on('end', function () {
                                        console.log("Finished reading file");
                                        peerList[data.peername].socket.emit('file.download.end', { filename: data.filename });
                                    })

                                    .on('error', function(err) {
                                        console.log("Error opening file: " + err);
                                    });
                                */
                            }
                        });

                    })

                    .on('file.download.start', function(data) {

                        console.log("Server Received download start message: " + data);
                        var dlLocation = Peer.myPeer().downloadingFiles[data.filename].downloadLocation;
                        console.log("dlLocation is " + dlLocation);
                        Peer.myPeer().downloadingFiles[data.filename].dlStream = fs.createWriteStream(dlLocation);

                        /*
                        Peer.myPeer().downloadingFiles[data.filename].dlStream.on('error', function(err) {
                            console.log("Error with file: " + err);
                        });
                        */

                    })

                    .on('file.download.data', function(data) {

                        //console.log("Received download data message: " + data.filename + " " + data.filedata.length);
                        Peer.myPeer().downloadingFiles[data.filename].dlStream.write(data.filedata);
                        //console.log("Received download end message: " + data);

                    })

                    .on('file.download.end', function(data) {

                        Peer.myPeer().downloadingFiles[data.filename].dlStream.end();
                        console.log("Server Received download end message: " + data.filename);

                    })

                    /*
                    .on('filelist.update', function(data) {
                        PeerList.list()[data.peername].files = data.filelist;
                        console.log("Server Received filelistupdate: " + data.peername + " " + data.filelist);
                    })
                    */

                    .on('disconnect', function () {

                        socket.emit('user disconnected');

                    });

            });

            callback();

        };

        this.updateFileList = function() {
            socket.emit('filelist.update', { peername : Peer.myPeer().name, filelist: Peer.myPeer().availableFiles });
            console.log("Updating fileList: " + Peer.myPeer().availableFiles);
        };

    }]);