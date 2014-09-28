'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', function($scope, PeerList, Peer, PeerDiscoveryBroadcaster, PeerDiscoveryListener) {

        $scope.myPeer = Peer.myPeer();

        $scope.peers = PeerList.list();

        $scope.$on('update peers', function() {
            $scope.$apply();
        });

        PeerDiscoveryListener.start(function() {

            console.log("Started Peer Discovery Listener");

        });

        PeerDiscoveryBroadcaster.start(function() {

            console.log("Started Peer Discovery Broadcaster");

        });
    });