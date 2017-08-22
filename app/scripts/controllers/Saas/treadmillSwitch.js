/*
 * @Author: 高帆
 * @Date:   2017-07-26 17:24:03
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-07-26 17:24:03
 */
//跑步机开关机管理
'use strict';

App.controller('treadmillSwitchController', ['$scope','$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.getAuditListCount / $scope.PageSize) ? Math.ceil($scope.getAuditListCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
    }



    //省市区-类型联动查询
    lifeHouseAreaSelector.getProvinces().then(function (provinces) {
        //获取省份
        $scope.provinces = provinces;
    });


    $scope.getCitys = function (provinces) {
        $scope.data.cityId = "";
        $scope.data.regionId = "";
        if (provinces) {
            lifeHouseAreaSelector.getCitys(provinces).then(function (citys) {
                //获取市
                $scope.citys = citys;
                $scope.data.areaCode = provinces;
            });
        }

    };


    //状态
    $scope.progress = [
        {
            id: 0,
            name: "未应用"
        }, {
            id: 1,
            name: "已应用"
        }
    ];
    $scope.getprogress = function (item) {
        $scope.id = item.id;
    };


    //是否应用
    $scope.publish = function (itemId) {
        var param = {
            id: itemId.id,

        }
        restful.fetch($rootScope.api.upushPowerOnTime, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("应用成功", res.msg);
                itemId.state = 1
                console.log(itemId.state);
                $scope.query();

            } else {
                toastr.error("应用失败", res.msg);
            }
        }, function (rej) {
            toastr.error("应用失败", res.msg);
        });
    }



    //弹窗新建
    $scope.addSwitch = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'switchViewAdd.html',
            controller: 'switchAddController',
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
    $scope.deleteSwitch = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.treadmillSwitchDel, "POST", param).then(function (res) {
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


    //弹窗編輯按钮

    $scope.editSwitch = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editSwitch.html',
            controller: 'editSwitchController',
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



    $rootScope.query = function () {
        $scope.treadmillSwitchListPromise = $http({
            url: $rootScope.api.treadmillSwitchList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.treadmillSwitchListData = res.data.data;

            } else {
                toastr.error(res.msg);
            }
        });
    };
    $scope.query();



}]);



/*
 -----------------
 新建开关机规则
 -----------------
 */
App.controller("switchAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {

    $scope.data = {};

    $scope.save = function () {
        var params = {
            "startTime": $scope.data.beginTime,
            "endTime": $scope.data.endTime,
            "provinceId": $scope.data.provinceId,
            "cityId": $scope.data.cityId,

        }

        restful.fetch($rootScope.api.treadmillSwitchAdd, "POST", params).then(function (res) {
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


    //省市区-类型联动查询
    lifeHouseAreaSelector.getProvinces().then(function (provinces) {
        //获取省份
        $scope.provinces = provinces;
    });


    $scope.getCitys = function (provinces) {
        $scope.data.cityId = "";
        $scope.data.regionId = "";
        if (provinces) {
            lifeHouseAreaSelector.getCitys(provinces).then(function (citys) {
                //获取市
                $scope.citys = citys;
                $scope.data.areaCode = provinces;
            });
        }

    };





}]);



/*
 -----------------
 开关机编辑
 -----------------
 */
App.controller("editSwitchController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {



    //省市区-类型联动查询
    lifeHouseAreaSelector.getProvinces().then(function (provinces) {
        //获取省份
        $scope.provinces = provinces;
    });




    // 编辑-反向向联动
    $scope.getCitys = function (provinces) {
         /*  $scope.data.cityId = "";
         $scope.data.regionId = "";*/
        if (provinces) {
            lifeHouseAreaSelector.getCitys(provinces).then(function (citys) {
                //获取市
                $scope.citys = citys;
                $scope.data.areaCode = provinces;
            });
        }


    };



    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    $scope.data={};

    restful.fetch($rootScope.api.treadmillSwitchGetbyid, "POST", params).then(function (res) {
        if (res.code == 2000) {
            console.log(res.data,"res.data:");
            /*for (var key in res.data) {
             $scope.data[key] = res.data[key];
             }*/
            $scope.data = res.data;
            $scope.data.beginTime = $scope.data.startTime
            console.log($scope.data,"$scope.data:");


            $scope.getCitys(res.data.provinceId);
            $scope.data.cityId = res.data.cityId;

        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });


    $scope.save = function () {
        var params = {
            "id": item.id,

            "startTime": $scope.data.beginTime,
            "endTime": $scope.data.endTime,
            "provinceId": $scope.data.provinceId,
            "cityId": $scope.data.cityId,



        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.treadmillSwitchAlter, "POST", params).then(function (res) {
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