'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', function($scope, PeerList, MyPeer, PeerDiscoveryBroadCast) {

        $scope.myPeer = MyPeer.myPeer();

        $scope.peers = PeerList.peersList();

        PeerDiscoveryBroadCast.start();

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