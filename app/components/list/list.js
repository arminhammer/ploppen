'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', function($scope, PeerList, Peer, PeerDiscoveryBroadcaster, PeerDiscoveryListener) {

        $scope.myPeer = Peer.myPeer();

        $scope.peers = PeerList.list();

        $scope.$on('update peers', function() {
            $scope.$apply();
        });

        $scope.clickSendButton = function(clickEvent) {
            console.log("Clicked Send Button!");
            console.log(clickEvent);
        };

        $scope.clickDownloadButton = function(clickEvent, file) {
            console.log("Clicked Download Button for " + file.name);
            console.log(clickEvent);
        };

        PeerDiscoveryListener.start(function() {

            console.log("Started Peer Discovery Listener");

        });

        PeerDiscoveryBroadcaster.start(function() {

            console.log("Started Peer Discovery Broadcaster");

        });
    });