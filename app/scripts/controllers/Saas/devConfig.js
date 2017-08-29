/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-07 14:32:33
 */
//设备设置
'use strict';
App.controller('DevConfigController', ['$scope', '$stateParams', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

    //变量声明
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.DevListDataCount / $scope.PageSize) ? Math.ceil($scope.DevListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }



    //弹窗新增
    $scope.add = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'DevViewAdd.html',
            controller: 'DevAddController',
            size: 'lg',
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

    //弹窗编辑
    $scope.DevEdit = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'DevViewEdit.html',
            controller: 'DevEditController',
            size: 'lg',
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
    $scope.DevDel = function (itemId) {
        var param = {
            id: itemId.id
        }
        restful.fetch($rootScope.api.delDev, "POST", param).then(function (res) {
            if (res.code == 2000) {
                console.log("删除接口通了");
                toastr.success("删除成功", res.msg);
                $scope.query();
            } else {
                toastr.error("删除失败", res.msg);
            }
        }, function (rej) {
            toastr.error("删除失败", res.msg);
        });
    }
    //
    // 状态切换
    //
    $scope.switchDevStatus = function (item) {
        var param = {
            id: item.id,
            onlineStatus: item.onlineStatus == 1 ? item.onlineStatus = 0 : 1

        };

        restful.fetch($rootScope.api.switchDevStatus, "POST", param).then(function (res) {
            if (res.code == 2000) {
                console.log(res, "状态切换返回：");
                toastr.success("切换状态成功", res.msg);
                $scope.query();
            } else {
                toastr.error("切换状态失败", res.msg);
            }
        }, function (rej) {
            toastr.error("切换状态失败", rej.msg);
        });
    };

    //*************************分割线结束***********************************

    $rootScope.query = function () {
        // $scope.progressbar.start(); //进度条
        $scope.DevListPromise = $http({
            url: $rootScope.api.getDevList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "count": parseInt($scope.PageSize) ? parseInt($scope.PageSize) : 20,
                "page": parseInt($scope.PageIndex) - 1 ? parseInt($scope.PageIndex) - 1 : 0,
                "gymId": $stateParams.gymId
            }
        }).then(function (res) {
            if (res.data.code == 2000) {

                $scope.DevListData = res.data.data;


                for (var i = 0; i < $scope.DevListData.length; i++) {
                    if ($scope.DevListData[i].onlineStatus == 0) {
                        $scope.DevListData[i].onlineStatusName = "在线";
                    }
                    if ($scope.DevListData[i].onlineStatus == 1) {
                        $scope.DevListData[i].onlineStatusName = "离线";
                    }
                    if ($scope.DevListData[i].onlineStatus == 2) {
                        $scope.DevListData[i].onlineStatusName = "使用中";
                    }
                }

                console.log($scope.DevListData, "设备的分页查询：");
                $scope.DevListDataCount = res.data.page_info.total;
                $scope.totalCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();

    //设备类型
    $scope.deviceKinds = {};
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
        }, {
            id: 3,
            name: "AR"
        }
    ];
    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };

    //设备厂商-跑步机
    $scope.deviceTradeT1s = {};
    $scope.deviceTradeT1 = [
        {
            id: 0,
            name: "好家庭"
        }, {
            id: 1,
            name: "汇祥"
        }
    ];
    $scope.getDeviceTradeT1 = function (item) {
        $scope.$scope.deviceTradeT1s.id = item.id;
    };
    //设备厂商-椭圆机+分析仪
    $scope.deviceTradeT2s = {};
    $scope.deviceTradeT2 = [
        {
            id: 2,
            name: "清华同方"
        }, {
            id: 3,
            name: "东华原"
        }
    ];
    $scope.getDeviceTradeT2 = function (item) {
        $scope.deviceTradeT2s.id = item.id;
    };
    //设备厂商-AR
    $scope.deviceTradeT3 = [
        {
            id: 4,
            name: "中大AR实验室"
        }
    ];
    $scope.deviceTradeT3s = {};
    $scope.getDeviceTradeT3 = function (item) {
        $scope.deviceTradeT3s.id = item.id;
    };



}]);

