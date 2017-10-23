/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-07 11:43:51
 */
//场馆设置
'use strict';

App.controller('gymIotConfigController', ['$scope', 'CommonData', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, CommonData, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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


    //经营类型
    $scope.runKind = [
        {
            runKindId: 0,
            name: "自营"
        }, {
            runKindId: 1,
            name: "合作"
        },
    ];

    $scope.getRunKind = function ($item) {
        $item = {};
        $scope.runKindId = $item.runKindId;
    }

    //经营状态
    $scope.runStatus = [
        {
            runStatusId: 0,
            name: "正常营业"
        }, {
            runStatusId: 1,
            name: "歇业"
        }, {
            runStatusId: 2,
            name: "关闭"
        }
    ];

    $scope.getRunStatus = function ($item) {
        $item = {};
        $scope.runStatusId = $item.runStatusId;
    };
    //初始化开始时间和结束时间
    $scope.beginTimeArr = CommonData.hourArr();
    $scope.endTimeArr = CommonData.hourArr();
    $scope.$watch('data.openTimeFormat', function (newValue, oldValue) {
        //监听开始时间被选择后，结束时间自动截取到之后的时间
        if (newValue != oldValue) {
            $scope.endTimeArr = CommonData.hourArr().splice(newValue + 1, 48);
        }
    })
    $scope.$watch('data.endTimeFormat', function (newValue, oldValue) {
        //监听结束时间被选择后，开始时间只能小于结束时间
        if (newValue != oldValue) {
            $scope.beginTimeArr = CommonData.hourArr().splice(0, newValue);
        }
    });
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
            url: $rootScope.api.getGymIotList,
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
        restful.fetch($rootScope.api.getGymIotById, "POST", params).then(function (res) {
            if (res.code == 2000) {
                console.log(res.data, "编辑数据res.data：");
                for (var key in res.data) {
                    $scope.gymEditData[key] = res.data[key];
                    $scope.gymEditData.openTimeFormat = res.data.openTime.substring(0, 5);
                    $scope.gymEditData.endTimeFormat = res.data.endTime.substring(0, 5);
                    /*后台返回来的是多了秒，截掉才能和我们自己定义的字典对应才能渲染出来*/
                }

                $scope.getCitys(res.data.provinceId);
                $scope.getCountys(res.data.cityId);


                $scope.gymEditData.cityId = res.data.cityId;
                $scope.positionLngAndLat = res.data.longitude + "," + res.data.latitude;
                /*编辑地图反绑：*/
                $scope.positionLngAndLatObj={
                    longitude:res.data.longitude,
                    latitude:res.data.latitude
                };
                console.log($scope.positionLngAndLat, '编辑地图反绑positionLngAndLat:');
                console.log( $scope.gymEditData.address, '编辑地图反绑地图address:');
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
        restful.fetch($rootScope.api.delGymIot, "POST", param).then(function (res) {
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
    $scope.devDetailListIot = function (item) {
        console.log(item.id,item.type, "跨页传递的参数：id和type");
        $state.go("devConfig", {"gymId": item.id,"gymType":item.type});

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

    //声明变量
    $scope.gymEditData = {};

    //是否地图显示
    $scope.showInMapArr = [
        {
            id: 0,
            name: "否"
        }, {
            id: 1,
            name: "是"
        }
    ];


    //2：编辑好后提交场馆的信息

    $scope.saveGymEdit = function (position) {

   /*     $scope.$watch('position', function () {
            debugger;
            console.log(position);
        }, true)
*/

        console.log(position,"position:坐标信息");
        var positionArr=position.split(",");
        if (position) {
            /* toastr.info('当前选中的经纬度' + position.lng + "，" + position.lat)*/
        } else {
            toastr.error("定位失败，请重新定位！");
            return;
        }

        var params = {
            "id": $rootScope.gymId,
            "name": $scope.gymEditData.name,
            "provinceId": $scope.gymEditData.provinceId,
            "showInMap": $scope.gymEditData.showInMap,
            "cityId": $scope.gymEditData.cityId,
            "regionId": $scope.gymEditData.regionId,
            "address": $scope.gymEditData.address,
            "linkedMan": $scope.gymEditData.linkedMan,
            "phone": $scope.gymEditData.phone,
            "longitude":positionArr[0],
            "latitude": positionArr[1],
            "openTime": $scope.gymEditData.openTimeFormat + ":00",
            "endTime": $scope.gymEditData.endTimeFormat + ":00",
        };
        console.log("编辑场馆要丢给后台的字段");
        console.log(params);

        restful.fetch($rootScope.api.EditGymIot, "POST", params).then(function (res) {
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
}]).controller("gymIotAddController", ['$scope', '$http', 'restful', '$uibModal', '$state', '$rootScope', 'AllAreaSelector', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $http, restful, $uibModal, $state, $rootScope, AllAreaSelector, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    //丢给后台的数据
    $scope.roleData = [];


    //是否地图显示
    $scope.showInMapArr = [
        {
            id: 0,
            name: "否"
        }, {
            id: 1,
            name: "是"
        }
    ];

    $scope.getShowInMap = function ($item) {
        $item = {};
        // $scope.id = $item.id;
    };
    $scope.save = function (item, $index) {
        if ($scope.position) {
            $scope.ppstr = $scope.position.lng + "," + $scope.position.lat;
            //toastr.info('当前选中的经纬度' + $scope.position.lng + "，" + $scope.position.lat)
        } else {
            toastr.error("定位失败，请重新定位！");
        }
        var params = {
            "name": $scope.data.gymName,
            "provinceId": $scope.data.provinceId,
            "showInMap": $scope.data.showInMap,
            "cityId": $scope.data.cityId,
            "regionId": $scope.data.regionId,
            "address": $scope.data.address,
            "linkedMan": $scope.data.linkedMan,
            "phone": $scope.data.phone,
            "longitude": $scope.position.lng,
            "latitude": $scope.position.lat,
            "openTime": $scope.data.openTimeFormat + ":00",
            "endTime": $scope.data.endTimeFormat + ":00",
        };
        console.log(params, "添加场馆要丢给后台的字段:");

        restful.fetch($rootScope.api.addGymIot, "POST", params).then(function (res) {
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
        ;

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



