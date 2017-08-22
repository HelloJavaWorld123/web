/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-07-24 15:16:04
 */
//预约
'use strict';


App.controller('makeOrderController', ['$scope', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
    //变量声明
    $scope.data = {};
    $scope.orderStatuses = {};
    //预约状态
    $scope.orderStatus = [
        {
            id: 0,
            name: "预约中"
        }, {
            id: 1,
            name: "已取消"
        }, {
            id: 2,
            name: "已爽约"
        }, {
            id: 3,
            name: "规定时间使用"
        }
    ];
    $scope.getorderStatus = function (item) {
        item={};//初始化，否则切换为undefined的时候报错。
        $scope.orderStatuses.id = item.id;
    };
    //查询定义
    $scope.query = function () {
        $scope.makeOrderListPromise = $http({
            url: $rootScope.api.getMakeOrder,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "mallId": $scope.data.mallId,
                "mobile": $scope.data.mobile,
                "status": $scope.data.status,
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId,
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize)
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.makeOrderListData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    //查询
    $scope.query();

    //分页
    $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    $scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
    $scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE;
    $scope.pageChanged = function () {
        $scope.query();
    };

    $scope.setPage = function () {
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.getAuditListCount / $scope.PageSize) ? Math.ceil($scope.getAuditListCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    };
    //导出

    document.getElementById('makeOrderListEcho').action=$rootScope.api.getMakeOrderEportExcel;

    //省市区-类型联动查询
    lifeHouseAreaSelector.getProvinces().then(function (provinces) {
        //获取省份
        $scope.provinces = provinces;
    });


    $scope.getCitys = function (provinces) {
        $scope.data.cityId = "";
        $scope.data.regionId = "";
        if (provinces) {
            lifeHouseAreaSelector.getCitys(provinces).then(function (citys) {
                //获取市
                $scope.citys = citys;
                $scope.data.areaCode = provinces;
            });
        }

    };

    //*************************分割线结束***********************************



}]);