App.controller("DevAddController", ['$scope', '$stateParams', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $stateParams, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};
    /*数值监听*/
    $scope.$watch('data.onceTime', function (newValue, oldValue) {
        if ($scope.data) {
            if (newValue > 1000) {
                $scope.txtError = "单次运行最长不超过1000分钟";
                $scope.invalid = true;
            } else {
                $scope.txtError = "";
                $scope.invalid = false;
            }
        }
    }, true);
    /*增加设备*/
    $scope.save = function () {
        var params = {
            "productInfoId": $scope.data.productInfoId,
            "manufacturer": $scope.data.manufacturer,
            "deviceIdentity": $scope.data.deviceIdentity,
            "gymId": $stateParams.gymId,
            "model": $scope.data.model,

            "productionDate": $scope.data.todayStartTime ? $scope.data.todayStartTime : $rootScope.tools.dateToTimeStamp13Bit($scope.data.productionDate),
            "warrantyStartDate": $scope.data.todayStartTime ? $scope.data.todayStartTime : $rootScope.tools.dateToTimeStamp13Bit($scope.data.beginTime),
            "warrantyEndDate": $scope.data.todayEndTime ? $scope.data.todayEndTime : $rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),

            "onceTime": $scope.data.onceTime

        };
        console.log(params, "添加设备要丢给后台的字段");
        restful.fetch($rootScope.api.addDev, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("添加成功");
                console.log(res);
                $rootScope.query();
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
    //设备类型
    $scope.deviceKinds = {};
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
        }, {
            id: 3,
            name: "AR"
        }
    ];
    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };

    //设备厂商-跑步机
    $scope.deviceTradeT1s = {};
    $scope.deviceTradeT1 = [
        {
            id: 0,
            name: "好家庭"
        }, {
            id: 1,
            name: "汇祥"
        }
    ];
    $scope.getDeviceTradeT1 = function (item) {
        $scope.$scope.deviceTradeT1s.id = item.id;
    };
    //设备厂商-椭圆机+分析仪
    $scope.deviceTradeT2s = {};
    $scope.deviceTradeT2 = [
        {
            id: 2,
            name: "清华同方"
        }, {
            id: 3,
            name: "东华原"
        }
    ];
    $scope.getDeviceTradeT2 = function (item) {
        $scope.deviceTradeT2s.id = item.id;
    };
    //设备厂商-AR
    $scope.deviceTradeT3 = [
        {
            id: 4,
            name: "中大AR实验室"
        }
    ];
    $scope.deviceTradeT3s = {};
    $scope.getDeviceTradeT3 = function (item) {
        $scope.deviceTradeT3s.id = item.id;
    };

    //单次运行最长时间
    $scope.singleUseTime = function () {
        $scope.data.onceTime = $scope.data.onceTime == 0 ? null : 0;
        $scope.data.onceTime == 0 ? $('.singleUseTime').attr("disabled", "disabled") : $('.singleUseTime').removeAttr("disabled")
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
    $scope.getCountys = function (citys) {
        $scope.data.regionId = "";
        $scope.data.regionId = "";
        if (citys) {
            lifeHouseAreaSelector.getCountys(citys).then(function (countys) {
                //获取区（县）
                $scope.countys = countys;
            });
        }

    };

}]);


