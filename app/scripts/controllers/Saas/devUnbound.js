/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-07 14:32:33
 */
//场馆设置
'use strict';
App.controller('DevUnbound1Controller', ['$scope', '$stateParams', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
        $scope.query();
    }


    //*************************分割线结束***********************************

    $rootScope.query = function () {

        $scope.DevListPromise = $http({
            url: $rootScope.api.getDevUnboundList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "count": parseInt($scope.PageSize) ? parseInt($scope.PageSize) : 20,
                "page": parseInt($scope.PageIndex) - 1 ? parseInt($scope.PageIndex) - 1 : 0,
                "deviceIdentity": $scope.data.deviceIdentity
            }
        }).then(function (res) {
            if (res.data.code == 2000) {

                $scope.DevListData = res.data.data;
                console.log(typeof $scope.DevListData);

/*
                for(var item in  $scope.DevListData){
                    console.log($scope.DevListData[item].bindStatusName="绑定","item:");
                }
*/

                $scope.totalCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();
    //解绑
    $scope.lockToUnbound = function (id) {
        console.log(id,"设备号：");
        $http({
            url: $rootScope.api.getDevUnbound,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "deviceIdentity":id
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success("解绑成功");
                $scope.query();

            }else{
                toastr.error("解绑失败");
            }
        },function (rej) {
            toastr.error(res.msg);

        });

    }


}]);
