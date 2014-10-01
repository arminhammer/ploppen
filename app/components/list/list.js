'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', ['$scope', 'PeerList', 'Peer', 'PeerDiscoveryBroadcaster', 'PeerDiscoveryListener', 'FileTransferServer', function($scope, PeerList, Peer, PeerDiscoveryBroadcaster, PeerDiscoveryListener, FileTransferServer) {

        $scope.myPeer = Peer.myPeer();

        $scope.peers = PeerList.list();

        $scope.$on('update peers', function() {
            $scope.$apply();
        });

        $scope.clickSendButton = function(clickEvent, peerName) {
            console.log("Clicked Send Button!");
            console.log(clickEvent);

            function chooseFile(name) {

                var chooser = $(name);
                chooser.change(function(evt) {
                    console.log($(this).val());
                });

                chooser.trigger('click');

            }
            chooseFile('#fileInputDialog');
        };

        $scope.clickDownloadButton = function(clickEvent, file) {
            console.log("Clicked Download Button for " + file.name);
            console.log(clickEvent);
            function chooseFile(name) {
                var chooser = $(name);
                chooser.change(function(evt) {
                    console.log($(this).val());
                });

                chooser.trigger('click');
            }
            chooseFile('#fileSaveDialog');
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