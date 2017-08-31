'use strict';

/*
 * @Author: 唐文雍
 * @Date:   2016-04-15 14:28:07
 * @Last Modified by:   郝晓波
 * @Last Modified time: 2017-05-10 17:24:03
 */

App.controller('MainController',['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {
    if (!AuthService.isAuthorized('dashboard')){
        $state.go('login');
    }
}]);

/**
 * Created by Administrator on 2017/8/7.
 */
'use strict';
App.controller('checkApkController', ['$scope', '$stateParams', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
    $scope.deviceKind = [
        {
            id: 0,
            name: "失败"
        }, {
            id: 1,
            name: "成功"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.id = item.id;
    };


    $scope.query = function () {
        $scope.detailsPromise = $http({
            url: $rootScope.api.findApkPushState,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "id": $stateParams.id,
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "cityId": $scope.data.cityId,
                "deviceId": $scope.data.deviceId,
                "version": $scope.data.version,
                "state": $scope.data.state,
                "createTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,

            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.detailsData = res.data.data;
                $scope.detailsDataCount = res.data.page_info.total;
                console.log($scope.detailsData);

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg);
            }
        });
    };
    $scope.query();



}]);
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

/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-07 11:43:51
 */
//场馆设置
'use strict';

App.controller('gymConfigController', ['$scope', 'CommonData', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, CommonData, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

    //pageGpsShowOrHidden监听页码控件该有的状态进行切换
    $scope.$watch('allShowOrHidden', function () {
        if ($scope.allShowOrHidden == 1) {
            $('.pageGpsShowOrHidden').show();
        } else {
            $('.pageGpsShowOrHidden').hide();
        }
    });


    /*
     -----------------
     场馆列表 begin
     -----------------
     */


    //参数存放
    $scope.data = {};

    // $scope.progressbar = ngProgressFactory.createInstance();
    //分页
    $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    $scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
    $scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE;
    $scope.pageChanged = function () {
        $scope.query();
    };
    $scope.setPage = function () {
        console.log($scope.totalCount, "totalCount:=====");
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.totalCount / $scope.PageSize) ? Math.ceil($scope.totalCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    };
    //*************************分割线开始***********************************
    //省市区-类型联动查询
    lifeHouseAreaSelector.getProvinces().then(function (provinces) {
        //获取省份
        $scope.provinces = provinces;
    });
    // 编辑-反向向联动
    $scope.getCitys = function (provinces) {
        /*   $scope.data.cityId = "";
         $scope.data.regionId = "";*/
        if (provinces) {
            lifeHouseAreaSelector.getCitys(provinces).then(function (citys) {
                //获取市
                $scope.citys = citys;
                $scope.data.areaCode = provinces;
            });
        }

    };
    // 查询新增-正向联动
    $scope.getCitysForward = function (provinces) {
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
    // 编辑-反向向联动
    $scope.getCountys = function (citys) {
        // $scope.data.regionId = "";
        if (citys) {
            lifeHouseAreaSelector.getCountys(citys).then(function (countys) {
                //获取区（县）
                $scope.countys = countys;
            });
        }

    };
    // 查询新增-正向联动
    $scope.getCountysForward = function (citys) {
        $scope.data.regionId = "";
        if (citys) {
            lifeHouseAreaSelector.getCountys(citys).then(function (countys) {
                //获取区（县）
                $scope.countys = countys;
            });
        }

    };



    //*************************分割线结束***********************************
    $rootScope.query = function () {
        var params = {
            "currentPage": parseInt($scope.PageIndex) - 1,
            "pageSize": parseInt($scope.PageSize),
            "name": $scope.data.name,
            "provinceId": $scope.data.provinceId == "" ? undefined : Number($scope.data.provinceId),
            "cityId": $scope.data.cityId == "" ? undefined : Number($scope.data.cityId),
            "regionId": $scope.data.regionId == "" ? undefined : Number($scope.data.regionId)
        };
        console.log(params, "查询场馆的入参：");
        $http({
            url: $rootScope.api.getGymList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.gymListData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
                console.log(res.data, "获取场馆列表：");

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取场馆列表失败");
            }
        });
    };
    $scope.query();
    //弹窗新增
    $rootScope.modalAddShowOrHidden = 0;
    $rootScope.allShowOrHidden = 1;//非模态，默认显示
    $scope.addGym = function () {
        //新增的modal显示
        $rootScope.modalAddShowOrHidden = 1;
        // 编辑的modal的隐藏
        $rootScope.modalEditShowOrHidden = 0;
        //非modal隐藏
        if ($rootScope.modalAddShowOrHidden == 1 || $rootScope.modalEditShowOrHidden == 1) {
            $rootScope.allShowOrHidden = 0;//非模态都隐藏
        } else { // 非新增或编辑
            $rootScope.allShowOrHidden = 1;//非模态都显示
        }

    };
    $scope.gymEditData={};
    //弹窗编辑
    $rootScope.modalEditShowOrHidden = 0;
    $scope.gymEdit = function (gym) {
        // 编辑的modal的显示
        $rootScope.modalEditShowOrHidden = 1;
        //新增的modal隐藏
        $rootScope.modalAddShowOrHidden = 0;
        //非modal隐藏
        if ($rootScope.modalAddShowOrHidden == 1 || $rootScope.modalEditShowOrHidden == 1) {
            $rootScope.allShowOrHidden = 0;//非模态都隐藏
        } else { // 非新增或编辑
            $rootScope.allShowOrHidden = 1;//非模态都显示
        }

        $rootScope.gymId = gym.id;

        //1：通过id查询场馆的信息
        var params = {
            id: $rootScope.gymId
        };
        restful.fetch($rootScope.api.getGymById, "POST", params).then(function (res) {
            if (res.code == 2000) {
                console.log(res.data, "编辑弹窗里绑定的数据res.data：");
                for (var key in res.data) {
                    $scope.gymEditData[key] = res.data[key];
                }


                $scope.getCitys(res.data.provinceId);
                $scope.getCountys(res.data.cityId);


                $scope.gymEditData.cityId = res.data.cityId;

            } else {
                toastr.error(res.msg);
            }
        }, function (rej) {
            console.info(rej);
        });
    };


    //删除按钮
    $scope.gymDel = function (itemId) {
        var param = {
            id: itemId.id
        }
        restful.fetch($rootScope.api.delGym, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("删除成功", res.msg);
                $scope.query();
            } else {
                toastr.error("删除失败", res.msg);
            }
        }, function (rej) {
            toastr.error("删除失败", res.msg);
        });



    };



    //弹窗显示场馆对应的设备详细信息
    $scope.devDetailList = function (gymId) {
        console.log(gymId, "场馆的id：");
        $state.go("devConfig", {"gymId": gymId});

    };


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

    $scope.getDevKind = function ($getDevKind) {
        $getDevKind = {};
        console.log($getDevKind);
    }
    $scope.getDevTrade = function ($getDevTrade) {
        console.log($getDevTrade);
    };

    /*
     -----------------
     编辑场馆 begin
     -----------------
     */

    //2：编辑好后提交场馆的信息

    $scope.saveGymEdit = function () {
        var params = {
            "id": $rootScope.gymId,
            "name": $scope.gymEditData.name,
            "provinceId": $scope.gymEditData.provinceId,
            "cityId": $scope.gymEditData.cityId,
            "regionId": $scope.gymEditData.regionId,
            "address": $scope.gymEditData.address,
            "linkedMan": $scope.gymEditData.linkedMan,
            "phone": $scope.gymEditData.phone,
        };
        console.log("编辑场馆要丢给后台的字段");
        console.log(params);

        restful.fetch($rootScope.api.EditGym, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("编辑成功");
                console.log("编辑场馆后台返回：");
                console.log(res);
                $rootScope.query();
                $rootScope.modalEditShowOrHidden = 0;
                //非modal隐藏
                if ($rootScope.modalAddShowOrHidden == 1 || $rootScope.modalEditShowOrHidden == 1) {
                    $rootScope.allShowOrHidden = 0;//非模态都隐藏
                } else { // 非新增或编辑
                    $rootScope.allShowOrHidden = 1;//非模态都显示
                }
            } else {
                toastr.error(res.msg);
            }
        }, function (rej) {
            console.info(rej);
        });
    }
    $scope.closeGymEdit = function () {
        $rootScope.modalEditShowOrHidden = 0;
        //非modal隐藏
        if ($rootScope.modalAddShowOrHidden == 1 || $rootScope.modalEditShowOrHidden == 1) {
            $rootScope.allShowOrHidden = 0;//非模态都隐藏
        } else { // 非新增或编辑
            $rootScope.allShowOrHidden = 1;//非模态都显示
        }
    };

    /*
     -----------------
     编辑场馆 end
     -----------------
     */

    /*
     -----------------
     新增场馆 begin
     -----------------
     */
}]).controller("gymAddController", ['$scope', '$http', 'restful', '$uibModal', '$state', '$rootScope', 'AllAreaSelector', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $http, restful, $uibModal, $state, $rootScope, AllAreaSelector, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    //丢给后台的数据
    $scope.roleData = [];


    $scope.save = function (item, $index) {
        var params = {
            "name": $scope.data.gymName,
            "provinceId": $scope.data.provinceId,
            "cityId": $scope.data.cityId,
            "regionId": $scope.data.regionId,
            "address": $scope.data.address,
            "linkedMan": $scope.data.linkedMan,
            "phone": $scope.data.phone
        }
        console.log(params, "添加场馆要丢给后台的字段:");

        restful.fetch($rootScope.api.addGym, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("添加成功");
                console.log(res);
                $rootScope.query();
                $rootScope.modalAddShowOrHidden = 0;
                $rootScope.allShowOrHidden = 1;
            } else {
                toastr.error(res.msg);
            }
        }, function (rej) {
            console.info(rej);
        });
    };
    $scope.close = function () {
        $rootScope.modalAddShowOrHidden = 0;
        if ($rootScope.modalAddShowOrHidden == 1 || $rootScope.modalEditShowOrHidden == 1) {
            $rootScope.allShowOrHidden = 0;//非模态都隐藏
        } else { // 非新增或编辑
            $rootScope.allShowOrHidden = 1;//非模态都显示
        }


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
            toastr.error("发布失败", res.msg);
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
            "url": $scope.imgUrlIcoArr1[0].appUrl,
            "description": $scope.data.description,

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
            "url": $scope.imgUrlIcoArr1[0].appUrl,
            "description": $scope.data.description,



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
}]);



