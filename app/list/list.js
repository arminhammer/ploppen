'use strict';

angular.module('node-teiler.list', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'ListCtrl'
        });
    }])

    .controller('ListCtrl', ['$scope','peerList', function($scope, peerList) {

    }])
    .factory('peerList', [function() {
        var peerList = {};
        return function(peer) {
            if(peer != null) {
                peerList[peer.name] = peer;
            }
        };
    }]);