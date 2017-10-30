/*
 * @Author: 唐文雍
 * @Date:   2016-05-09 20:52:27
 * @Last Modified by:   郝晓波
 * @Last Modified time: 2017-05-10 17:24:03
 */

'use strict';
App.controller('SideNavController', function ($scope, Session, msgBus, restful, toastr, $rootScope) {

    $scope.init = function () {
        $scope.refuseRoute = Session.$storage.refuseRoute;
        $scope.account = Session.$storage.account;
        $rootScope.userType = Session.$storage.userType;
        // $scope.sideNavPromise = restful.fetch($rootScope.api.getSideNav, "POST").then(function (res) {
        //     if(res.code == 2000 && res.data){
        //         $scope.sideNavList = res.data;
        //         console.log(res.data)
        //     }else{
        //         toastr.error('获取侧边栏失败！', res.msg);
        //     }
        // }, function (rej) {
        //     console.info(rej);
        // });
    };
    $scope.init();
    $scope.show = function (route) {
        return $scope.refuseRoute.indexOf(route) == -1;
    };
    msgBus.onMsg('login', $scope, function () {
        $scope.init();
    });
    //刷新页面后导航背景也会加深。
    $scope.hash = window.location.hash;
    $scope.$watch('hash', function (oldVal, newVal) {
        $scope.UrlHash = newVal;
    });
});
