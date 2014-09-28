'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', function($scope, PeerList, Peer, PeerDiscoveryBroadcaster, PeerDiscoveryListener) {

        $scope.myPeer = Peer.myPeer();

        $scope.peers = PeerList.peersList();

        PeerDiscoveryListener.start(function() {

            console.log("Started Peer Discovery Listener");

        });

        PeerDiscoveryBroadcaster.start(function() {

            console.log("Started Peer Discovery Broadcaster");

        });
    });