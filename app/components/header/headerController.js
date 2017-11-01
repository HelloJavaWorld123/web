/*
 * @Author: 唐文雍
 * @Date:   2016-05-09 21:17:22
 * @Last Modified by:   郝晓波
 * @Last Modified time: 2017-05-10 17:24:03
 */

'use strict';
App.controller('HeaderController',function($scope, $state, restful, Session, msgBus,$location, $rootScope, toastr) {
    $rootScope.title = "";

    msgBus.onMsg('login', $scope, function() {
        $scope.init();
    });
    $scope.init = function() {
        $scope.username = Session.$storage.username;
        $scope.userHead = 'app/images/banner.png';
    };
    $scope.init();
    $scope.logout = function() {
        restful.fetch($rootScope.api.logout, "POST").then(function(res) {
            Session.destroy();
            if (res.code == 2000) {
                toastr.success("注销成功");
                $state.go('login');
            } else {
                toastr.error(res.msg)
            }
        }, function(rej) {
            console.info(rej);
        });
    };
    $scope.changePassword = function(){
       $state.go('updatepassword');

    };
});
