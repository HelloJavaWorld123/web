/*
 * @Author: 高帆
 * @Date:   2017-07-26 17:24:03
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-07-26 17:24:03
 */
//场馆软件升级管理
'use strict';

App.controller('gymUpgradeController', ['$scope','$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
        $scope.query();
    }




    //状态
    $scope.progress = [
        {
            id: 0,
            name: "未发布"
        }, {
            id: 1,
            name: "已发布"
        }
    ];
    $scope.getprogress = function (item) {
        $scope.id = item.id;
    };

    //类型
    $scope.fileType = [
        {
            id: 0,
            name: "apk"
        }, {
            id: 1,
            name: "bin"
        }
    ];
    $scope.getFileType = function (item) {
        $scope.id = item.id;
    };

    //发布
    $scope.publish = function (itemId) {
        var param = {
            id: itemId.id
        }
        restful.fetch($rootScope.api.pushApk, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("发布成功", res.msg);
                itemId.state = 1;
                $scope.query();
            } else {
                toastr.error("发布失败", res.msg);
            }
        }, function (rej) {
            toastr.error("发布失败");
        });
    }



    //弹窗上传apk
    $scope.addApk = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'apkViewAdd.html',
            controller: 'apkAddController',
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

    $scope.editApk = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editApk.html',
            controller: 'editApkController',
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



    //弹窗查看详情
    $scope.checkApk = function (gymId) {
        $state.go("checkApk", {"id": gymId});

    }



    //删除按钮
    $scope.deleteApk = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.gymUpgradeDel, "POST", param).then(function (res) {
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
        $scope.gymUpgradeListPromise = $http({
            url: $rootScope.api.gymUpgradeList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "createTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
                "version": $scope.data.version,
                "type": $scope.data.type,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.gymUpgradeListData = res.data.data;
                $scope.gymUpgradeListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取软件版本列表失败");
            }
        });
    };
    $scope.query();






}]);


/*
 -----------------
 上传apk
 -----------------
 */
App.controller("apkAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {

    $scope.data = {};

    $scope.save = function () {
        var params = {
            "version": $scope.data.version,
            "apkUpdateTime": $scope.data.apkUpdateTime,
            "url": $scope.imgUrlIcoArr1[0].serverFileName,
            "description": $scope.data.description,
            "type": $scope.data.type,

        }

        restful.fetch($rootScope.api.gymUpgradeAdd, "POST", params).then(function (res) {
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


    //取消上传图片
    $scope.delIco = function (index,picIndex) {
        var key = 'imgUrlIcoArr' + picIndex
        $scope[key].splice(index,1);
    }


    //类型
    $scope.fileType = [
        {
            id: 0,
            name: "apk"
        }, {
            id: 1,
            name: "bin"
        }
    ];
    $scope.getFileType = function (item) {
        $scope.id = item.id;
    };

}]);


/*
 -----------------
 上传apk编辑
 -----------------
 */
App.controller("editApkController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {


    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.gymUpgradeGetid, "POST", params).then(function (res) {
        if (res.code == 2000) {

            console.log(res.data,"res.data:");
            /*for (var key in res.data) {
             $scope.data[key] = res.data[key];
             }*/
            $scope.data = res.data;

            $scope.imgUrlIcoArr1 = [{serverFileName:$scope.data.url}];
            console.log($scope.data,"$scope.data:");

        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });


    $scope.save = function () {
        var params = {
            "id": item.id,

            "version": $scope.data.version,
            "apkUpdateTime": $scope.data.apkUpdateTime,
            "url": $scope.imgUrlIcoArr1[0].serverFileName,
            "description": $scope.data.description,
            "type": $scope.data.type,



        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.gymUpgradeUpdate, "POST", params).then(function (res) {
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



    //取消上传图片
    $scope.delIco = function (index,picIndex) {
        var key = 'imgUrlIcoArr' + picIndex
        $scope[key].splice(index,1);
    }


    //类型
    $scope.fileType = [
        {
            id: 0,
            name: "apk"
        }, {
            id: 1,
            name: "bin"
        }
    ];
    $scope.getFileType = function (item) {
        $scope.id = item.id;
    };
}]);


