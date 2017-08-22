/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-29 10:53:40
 */
//订单信息
'use strict';
App.controller('orderInfoController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.orderInfoListDataCount / $scope.PageSize) ? Math.ceil($scope.orderInfoListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }
    //*************************数据定义begin***********************************
    $scope.vipCard = [
        {
            "id": 0,
            "name": "月卡"
        }
    ];

    //设备类型
    $scope.deviceKind = [
        {
            id: 0,
            name: "跑步机"
        }, {
            id: 1,
            name: "椭圆机"
        }, {
            id: 2,
            name: "分析仪"
        }
    ];
  // 付款方式
    $scope.payType = [
        {
            id: 1,
            name: "会员卡"
        }, {
            id: 2,
            name: "钱包"
        }
    ]; // 场馆类型
    $scope.gymType = [
        {
            id: 0,
            name: "自营"
        }, {
            id: 1,
            name: "合作"
        }
    ];
    //*************************数据定义end***********************************
    //*************************分割线结束***********************************
    $rootScope.query = function () {
       // $scope.progressbar.start(); //进度条
        $scope.orderInfoListPromise = $http({
            url: $rootScope.api.getOrderInfo,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "gymType":$scope.data.gymType,
                "gymName":$scope.data.gymName,
                "mallId":$scope.data.mallId,
                "orderNum":$scope.data.orderNum,
                "deviceNum":$scope.data.deviceNum,
                "mobile":$scope.data.mobile,
                "payType":$scope.data.payType,
                "productId":$scope.data.productId,
                "startTime": $scope.data.todayStartTime?$scope.data.todayStartTime:$rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),
                "endTime": $scope.data.todayEndTime?$scope.data.todayEndTime:$rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.orderInfoListData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();


}]);
