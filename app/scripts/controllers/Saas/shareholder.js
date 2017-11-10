
/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//主体分成设置
'use strict';

App.controller('shareholderController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
    $scope.addShareholder = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'shareholderViewAdd.html',
            controller: 'shareholderAddController',
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
    };


    //弹窗修改按钮

    $scope.editDevCost = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editShareholder.html',
            controller: 'editShareholderController',
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
    $scope.deleteDevCost = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.shareholderDel, "POST", param).then(function (res) {
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
        $scope.shareholderListPromise = $http({
            url: $rootScope.api.shareholderList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "subjectName": $scope.data.subjectName,
                "userName": $scope.data.userName,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.shareholderListData = res.data.data;
                $scope.shareholderListDataCount = res.data.page_info.total;

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
App.controller("shareholderAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    $scope.save = function () {
        var params = {

            "subjectName": $scope.data.subjectName,
            "accountBank": $scope.data.accountBank,
            "accountName": $scope.data.accountName,
            "accountNum": $scope.data.accountNum,
            "accountType": $scope.data.accountType,


        };

        restful.fetch($rootScope.api.shareholderAdd, "POST", params).then(function (res) {
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
    };
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };




    //账户类型
    $scope.deviceKinds = {};
    $scope.deviceKind = [
        {
            id: 0,
            name: "公司账户"
        }, {
            id: 1,
            name: "个人账户"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };

}]);



/*
 -----------------
 修改
 -----------------
 */
App.controller("editShareholderController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};

    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.shareholderId, "POST", params).then(function (res) {
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



    //账户类型
    $scope.deviceKinds = {};
    $scope.deviceKind = [
        {
            id: 0,
            name: "公司账户"
        }, {
            id: 1,
            name: "个人账户"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };




    $scope.save = function () {
        var params = {

            "id": item.id,
            "subjectName": $scope.data.subjectName,
            "accountBank": $scope.data.accountBank,
            "accountName": $scope.data.accountName,
            "accountNum": $scope.data.accountNum,
            "accountType": $scope.data.accountType,


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.shareholderUpdate, "POST", params).then(function (res) {
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