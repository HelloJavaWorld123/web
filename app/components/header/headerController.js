/*
 * @Author: 唐文雍
 * @Date:   2016-05-09 21:17:22
 * @Last Modified by:   郝晓波
 * @Last Modified time: 2017-05-10 17:24:03
 */

'use strict';
App.controller('HeaderController',function($scope, $state, restful, Session, msgBus,$location,urlService, $rootScope, toastr) {
    $rootScope.title = "";

    msgBus.onMsg('login', $scope, function() {
        $scope.init();
    });
    $scope.init = function() {
        $scope.account = Session.$storage.account;
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

        /*获取跳转之前页面的url*/
         var pathUrl = $location.path().substring(6);
        urlService.set(pathUrl);
       $state.go('updatepassword');

    };
});
