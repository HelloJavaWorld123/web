/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//角色管理
'use strict';

App.controller('actorManageController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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




    //弹窗新增
    $scope.addActor = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'actorViewAdd.html',
            controller: 'actorAddController',
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



    //弹窗设置权限组

    $scope.editActorList = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editActorList.html',
            controller: 'editActorListController',
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



    //弹窗修改按钮

    $scope.editActor = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editActor.html',
            controller: 'editActorController',
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
    $scope.deleteActor = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.actorManageDel, "POST", param).then(function (res) {
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
        $scope.actorManageListPromise = $http({
            url: $rootScope.api.actorManageList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "name": $scope.data.name,

            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.actorManageListData = res.data.data;
                $scope.actorManageListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



}]);


/*
 -----------------
 新增
 -----------------
 */
App.controller("actorAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    $scope.save = function () {
        var params = {

            "name": $scope.data.name,
            "description": $scope.data.description,

        }

        restful.fetch($rootScope.api.actorManageAdd, "POST", params).then(function (res) {
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
 修改
 -----------------
 */
App.controller("editActorController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};



    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.actorManageId, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }
            console.log($scope.data,"$scope.data:");


        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });



    $scope.save = function () {
        var params = {

            "name": $scope.data.name,
            "description": $scope.data.description,


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.actorManageUpdate, "POST", params).then(function (res) {
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
 设置权限组
 -----------------
 */
App.controller("editActorListController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};



    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.actorManageRoleList, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }
            console.log($scope.data,"$scope.data:");


        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });



    $scope.save = function () {
        var params = {

            "name": $scope.data.name,
            "description": $scope.data.description,


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.actorManageRoleAdd, "POST", params).then(function (res) {
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