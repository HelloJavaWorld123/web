/*
 * @Author: 高帆
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-05-31 17:24:03
 */
//报障
'use strict';

App.controller('reportFaultController', ['$scope','$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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

    /*$scope.setPage = function () {
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.getAuditListCount / $scope.PageSize) ? Math.ceil($scope.getAuditListCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };*/
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }




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

    $scope.getDeviceKind = function (item) {
        $scope.id = item.id;
    };


    //保障原因
    $scope.reportFaultCause = [
        {
            id: 0,
            name: "二维码脱落"
        }, {
            id: 1,
            name: "设备损坏"
        }, {
            id: 2,
            name: "设备故障"
        }
    ];
    $scope.getreportFaultCause = function (item) {
        $scope.id = item.id;

    };

    //状态
    $scope.state = [
        {
            id: 0,
            name: "待确认"
        }, {
            id: 1,
            name: "待维修"
        }, {
            id: 2,
            name: "已修复"
        }, {
            id: 3,
            name: "非故障"
        }
    ];
    $scope.getstate = function (item) {
        $scope.id = item.id;
    };


    //*********************************************************//

    $rootScope.query = function () {
        $scope.reportFaultListPromise = $http({
            url: $rootScope.api.getReportFaultList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
                "deviceIdentity": $scope.data.deviceIdentity,
                "mallName": $scope.data.mallName,
                "mobile": $scope.data.mobile,
                "productInfoId": $scope.data.productInfoId,
                "progress": $scope.data.progress,
                "malfunctionType": $scope.data.malfunctionType
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.reportFaultListData = res.data.data;
                $scope.reportFaultListDataCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取报障列表失败");
            }
        });
    };
    $scope.query();





    //弹窗确认故障
    $scope.confirmReportFault = function (itemId) {
        var param = {
            id: itemId.id,
            progress: itemId.progress.code == 0 ? itemId.progress.code = 1 : 0
        }
        restful.fetch($rootScope.api.changeProgress, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("报障成功", res.msg);
                $scope.query();
            } else {
                toastr.error("报障失败", res.msg);
            }
        }, function (rej) {
            toastr.error("报障失败", res.msg);
        });
    }


    //弹窗确认修复
    $scope.confirmRepair = function (itemId) {
        var param = {
            id: itemId.id,
            progress: itemId.progress.code == 1 ? itemId.progress.code = 2 : 1
        }
        restful.fetch($rootScope.api.changeProgress, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("修复成功", res.msg);
                $scope.query();
            } else {
                toastr.error("修复失败", res.msg);
            }
        }, function (rej) {
            toastr.error("修复失败", res.msg);
        });
    }

    //弹窗确认不是故障
    $scope.confirmNotReportFault = function (itemId) {
        var param = {
            id: itemId.id,
            progress: itemId.progress.code == 0 ? itemId.progress.code = 3 : 0
        }
        restful.fetch($rootScope.api.changeProgress, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("未报障", res.msg);
                $scope.query();
            } else {
                toastr.error("报障失败", res.msg);
            }
        }, function (rej) {
            toastr.error("报障失败", res.msg);
        });
    }


    //点击图片详情
    $scope.picDetial = function(data){
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'picturesDetail.html',
            controller: 'picturesDetailController',
            size: 'md',
            resolve: {
                item: function () {
                    return data;
                }
            },
        });
        modalInstance.result.then(function () {
            //close
            $scope.query();
        }, function () {
            //dismissed
            $scope.query();
        })
    }

}]);



App.controller("picturesDetailController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', '$uibModal', 'item', 'toastr', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, $uibModal, item, toastr, lifeHouseAreaSelector) {

    $rootScope.query();
    $scope.pictureList = item.pictureList;


    //$scope.getpictureList = function ($item) {
    //    $scope.pictureList = $item.pictureList;
    //
    //};

    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
}]);
