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

    }])
    .service('FileTransferClient', ['Config', 'PeerList', function(Config, PeerList) {

        this.connect = function(peer, callback) {

            var ioc = require('socket.io-client');

            var socket = ioc.connect('http://' + peer.address + ':' + peer.port);

            socket.emit('private message', { peer: peer.name, message: "Hi World!"});

            socket.on('news', function (data) {

                console.log(data);
                socket.emit('my other event', { my: 'data' });

            });

            PeerList.print();

            peer.socket = socket;

            console.log("peer.socket: " + peer.socket);

            PeerList.print();

            callback();

        };

        this.disconnect = function(peer, callback) {

            callback();

        };

    }]);