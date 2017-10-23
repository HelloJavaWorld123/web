/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//场地方收入明细
'use strict';

App.controller('mainIncomeController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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




    //会员卡类型
    $scope.memberTypeDatas = {};
    $scope.memberTypeData = [];


    $scope.memberTypePromise = $http({
        url: $rootScope.api.getDicGymList,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "userName":"dl1709300001"
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.memberTypeData = res.data.data;
            console.log($scope.memberTypeData);


            $scope.getMemberTypeData = function (item) {
                $scope.memberTypeDatas.gymName = item.gymName;

            };

        }
    });


    $rootScope.query = function () {
        $scope.mainIncomeListPromise = $http({
            url: $rootScope.api.mainIncomeList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "orderNo": $scope.data.orderNo,
                "gymId": $scope.data.gymId,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.mainIncomeListData = res.data.data;
                $scope.mainIncomeListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



}]);