'use strict';
angular.module('elkfly', [
    'ngRoute',
    'elkfly.home',
    'elkfly.blog',
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/home'});
}]);
