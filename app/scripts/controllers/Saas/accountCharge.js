/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-29 16:31:17
 */
//账户充值
'use strict';
App.controller('accountChargeController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.accountChargeListDataCount / $scope.PageSize) ? Math.ceil($scope.accountChargeListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }
// 付款方式
    $scope.payType = [
        {
            id: 1,
            name: "支付宝"
        }, {
            id: 2,
            name: "微信"
        }, {
            id: 3,
            name: "系统支付"
        }
    ];
    //*************************分割线结束***********************************
    $rootScope.query = function () {
        //$scope.progressbar.start(); //进度条
        $scope.accountChargeListPromise = $http({
            url: $rootScope.api.getAccountCharge,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "mallId": $scope.data.mallId,
                "orderNo": $scope.data.orderNo,
                "mobile": $scope.data.mobile,
                "startTime":  $rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),
                "endTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.accountChargeListData = res.data.data;
                $scope.accountChargeListDataCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();


}]);
