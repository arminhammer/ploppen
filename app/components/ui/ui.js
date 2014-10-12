'use strict';

/**
 * Module that handles the app UI
 */
angular.module('ploppen.ui', [])

    .controller('UIController', ['$scope', 'PeerList', 'Peer', 'Init', function($scope, PeerList, Peer) {

        // The local peer state object
        $scope.myPeer = Peer.myPeer();

        // The peer list state object
        $scope.peers = PeerList.list();

        // In case the peer list is updated elsewhere in the application, make sure the UI is updated
        $scope.$on('peerList.update', function() {

            $scope.$apply();

        });

        /**
         * When the button is clicked, open the file dialog to choose a file
         */
        $scope.clickAddButton = function() {

            console.log("Clicked Send Button!");

            $('#fileInputDialog').trigger('click');

        };

        /**
         * When the download button is clicked, choose the download location
         * @param clickEvent
         * @param peer
         * @param file
         */
        $scope.clickDownloadButton = function(clickEvent, peer, file) {

            console.log("Clicked Download Button for " + file.name);

            $('#' + peer.name + 'fileSaveDialog').trigger('click');
            console.log("Clicked on #" + peer.name + "fileSaveDialog");
        };

        /**
         * Add a file to the local peer availableFiles list
         */
        $scope.addFile = function() {

            var filename = $("#fileInputDialog").val();
            console.log("FILENAME VALUE IS " + filename);

            console.log(Peer.myPeer().availableFiles);

            if(Peer.myPeer().availableFiles[filename] == null) {

                Peer.myPeer().availableFiles[filename] = {

                    filename: filename

                };

                $scope.$apply();
                FileTransferServer.updateFileList();

            }

            console.log(Peer.myPeer().availableFiles);
        };

        /**
         * Download a file from another peer in the network
         * @param peer
         * @param file
         */
        $scope.downloadFile  = function(peer, file) {

            console.log("DOWNLOADING FROM " + peer.name);
            var downloadLocation = $("#" + peer.name + "fileSaveDialog").val();
            console.log("FILENAME VALUE IS " + file.filename + " and download location is " + downloadLocation);
            Peer.myPeer().downloadingFiles[file.filename] = {
                filename: file.filename,
                downloadLocation: downloadLocation
            };

            var socketStream = require('socket.io-stream');
            var fs = require('fs');
            var stream = socketStream.createStream();

            socketStream(peer.socket).emit('file.download.request', stream, { filename : file.filename, peername : Peer.myPeer().name });
            var dlStream = fs.createWriteStream(downloadLocation);
            dlStream.on('drain', function() {
                console.log("Written " + dlStream.bytesWritten);
            });
            stream.pipe(dlStream);
        }

    }])
/**
 * Directive to help the file input dialog and save file dialog process
 */
    .directive('onChange', function() {

        return {

            restrict: 'A',
            scope:{'onChange':'&' },

            link: function(scope, elm) {

                elm.bind('change', function() {

                    scope.onChange();

                });
            }

        };
    });