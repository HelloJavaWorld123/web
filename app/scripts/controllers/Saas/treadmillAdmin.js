/*
 * @Author: 高帆
 * @Date:   2017-07-20 17:24:03
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-07-20 17:24:03
 */
//跑步机管理员管理
'use strict';

App.controller('treadmillAdminController', ['$scope','$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
        $scope.memberTypeDatas = {};
    }


    //弹窗新增
    $scope.addAdmin = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'adminViewAdd.html',
            controller: 'adminAddController',
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



    //弹窗編輯按钮

    $scope.editAdmin = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editAdmin.html',
            controller: 'editAdminController',
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



    //删除按钮
    $scope.deleteAdmin = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.treadmillAdminDel, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("删除成功", res.msg);
                $scope.query();
            } else {
                toastr.error("删除失败", res.msg);
            }
        }, function (rej) {
            toastr.error("删除失败", res.msg);
        });
    }


    $rootScope.query = function () {
        $scope.treadmillAdminListPromise = $http({
            url: $rootScope.api.treadmillAdminList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "managerName": $scope.data.managerName,
                "managerMobile": $scope.data.managerMobile,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.treadmillAdminListData = res.data.data;
                $scope.treadmillAdminListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取跑步机管理员列表失败");
            }
        });
    };
    $scope.query();




}]);

/*
 -----------------
 新建管理员
 -----------------
 */
App.controller("adminAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {

    $scope.data = {};

    $scope.save = function () {
        var params = {
            "managerName": $scope.data.managerName,
            "managerMobile": $scope.data.managerMobile,
            "managerAccount": $scope.data.managerMobile,
            "managerPassword": $scope.data.managerPassword,

        }

        restful.fetch($rootScope.api.treadmillAdminAdd, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("添加成功");
                console.log(res);
                $scope.query();
                $uibModalInstance.dismiss('close');
            } else {
                toastr.error(res.msg);
            }
        }, function (rej) {
            console.info(rej);
        });
    }
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };



}]);


/*
 -----------------
 编辑管理员
 -----------------
 */
App.controller("editAdminController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};




    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.treadmillAdminGetid, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }



        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });


    $scope.save = function () {
        alert(0)
        var params = {
            "id": item.id,

            "managerName": $scope.data.managerName,
            "managerMobile": $scope.data.managerMobile,
            "managerAccount": $scope.data.managerMobile,
            "managerPassword": $scope.data.managerPassword,



        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.treadmillAdminUpdate, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("添加成功");
                console.log(res);
                $scope.query();
                $uibModalInstance.dismiss('close');
            } else {
                toastr.error(res.msg);
            }
        }, function (rej) {
            console.info(rej);
        });
    }
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
}]);