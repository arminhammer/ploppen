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

                            //var stream = socketStream.createStream();

                            socketStream(socket).emit('file.download.data', stream, { filename: data.filename, filesize: fileSize });

                            /*
                             var blobStream = socketStream.createBlobReadStream(data.filename);
                             var size = 0;

                             blobStream.on('data', function(chunk) {
                             size += chunk.length;
                             console.log(Math.floor(size / file.size * 100) + '%');
                             // -> e.g. '42%'
                             });

                             blobStream.pipe(stream);
                             */

                            fs.createReadStream(data.filename).pipe(stream);

                        }
                    });
                });

                /*
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
                 peerList[data.peername].socket.emit('file.download.start', { filename: data.filename, filesize: fileSize });
                 })

                 .on('readable', function () {
                 var chunk;
                 while (null !== (chunk = readableFile.read(1048576))) {
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

                 }
                 });

                 })


                 .on('file.download.start', function(data) {

                 console.log("Server Received download start message: " + data);
                 var dlLocation = Peer.myPeer().downloadingFiles[data.filename].downloadLocation;
                 console.log("dlLocation is " + dlLocation);
                 Peer.myPeer().downloadingFiles[data.filename].dlStream = fs.createWriteStream(dlLocation);


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

                 */


                /*
                 socketStream(socket).on('file.download.data', function(stream, data) {

                 console.log("Server Received download data message: " + data.filename);

                 fs.createWriteStream(Peer.myPeer().downloadingFiles[data.filename].downloadLocation).pipe(stream);

                 //console.log("Received download end message: " + data);

                 })
                 */

            });

            callback();

        };

        this.updateFileList = function() {
            io.emit('filelist.update', { peername : Peer.myPeer().name, filelist: Peer.myPeer().availableFiles });
            console.log("Updating fileList: " + Peer.myPeer().availableFiles);
        };

    }]);