'use strict';

// Declare app level module which depends on views, and components
angular.module('node-teiler', [
  'ngRoute',
  'node-teiler.list',
  'node-teiler.view1',
  'node-teiler.view2',
  'node-teiler.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/list'});
}]);
