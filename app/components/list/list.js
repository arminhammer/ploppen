'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', function($scope, PeerList, MyPeer, PeerDiscoveryBroadcaster, PeerDiscoveryListener) {

        $scope.myPeer = MyPeer.myPeer();

        $scope.peers = PeerList.peersList();

        PeerDiscoveryListener.start(function() {

            console.log("Started Peer Discovery Listener");

        });

        PeerDiscoveryBroadcaster.start(function() {

            console.log("Started Peer Discovery Broadcaster");

        });
    })
    .service('PeerList', [function() {

        var peers = [];

        peers.push({
            name: "Peer 1",
            files: [
                { name: "File 1" },
                { name: "File 2" }
            ]
        });
        peers.push({
            name: "Peer 2",
            files: [
                { name: "File 3" },
                { name: "File 4" }
            ]
        });
        peers.push({
            name: "Peer 3",
            files: []
        });

        this.peersList = function() {

            return peers;

        };

    }]);