/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-19 16:24:53
 */
//用户详情
'use strict';
App.controller('userDetailController', ['$scope', '$stateParams', '$state', '$rootScope', '$http', 'lifeHouseAreaSelector', 'toastr', 'ngProgressFactory', function ($scope, $stateParams, $state, $rootScope, $http, lifeHouseAreaSelector, toastr, ngProgressFactory) {


//子控制器-tab
}]).controller('tabCon', ['$scope', '$stateParams', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.totalCount / $scope.PageSize) ? Math.ceil($scope.totalCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }
    //默认显示基本资料
    $scope.type = '01';

    $scope.query = function (type) {
        //$scope.progressbar.start(); //进度条
        $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail01;
        //根据选择不同的tab的head选择不同的数据源
        if (type == "01") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail01;
        }
        if (type == "02") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail02;
            console.log($scope.switchgetUserDetailDetailApi, "地址type=02：");
        }
        if (type == "03") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail03;
        }
        if (type == "04") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail04;
        }
        if (type == "05") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail05;
        }

        $scope.userDetailDataPromise = $http({
            url: $scope.switchgetUserDetailDetailApi,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "id": $stateParams.id,
                // "id":"215c3f7f4f5e11e7ac6fd017c28cff0d",//验证运动记录
                // "id":"164a59f954d811e7bbddd017c28cff0d",//验证检测报告
                "count": parseInt($scope.PageSize) ? parseInt($scope.PageSize) : 20,
                "page": parseInt($scope.PageIndex) - 1 ? parseInt($scope.PageIndex) - 1 : 0,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.item = res.data.data;
                $scope.totalCount=res.page_info.total.

                console.log(res.data, "用户基本信息：");
            } else {
                $scope.item = undefined;
                console.log(res.data.msg, "获取信息失败：");
            }
        }, function (rej) {
            toastr.error("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };


    $scope.click = function (type) {
        $scope.type = type;
        /*容错处理，tab切换时候index置1；数据对象置空，否则页码切换，再切换条数错乱*/
        $scope.data = {};
        $scope.PageIndex = 1;

        $scope.query(type);
    }

    $scope.query($scope.type);
    //点击进入体测报告详情
    $scope.userBodyReport = function (id) {

        $state.go('userBodyReport02', {"bodyReportId": id});

    };

    //点击进入跑步方案详情
    $scope.userRunProgram = function (data) {
        /*  console.log(id,"运动方案id:");
         $state.go('sportProgram',{"sportProgramId":id});
         */

        console.log(data.schemeId, "schemeId:");

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'sportProgramViewEdit.html',
            controller: 'sportProgramEditControllerUnEdit',
            size: 'lg',
            resolve: {
                item: function () {
                    return data;
                }
            },
        });
    }
}]);

// 编辑运动方案
App.controller("sportProgramEditControllerUnEdit", ['$scope', '$http', '$uibModalInstance', 'restful', '$state', '$rootScope', '$uibModal', 'item', 'toastr', 'lifeHouseAreaSelector', function ($scope, $http, $uibModalInstance, restful, $state, $rootScope, $uibModal, item, toastr, lifeHouseAreaSelector) {
    //分页
    $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    $scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
    //丢给后台的方案数据
    $scope.sportStageData = [];
    //1：通过id查询信息
    $http({
        url: $rootScope.api.getSportProgramById,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "schemeId": item.schemeId
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.data = res.data.data;
            $scope.sportStageData = res.data.data.detailInDTOList;
            console.log(res.data, "编辑前拿数据：");


        } else {
            toastr.error('获取失败', res.data.msg)
        }
    }, function (rej) {
        console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
    });


    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
}]);