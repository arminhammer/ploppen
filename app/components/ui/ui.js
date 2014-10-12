'use strict';

angular.module('ploppen.ui', [])

    .controller('UIController', ['$scope', 'PeerList', 'Peer', 'PeerDiscoveryBroadcaster', 'PeerDiscoveryListener', 'FileTransferServer', function($scope, PeerList, Peer, PeerDiscoveryBroadcaster, PeerDiscoveryListener, FileTransferServer) {

        $scope.myPeer = Peer.myPeer();

        $scope.peers = PeerList.list();

        $scope.$on('peerList.update', function() {

            $scope.$apply();

        });

        $scope.clickAddButton = function() {

            console.log("Clicked Send Button!");

            $('#fileInputDialog').trigger('click');

        };

        $scope.clickDownloadButton = function(clickEvent, peer, file) {

            console.log("Clicked Download Button for " + file.name);

            $('#' + peer.name + 'fileSaveDialog').trigger('click');
            console.log("Clicked on #" + peer.name + "fileSaveDialog");
        };

        PeerDiscoveryListener.start(function() {

            console.log("Started Peer Discovery Listener");

        });

        PeerDiscoveryBroadcaster.start(function() {

            console.log("Started Peer Discovery Broadcaster");

        });

        FileTransferServer.start(function() {

            console.log("Started File Transfer Server");

        });

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