/**
 * Created by haoxb on 2017/6/23.
 */
'use strict';
App.controller('sportProgramController', ['$scope', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', 'toastr', function ($scope, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, toastr) {
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
            "id": $stateParams.schemeId,
            "page": parseInt($scope.PageIndex) - 1,
            "count": parseInt($scope.PageSize),
            "schemeName": $scope.data.schemeName,
        };
        console.log(params, "查询运动方案入参：");
        $http({
            url: $rootScope.api.getSportProgram,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.sportProgramData = res.data.data;
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
    //新增运动方案
    $scope.sportProgramAdd = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'sportProgramViewAdd.html',
            controller: 'sportProgramAddController',
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
    //运动方案编辑
    $scope.sportProgramEdit = function (item) {

    };
    //运动方案删除
    $scope.sportProgramDel = function (item) {
        $http({
            url: $rootScope.api.delSportProgram,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "schemeId": item.schemeId
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success("删除成功", res.data.msg);
                $scope.query();
            } else {
                toastr.error("删除失败", res.data.msg);
            }
        }, function (rej) {
            toastr.error("删除失败", res.data.msg);
        });
    }
    //弹窗编辑
    $scope.sportProgramEdit = function (data) {
        console.log(data.schemeId, "schemeId:");

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'sportProgramViewEdit.html',
            controller: 'sportProgramEditController',
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

}]);
// 新增运动方案
App.controller("sportProgramAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', '$http', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, $http) {
    $scope.data = {};


    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };

    //输入与显示的切换
    $scope.isShow = true;
    $scope.inputShow = function () {
        console.log(1);
        $scope.isShow = !$scope.isShow;
        console.log($scope.isShow);
    };
    $scope.inputHidden = function () {
        $scope.isShow = !$scope.isShow;
    };
    //丢给后台的方案数据
    $scope.sportStageData = [];

    //新增阶段
    $scope.sportStageAdd = function () {
        $scope.sportStageData.push(
            {
                "sequence": $scope.data.sequence,
                "schemeType": 1, /*等待后台去掉这个字段-方案执行类型(1距离为目标，2卡路里为目标，3指令时间限制)*/
                "execTime": $scope.data.execTime ? $scope.data.execTime : null,
                "name": $scope.data.name ? $scope.data.name : null,
                "treadmillSpeed": $scope.data.treadmillSpeed ? $scope.data.treadmillSpeed : null,
                "treadmillSlop": $scope.data.treadmillSlop ? $scope.data.treadmillSlop : null

            }
        );
        for (var i = 0; i < $scope.sportStageData.length; i++) {
            $scope.sportStageData[i].sequence = i + 1;

        }

        console.log($scope.sportStageData.length, "sportStageData.length:");
        console.log($scope.sportStageData, "sportStageData:");
    };
    //删除阶段
    $scope.sportStageDel = function (item, $index) {
        $scope.sportStageData.splice($index, 1);
        //删除后再次读取数组的索引做界面上以及数据上顺序的更新
        for (var i = 0; i < $scope.sportStageData.length; i++) {
            $scope.sportStageData[i].sequence = i + 1;

        }

    };
    //一次性保存所有阶段
    $scope.save = function (item, $index) {

        if ($scope.sportStageData.length == 0) {
            toastr.error("方案详情不能为空！")
            return
        }

        var params = {
            "detailInDTOList": $scope.sportStageData,
            "schemeName": $scope.data.schemeName,
            "description": $scope.data.description,
        };
        $http({
            url: $rootScope.api.addSportProgram,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success('新增运动方案成功', res.data.msg);

                $uibModalInstance.dismiss('close');
            } else {

                toastr.error(res.data.msg);
                // toastr.error("方案详情及详情内每个字段不能为空以！")
            }
        }, function (rej) {
            toastr.error("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };


}]);
// 编辑运动方案

