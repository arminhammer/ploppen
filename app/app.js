'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler', [
    //'ngRoute',
    'node-teiler.list'
])
    .service('MyPeer', [function() {

        var myPeer = {
            name: "",
            ipAddress: ""
        };

        this.myPeer = function() {
            return myPeer;
        };

    }]);

/*
 .
 config(['$routeProvider', function($routeProvider) {
 $routeProvider.otherwise({redirectTo: '/list'});
 }]);
 */
