/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//分成统计
'use strict';

App.controller('shareCountController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
        $scope.shareCountListPromise = $http({
            url: $rootScope.api.shareCountList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "subjectId": $scope.data.subjectId,
                "trainerMallId": $scope.data.trainerMallId,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.shareCountListData = res.data.data;
                $scope.shareCountListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });

        $scope.shareCountListAmount = $http({
            url: $rootScope.api.shareCountAmount,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {

                "subjectId": $scope.data.subjectId,
                "trainerMallId": $scope.data.trainerMallId,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.shareCountAmountData = res.data.data;

            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });

    };
    $scope.query();



}]);
