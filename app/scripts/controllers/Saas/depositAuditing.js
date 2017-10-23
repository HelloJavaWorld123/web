/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//提现审核
'use strict';

App.controller('depositAuditingController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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



    //弹窗确认审核
    $scope.confirmAuditing = function (itemId,num) {
        var param = {
            id: itemId.id,
            auditStatus: num
        }
        restful.fetch($rootScope.api.depositAuditingStatus, "POST", param).then(function (res) {
            if (res.code == 2000) {
                if(num == 1){
                    toastr.success("审核通过", res.msg);
                }else if(num == 2){
                    toastr.success("审核不通过", res.msg);
                }

                $scope.query();
            } else {
                toastr.error("审核失败", res.msg);
            }
        }, function (rej) {
            toastr.error("审核失败", res.msg);
        });
    }




    //审核状态
    $scope.deviceKinds = {};
    $scope.deviceKind = [
        {
            id: 0,
            name: "未审核"
        }, {
            id: 1,
            name: "审核通过"
        }, {
            id: 2,
            name: "审核不通过"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };

    $rootScope.query = function () {
        $scope.depositAuditingListPromise = $http({
            url: $rootScope.api.depositAuditingList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "bizName": $scope.data.bizName,
                "auditStatus": $scope.data.auditStatus,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.depositAuditingListData = res.data.data;
                $scope.depositAuditingListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



}]);
