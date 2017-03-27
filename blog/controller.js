!function (angular) {
    //博客模块
    angular.module('elkfly.blog', ['ngRoute'])
    //配置模块路由
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/blog', {
            templateUrl: './blog/view.html',
            controllerUrl: 'BlogController',
        });
    }])

    .controller('BlogController', [
        '$scope',
        '$http',
        function ($scope, $http) {
            $scope.blog={};
            $scope.blog = {
                tixing:'该博客暂时无法访问',
                updata:'功能更新',
                tishi:{
                    tishi2:'本次更新如下',
                    one:'加入MarkDown语法支持',
                    two:'加入分享到微博',
                    three:'加入夜间模式',
                    four:'对firefox兼容',
                }
            }
        }]);
}(angular);
