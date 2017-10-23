/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//设备费用管理
'use strict';

App.controller('devCostManageController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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

    //弹窗新增
    $scope.addDevCost = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'devCostViewAdd.html',
            controller: 'devCostAddController',
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

    $scope.editDevCost = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editDevCost.html',
            controller: 'editDevCostController',
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
        restful.fetch($rootScope.api.devCostDel, "POST", param).then(function (res) {
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
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };

    //是否应用
    $scope.deviceUseSwitch = function (itemId) {
        var param = {
            id: itemId.id,
            deviceUse: itemId.deviceUse == 0 ? itemId.deviceUse = 1 : 0
        }
        restful.fetch($rootScope.api.updateUse, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("切换应用成功", res.msg);
                $scope.query();
            } else {
                toastr.error("切换应用失败", res.msg);
            }
        }, function (rej) {
            toastr.error("切换应用失败", res.msg);
        });
    }



    $rootScope.query = function () {
        $scope.devCostListPromise = $http({
            url: $rootScope.api.devCostList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId,
                "productId": $scope.data.productId,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.devCostListData = res.data.data;
                $scope.devCostListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取设备费用列表失败");
            }
        });
    };
    $scope.query();



}]);




/*
 -----------------
 新建设备费用
 -----------------
 */
App.controller("devCostAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    $scope.save = function () {
        var params = {

            "productId": $scope.data.productId,
            "devicePrice": $scope.data.devicePrice,

            "deviceScope": $scope.cityIdAll.join(','),
            "deviceScopeName": $scope.cityNameAll.join(','),


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.devCostAdd, "POST", params).then(function (res) {
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
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
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




    //选择城市

    $scope.cityIdAll = [];
    $scope.cityNameAll = [];

    $scope.chooseCity = function(){
        var isCanPush = true;
        for(var i= 0;i<$scope.cityIdAll.length;i++){
            if($scope.cityIdAll[i] == $scope.data.cityId){
                isCanPush = false;

            }
        }
        if(isCanPush){
            $scope.cityIdAll.push($scope.data.cityId)
            for(var j= 0;j<$scope.citys.length;j++){
                if($scope.citys[j].id == $scope.data.cityId){
                    $scope.cityName = $scope.citys[j].name

                }
            }
            $scope.cityNameAll.push($scope.cityName)
            console.log($scope.cityIdAll.join(','));
            console.log($scope.cityNameAll.join(','));
        }
    }
    //点击删除所选城市
    $scope.delCity = function(index){
        $scope.cityIdAll.splice(index,1)
        $scope.cityNameAll.splice(index,1)
        console.log($scope.cityNameAll);
    }



}]);




/*
 -----------------
 修改设备费用
 -----------------
 */
App.controller("editDevCostController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};



    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.devCostGetid, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }
            console.log($scope.data,"$scope.data:");



            $scope.cityIdAll = $scope.data.deviceScope.split(',');
            $scope.cityNameAll = $scope.data.deviceScopeName.split(',');




        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });







    $scope.save = function () {
        var params = {

            "id": item.id,
            "productId": $scope.data.productId,
            "devicePrice": $scope.data.devicePrice,

            "deviceScope": $scope.cityIdAll.join(','),
            "deviceScopeName": $scope.cityNameAll.join(','),


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.devCostUpdate, "POST", params).then(function (res) {
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
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
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




    //选择城市

    $scope.cityIdAll = [];
    $scope.cityNameAll = [];

    $scope.chooseCity = function(){
        var isCanPush = true;
        for(var i= 0;i<$scope.cityIdAll.length;i++){
            if($scope.cityIdAll[i] == $scope.data.cityId){
                isCanPush = false;

            }
        }
        if(isCanPush){
            $scope.cityIdAll.push($scope.data.cityId)
            for(var j= 0;j<$scope.citys.length;j++){
                if($scope.citys[j].id == $scope.data.cityId){
                    $scope.cityName = $scope.citys[j].name

                }
            }
            $scope.cityNameAll.push($scope.cityName)
            console.log($scope.cityIdAll.join(','));
            console.log($scope.cityNameAll.join(','));
        }
    }
    //点击删除所选城市
    $scope.delCity = function(index){
        $scope.cityIdAll.splice(index,1)
        $scope.cityNameAll.splice(index,1)
        console.log($scope.cityNameAll);
    }



}]);