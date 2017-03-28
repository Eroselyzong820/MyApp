'use strict';
angular.module('elkfly', [
    'ngRoute',
    'elkfly.home',
    'elkfly.blog',
]).config(['$routeProvider', function ($routeProvider) {
    function isIE() { //ie?
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    };

    if (isIE()) {
        window.location = window.location.pathname = '/404.html'
    } else {
        $routeProvider.otherwise({redirectTo: '/home'});
    };
}]);


function isIE() { //ie?
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}
if (isIE()) {
    window.location = window.location.pathname = '/404.html'
}
