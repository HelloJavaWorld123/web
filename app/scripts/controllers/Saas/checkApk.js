/**
 * Created by Administrator on 2017/8/7.
 */
'use strict';
App.controller('checkApkController', ['$scope', '$stateParams', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

    //变量声明
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.DevListDataCount / $scope.PageSize) ? Math.ceil($scope.DevListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
    }


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


    //状态
    $scope.deviceKind = [
        {
            id: 0,
            name: "失败"
        }, {
            id: 1,
            name: "成功"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.id = item.id;
    };


    $scope.query = function () {
        $scope.detailsPromise = $http({
            url: $rootScope.api.findApkPushState,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "id": $stateParams.id,
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "cityId": $scope.data.cityId,
                "deviceId": $scope.data.deviceId,
                "version": $scope.data.version,
                "state": $scope.data.state,
                "createTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,

            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.detailsData = res.data.data;
                $scope.detailsDataCount = res.data.page_info.total;
                console.log($scope.detailsData);

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg);
            }
        });
    };
    $scope.query();



}]);