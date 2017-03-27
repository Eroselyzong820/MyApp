'use strict';
angular.module('elkfly', [
    'ngRoute',
    'elkfly.home',
    'elkfly.blog',
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/home'});
}]);


function getIE() {
    if (window.ActiveXObject) {
        var v = navigator.userAgent.match(/MSIE ([^;]+)/)[1];
        return parseFloat(v.substring(0, v.indexOf(".")))
    }
    return false
}
if (getIE()) {
    // window.location = window.location.href + '404.html'
    window.location = window.location.pathname = '/MyApp/404.html'
}