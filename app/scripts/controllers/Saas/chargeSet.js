/*
 * @Author: gaof
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-05-31 17:24:03
 */
//充值设置
'use strict';

App.controller('chargeSetController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
    }


    //弹窗新增
    $scope.addActivity = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'chargeViewAdd.html',
            controller: 'chargeAddController',
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

    $scope.editActivity = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editCharge.html',
            controller: 'editChargeController',
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
    $scope.deleteActivity = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.chargeDel, "POST", param).then(function (res) {
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
        $scope.chargeListPromise = $http({
            url: $rootScope.api.chargeList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.chargeListData = res.data.data;
                $scope.chargeListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取活动列表失败");
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
App.controller("chargeAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    $scope.save = function () {
        var params = {

            "amount": $scope.data.amount,
            "amountExt": $scope.data.amountExt,
            "copywriting": $scope.data.copywriting,
            "hasPresentActive": $scope.data.hasPresentActive,


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.chargeAdd, "POST", params).then(function (res) {
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


    $scope.data.hasPresentActive = 0
    //点击参加活动
    $scope.autoRenew = function(){
        $scope.data.hasPresentActive = $scope.data.hasPresentActive == 0?1:0;
    }




}]);



/*
 -----------------
 编辑
 -----------------
 */
App.controller("editChargeController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};


    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.chargeGetid, "POST", params).then(function (res) {
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
        var params = {
            "id": item.id,
            "amount": $scope.data.amount,
            "amountExt": $scope.data.amountExt,
            "copywriting": $scope.data.copywriting,
            "hasPresentActive": $scope.data.hasPresentActive,



        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.chargeUpdate, "POST", params).then(function (res) {
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



    //点击参加活动
    $scope.autoRenew = function(){
        $scope.data.hasPresentActive = $scope.data.hasPresentActive == 0?1:0;
    }


}]);