App.controller("sportProgramEditController", ['$scope', '$http', '$uibModalInstance', 'restful', '$state', '$rootScope', '$uibModal', 'item', 'toastr', 'lifeHouseAreaSelector', function ($scope, $http, $uibModalInstance, restful, $state, $rootScope, $uibModal, item, toastr, lifeHouseAreaSelector) {
    //丢给后台的方案数据
    $scope.sportStageData = [];
    //1：通过id查询信息
    console.log(item, "item--------------");
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


    //新增阶段
    $scope.sportStageAdd = function () {
        $scope.sportStageData.push(
            {
                "sequence": $scope.data.sequence,
                "schemeType": 1, /*等待后台去掉这个字段-方案执行类型(1距离为目标，2卡路里为目标，3指令时间限制)*/
                "execTime": $scope.data.execTime ? $scope.data.execTime : null,
                "name": $scope.data.name ? $scope.data.name : null,
                "treadmillSpeed": $scope.data.treadmillSpeed ? $scope.data.treadmillSpeed : null,
                "treadmillSlop": $scope.data.treadmillSlop ? $scope.data.treadmillSlop : null

            }
        );
        for (var i = 0; i < $scope.sportStageData.length; i++) {
            $scope.sportStageData[i].sequence = i + 1;

        }
        ;

    };
    //删除阶段
    $scope.sportStageDel = function (item, $index) {
        $scope.sportStageData.splice($index, 1);
        //删除后再次读取数组的索引做界面上以及数据上顺序的更新
        for (var i = 0; i < $scope.sportStageData.length; i++) {
            $scope.sportStageData[i].sequence = i + 1;

        }
        ;
    };
    //2：编辑好后提交运动方案的信息
    $scope.savesportProgramEdit = function () {
        if ($scope.sportStageData.length == 0) {
            toastr.error("方案详情不能为空！")
            return
        }
        var params = {
            "schemeId": item.schemeId,
            "detailInDTOList": $scope.sportStageData,
            "schemeName": $scope.data.schemeName,
            "description": $scope.data.description,
        };
        console.log(params, "编辑丢给后台的参数：");
        $http({
            url: $rootScope.api.EditSportProgram,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success(res.data.msg, "编辑成功");
                $rootScope.query();
                $uibModalInstance.dismiss('close');
            } else {
                toastr.error(res.data.msg)
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });


    }


    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
}]);

