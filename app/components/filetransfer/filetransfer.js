/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.filetransfer', [])
    .service('FileTransferServer', ['PeerDiscoveryConfig', function(PeerDiscoveryConfig) {

        this.start = function(callback) {

            // note, io.listen(&lt;port&gt;) will create a http server for you
            var io = require('socket.io')(9999);

            io.on('connection', function (socket) {
                io.emit('this', { will: 'be received by everyone'});

                socket.on('private message', function (from, msg) {
                    console.log('I received a private message by ', from, ' saying ', msg);
                });

                socket.on('disconnect', function () {
                    io.sockets.emit('user disconnected');
                });
            });

            callback();

        };

    }])
    .service('FileTransferClient', ['PeerDiscoveryConfig', function(PeerDiscoveryConfig) {

        this.start = function(callback) {

            setInterval(broadCastMessage, 3000);

            callback();

        };

        this.stop = function(callback) {

            callback();

        };

    }]);