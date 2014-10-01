'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', ['$scope', 'PeerList', 'Peer', 'PeerDiscoveryBroadcaster', 'PeerDiscoveryListener', 'FileTransferServer', function($scope, PeerList, Peer, PeerDiscoveryBroadcaster, PeerDiscoveryListener, FileTransferServer) {

        $scope.myPeer = Peer.myPeer();

        $scope.peers = PeerList.list();

        $scope.$on('update peers', function() {

			$scope.$apply();

		});

		function setDialogListener(name) {

			var listener = $(name);

			listener.change(function(evt) {

				var filePath = $(this).val()
				console.log(filePath);

			});

			return listener;

		}

		var fileInputDialogListener = setDialogListener('#fileInputDialog');
		var fileSaveDialogListener = setDialogListener('#fileSaveDialog');

        $scope.clickSendButton = function(clickEvent, peer) {

			console.log("Clicked Send Button!");
            console.log(clickEvent);

            fileInputDialogListener.trigger('click');

		};

        $scope.clickDownloadButton = function(clickEvent, file, peer) {

			console.log("Clicked Download Button for " + file.name);
            console.log(clickEvent);

			fileSaveDialogListener.trigger('click');

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

    }]);