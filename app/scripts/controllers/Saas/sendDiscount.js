/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   goafan
 * @Last Modified time: 2017-07-24 17:36:05
 */
//卡券
'use strict';


App.controller('sendDiscountController', ['$scope', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
    //变量声明
    $scope.data = {};
    //卡券类型
    $scope.deviceKind = [
        {
            id: 0,
            name: "现金"
        }, {
            id: 1,
            name: "会员卡"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.id = item.id;
    };


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
    /*//导出
    document.getElementById('sendDiscountListEcho').action=$rootScope.api.sendDiscountEportExcel;*/




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

    $rootScope.query = function () {
        $scope.sendDiscountListPromise = $http({
            url: $rootScope.api.sendDiscount,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "mallId": $scope.data.mallId,
                "mobile": $scope.data.mobile,
                "type": $scope.data.type,
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.sendDiscountListData = res.data.data;
                $scope.sendDiscountListDataCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();

}]);
