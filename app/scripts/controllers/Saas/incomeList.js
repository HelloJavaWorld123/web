/**
 * Created by haoxb on 2017/6/23.
 */
'use strict';
App.controller('incomeListController', ['$scope', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', 'toastr', function ($scope, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, toastr) {
    $scope.data = {};
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
    };

    //查询运动方案
    $rootScope.query = function () {
        var params = {
            "page": parseInt($scope.PageIndex) - 1,
            "count": parseInt($scope.PageSize),
            "orderNo": $scope.data.orderNo,
            "startTime": $scope.data.startTime,
            "endTime": $scope.data.endTime,

        };
        $http({
            url: $rootScope.api.getIncomeList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.incomeListData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
                console.log(res.data, "运动方案：");
            } else {
                toastr.error(res.data.msg);
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };
    $scope.query();

    //下拉开关
    $scope.listBodyIsShow = false;
    //下拉单击事件。
    $scope.getSubjectList = function (subjectItem, item) {
        item.subjectName = subjectItem.subjectName;//
        item.subjectId = subjectItem.subjectId;
        item.listBodyIsShow = false;
        console.log(item.subjectId);
    }
    //获取主体-支持模糊搜索-编辑-根据主体id反查出主体名字
    $scope.getSubject = function (item) {
        item.listBodyIsShow = true;
        if (!item.subjectName || (item.subjectName && item.subjectName == "")) {
            return false;
        }
        //subject:用户输入
        var timer = setTimeout(function () {
            $http({
                url: $rootScope.api.getIncomeGymList,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "subjectName": item.subjectName,
                }
            }).then(function (res) {
                if (res.data.code == 2000) {
                    //下来列表里的备选
                    item.subjectListData = res.data.data;
                    //下拉开关
                    item.listBodyIsShow = true;
                }
                /*else{
                 toastr.error(res.msg);
                 }
                 },function (rej) {
                 console.info(rej);*/
            });
        }, 500);
    };
}]);
