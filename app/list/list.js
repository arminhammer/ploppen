'use strict';

angular.module('node-teiler.list', ['ngRoute'])

    /*
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'ListCtrl'
        });
    }])
    */
    .controller('ListController', function($scope, PeerList) {

        $scope.myName = "My Computer";

        $scope.peers = PeerList.peersList();

    })
    .service('PeerList', [function() {
        var peers = [];
        peers.push({
            name: "Peer 1",
            files: [
                { name: "File 1" },
                { name: "File 2"}
            ]
        });
        peers.push({
            name: "Peer 2",
            files: [
                { name: "File 3" },
                { name: "File 4"}
            ]
        });

        this.peersList = function() {
            return peers;
        }
        /*
        return function(peer) {
            if(peer != null) {
                peerList[peer.name] = peer;
            }
        };
        */
    }]);