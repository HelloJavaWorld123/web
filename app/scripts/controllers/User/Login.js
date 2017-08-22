/*
 * @Author: 唐文雍
 * @Date:   2016-05-04 17:26:02
 * @Last Modified by:   snoob
 * @Last Modified time: 2017-1-4 18:18:35
 */
'use strict';
App.controller('UserLoginController', ['$scope', '$rootScope', '$state', 'AuthService', 'Session', 'msgBus', '$http', 'restful', '$interval', '$cookies', '$location', 'toastr', function($scope, $rootScope, $state, AuthService, Session, msgBus, $http, restful, $interval, $cookies, $location, toastr) {
    //初始时将之前登录过的信息清空
    $scope.load = function() {
        Session.destroy();
    };
    $scope.credentials = {};
    $scope.error = "";

    $scope.login = function(credentials) {
        $scope.loginPromise = AuthService.login(credentials).then(function(res) {
            if (res.code == 1) {
                toastr.error(res.msg);
                return;
            }
            if (res.data.account) {
                msgBus.emitMsg("login");

                $state.go('dashboard');
            } else {
                $scope.error = data.msg || "超时";
            }
        });
    };


}]);
