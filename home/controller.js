//首页
angular.module('elkfly.home', ['ngRoute'])
//配置模块路由
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: './home/view.html',
            controllerUrl: 'HomeController',
        });
    }])
    .controller('HomeController', [
        '$scope',
        '$http',
        '$routeParams',
        function ($scope, $http, $routeParams) {

        }]);
