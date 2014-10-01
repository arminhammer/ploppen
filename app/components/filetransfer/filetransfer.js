/**
 * Created by armin on 9/28/14.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler.filetransfer', [])
    .service('FileTransferServer', ['Config', function(Config) {

        this.start = function(callback) {

            // note, io.listen(&lt;port&gt;) will create a http server for you
            var io = require('socket.io')(Config.fileTransferPort());

            io.on('connection', function (socket) {

                io.emit('this', { will: 'be received by everyone'});

                socket.on('private message', function (message) {
                    console.log('I received a private message by ', message.peer, ' saying ', message.message);
                });

                socket.on('disconnect', function () {
                    io.sockets.emit('user disconnected');
                });

            });

            callback();

        };

    }]);