App.controller("DevEditController", ['$scope', '$http', '$uibModalInstance', 'restful', '$state', '$rootScope', '$uibModal', 'item', 'toastr', 'lifeHouseAreaSelector', function ($scope, $http, $uibModalInstance, restful, $state, $rootScope, $uibModal, item, toastr, lifeHouseAreaSelector) {


    $scope.data = {};
    /*数值监听*/
    $scope.$watch('data.onceTime', function (newValue, oldValue) {
        if ($scope.data) {
            if (newValue > 1000) {
                $scope.txtError = "单次运行最长不超过1000分钟";
                $scope.invalid = true;
            } else {
                $scope.txtError = "";
                $scope.invalid = false;
            }
        }
    }, true);
    //设备类型
    $scope.deviceKinds = {};
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
        }, {
            id: 3,
            name: "AR"
        }
    ];
    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };

    //设备厂商-跑步机
    $scope.deviceTradeT1s = {};
    $scope.deviceTradeT1 = [
        {
            id: 0,
            name: "好家庭"
        }, {
            id: 1,
            name: "汇祥"
        }
    ];
    $scope.getDeviceTradeT1 = function (item) {
        $scope.$scope.deviceTradeT1s.id = item.id;
    };
    //设备厂商-椭圆机+分析仪
    $scope.deviceTradeT2s = {};
    $scope.deviceTradeT2 = [
        {
            id: 2,
            name: "清华同方"
        }, {
            id: 3,
            name: "东华原"
        }
    ];
    $scope.getDeviceTradeT2 = function (item) {
        $scope.deviceTradeT2s.id = item.id;
    };
    //设备厂商-AR
    $scope.deviceTradeT3 = [
        {
            id: 4,
            name: "中大AR实验室"
        }
    ];
    $scope.deviceTradeT3s = {};
    $scope.getDeviceTradeT3 = function (item) {
        $scope.deviceTradeT3s.id = item.id;
    };


    /*
     -----------------
     编辑设备 begin
     -----------------
     */
    //1：通过设备id查询设备的信息
    $http({
        url: $rootScope.api.getDevById,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "id": item.id
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.data = res.data.data;
            $scope.data.beginTime = res.data.data.warrantyEndDate;
            $scope.data.endTime = res.data.data.warrantyEndDate;
            console.log($scope.data, '根据设备id获取设备的信息：');
        } else {
            toastr.error(res.msg, "获取设备信息列表失败");
        }
    });

    //2：编辑好后提交设备的信息
    $scope.saveDevEdit = function () {
        var params = {
            "id": item.id,
            "productInfoId": $scope.data.productInfoId,
            "manufacturer": $scope.data.manufacturer,
            "deviceIdentity": $scope.data.deviceIdentity,
            "model": $scope.data.model,
            "productionDate": $scope.data.productionDate,
            "warrantyStartDate": $scope.data.warrantyStartDate,
            "warrantyEndDate": $scope.data.warrantyEndDate,
            "onceTime": $scope.data.onceTime,
        };
        console.log(params, "编辑场馆要丢给后台的字段");
        restful.fetch($rootScope.api.EditDev, "POST", params).then(function (res) {
            if (res.code == 2000) {
                console.log(res, "编辑设备成功后台返回：");
                toastr.success('编辑设备成功');
                $rootScope.query();
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
    //单次运行最长时间
    $scope.singleUseTime = function () {
        $scope.data.onceTime = $scope.data.onceTime == 0 ? null : 0;
        $scope.data.onceTime == 0 ? $('.singleUseTime').attr("disabled", "disabled") : $('.singleUseTime').removeAttr("disabled")
    }


    //省市区-类型联动查询
    lifeHouseAreaSelector.getProvinces().then(function (provinces) {
        //获取省份
        $scope.provinces = provinces;
    });


    $scope.getCitys = function (provinces) {
        $scope.data.cityId = "";
        $scope.data.regionId = "";
        console.log($scope.data.cityId);
        if (provinces) {
            lifeHouseAreaSelector.getCitys(provinces).then(function (citys) {
                //获取市
                $scope.citys = citys;
                $scope.data.areaCode = provinces;
            });
        }

    };
    $scope.getCountys = function (citys) {
        $scope.data.regionId = "";
        if (citys) {
            lifeHouseAreaSelector.getCountys(citys).then(function (countys) {
                //获取区（县）

                $scope.countys = countys;
            });
        }

    };

}]);
