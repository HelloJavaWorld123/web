/*
 * @Author: gaofan
 * @Date:   2017-06-07 19:29:18
 * @Last Modified by:   gaofan
 * @Last Modified time: 2017-07-25 11:24:35
 */

//排行榜
'use strict';
App.controller('rankListController', ['$scope', '$stateParams', '$state', '$rootScope', '$http', 'lifeHouseAreaSelector', 'toastr', 'ngProgressFactory', function ($scope, $stateParams, $state, $rootScope, $http, lifeHouseAreaSelector, toastr, ngProgressFactory) {


//子控制器-tab
}]).controller('tabRank', ['$scope', '$stateParams', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.rankListDataCount / $scope.PageSize) ? Math.ceil($scope.rankListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }
    //默认显示基本资料
    $scope.type = '01';
    $scope.click = function (type) {
        $scope.data = {};
        $scope.PageIndex = 1;
        $scope.type = type;
        console.log(type, "type:");
        $scope.query(type);
    };


    $rootScope.query = function () {

        $scope.data.groupType = 1;
        if ($scope.type == "01") {

            $scope.data.groupType = 1;
            $scope.data.startTime = $scope.data.startTime == null?new Date():$scope.data.startTime

        }
        if ($scope.type == "02") {

            $scope.data.groupType = 2;
            $scope.data.startTime = $scope.data.startTime == null?new Date():$scope.data.startTime
        }
        if ($scope.type == "03") {

            $scope.data.groupType = 3;

        }


        $scope.rankListDataPromise = $http({
            url: $rootScope.api.findRank,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {

                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "groupType": $scope.data.groupType,
                "mallId": $scope.data.mallId,
                "mobile": $scope.data.mobile,
                /*good*/
                "startTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),

            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.rankListData = res.data.data;
                $scope.rankListDataCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取排行榜列表失败");
            }
        });
    };

    $scope.query();

}]);

