/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.filetransfer', [])
    .service('FileTransferServer', ['$rootScope', 'Config', 'PeerList', function($rootScope, Config, PeerList) {

        this.start = function(callback) {

            var server = require('http').createServer();
            var socket = require('socket.io')(server);
            server.listen(Config.fileTransferPort());

            socket.on('connection', function (socket) {

                socket.emit('this', { will: 'be received by everyone'});

                socket.on('private message', function (message) {
                    console.log('I received a private message by ', message.peer, ' saying ', message.message);
                });

                socket.on('file', function(data) {
                    console.log("File received: " + data.filename);
                    PeerList.list()[data.peername].files.push({ name : data.filename });
                    $rootScope.$broadcast('update peers');
                });

                socket.on('disconnect', function () {
                    socket.sockets.emit('user disconnected');
                });

            });

            callback();

        };

    }]);