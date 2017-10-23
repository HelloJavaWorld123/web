/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//订单分成管理
'use strict';

App.controller('incomeManageController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

    //参数存放
    $scope.data = {};
    $scope.progressbar = ngProgressFactory.createInstance();
    //分页
    $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    $scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
    $scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE;
    $scope.pageChanged = function () {
        $scope.query();
    };

    $scope.setPage = function () {
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.userDetailDataCount / $scope.PageSize) ? Math.ceil($scope.userDetailDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }







    $rootScope.query = function () {
        $scope.incomeManageListPromise = $http({
            url: $rootScope.api.incomeManageList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
                "gymName": $scope.data.gymName,
                "proxyName": $scope.data.proxyName,
                "gymSharingName": $scope.data.gymSharingName,
                "channelName": $scope.data.channelName,
                "developName": $scope.data.developName,
                "marketName": $scope.data.marketName,
                "orderNo": $scope.data.orderNo,
                "trainerMallId": $scope.data.trainerMallId,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.incomeManageListData = res.data.data;
                $scope.incomeManageListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



}]);