/*
 * @Author: haoxb
 * @Date:   2017-6-20 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-08 12:01:02
 */
//用户体测报告类型1-清华同方
'use strict';
App.controller('userBodyReport01Controller', ['$scope', '$stateParams', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

    $scope.query = function () {
        // $scope.progressbar.start(); //进度条
        $http({
            url: $rootScope.api.getUserBodyReport,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "id": $stateParams.bodyReportId
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.item = res.data.data;
                console.log(res.data,"体测报告：");
            }else{
                $scope.item =undefined;
                toastr.error(res.data.msg, "获取信息失败：");
            }
        },function (rej) {
            console.log("失败状态码："+rej.code,+",失败信息："+rej.data);
        });
    };
    $scope.query();

}]);

/*
 * @Author: haoxb
 * @Date:   2017-6-20 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-08 12:01:02
 */
//用户体测报告类型2-东华原
'use strict';
App.controller('userBodyReport02Controller', ['$scope', '$stateParams', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

    $scope.query = function () {
        // $scope.progressbar.start(); //进度条
        console.log($stateParams.bodyReportId,"$stateParams.bodyReportId:");
       $http({
            url: $rootScope.api.getUserBodyReport,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "id": $stateParams.bodyReportId
                // "id":"215c3f7f4f5e11e7ac6fd017c28cff0d"
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.item = res.data.data;
                console.log(res.data,"体测报告：");
            }else{
                $scope.item =undefined;
                console.log(res.data.msg, "获取信息失败：");
            }
        },function (rej) {
            toastr.error("失败状态码："+rej.code,+",失败信息："+rej.data);
        });
    };
    $scope.query();

}]);

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
    /*    if (type == "04") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail04;
        }*/
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
                if(!res.data.page_info){
                    res.data.page_info={};
                }
                $scope.item = res.data.data;
                $scope.totalCount=res.data.page_info.total;

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
/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-08 12:01:02
 */
//用户信息
'use strict';
App.controller('userInfoController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
    //参数存放
    $scope.data = {};
    // $scope.progressbar = ngProgressFactory.createInstance();
    //分页
    $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    $scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
    $scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE;
    $scope.pageChanged = function () {
        $scope.query();
    };
    console.log($scope.userInfoListDataCount,"totalCount:=====");
    $scope.setPage = function () {
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.userInfoListDataCount / $scope.PageSize) ? Math.ceil($scope.userInfoListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }
    //*************************数据定义begin***********************************




    //*************************数据定义end***********************************
    //*************************分割线结束***********************************
    $rootScope.query = function () {
        var params = {
            "page": parseInt($scope.PageIndex) - 1,
            "count": parseInt($scope.PageSize),
            "cityId": $scope.data.cityId,
            "phone": $scope.data.phone,
            "mallId": $scope.data.mallId,
            "startTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),
            "endTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime)
        };
        $scope.userInfoListPromise = $http({
            url: $rootScope.api.getUserList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.userInfoListData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();
    //获取用户信息详情
    $scope.getUserDetail = function (id) {
        $state.go("userDetail", {"id": id});
        console.log(id, "用户的1id:");

    };
    //*************************分割线开始***********************************
    //省市区-类型联动查询
    lifeHouseAreaSelector.getProvinces().then(function (provinces) {
        //获取省份
        $scope.provinces = provinces;
    });
    $scope.getCitys = function (provinces) {
        $scope.data.cityId = "";
        $scope.data.regionId = "";
        $scope.data.regionId = "";
        if (provinces) {
            lifeHouseAreaSelector.getCitys(provinces.id).then(function (citys) {
                //获取市
                $scope.citys = citys;
                $scope.data.areaCode = provinces.id;
            });
        }

    };
}]);

/*
 * @Author: 唐文雍
 * @Date:   2016-05-04 17:26:02
 * @Last Modified by:   snoob
 * @Last Modified time: 2017-1-4 18:18:35
 */
'use strict';
App.controller('UserLoginController', ['$scope', '$rootScope', '$state', 'AuthService', 'Session', 'msgBus', '$http', 'restful', '$interval', '$cookies', '$location', 'toastr', function($scope, $rootScope, $state, AuthService, Session, msgBus, $http, restful, $interval, $cookies, $location, toastr) {
    //初始时将之前登录过的信息清空
    $scope.load = function() {
        Session.destroy();
    };
    $scope.credentials = {};
    $scope.error = "";

    $scope.login = function(credentials) {
        $scope.loginPromise = AuthService.login(credentials).then(function(res) {
            if (res.code == 1) {
                toastr.error(res.msg);
                return;
            }
            if (res.data.account) {
                msgBus.emitMsg("login");

                $state.go('dashboard');
            } else {
                $scope.error = data.msg || "超时";
            }
        });
    };


}]);
