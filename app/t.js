.controller("gymAddController", ['$scope', '$http', 'restful', '$uibModal', '$state', '$rootScope', 'AllAreaSelector', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $http, restful, $uibModal, $state, $rootScope, AllAreaSelector, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    //丢给后台的数据
    $scope.roleData = [];

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
            "cityId": $scope.data.cityId,
            "regionId": $scope.data.regionId,
            "address": $scope.data.address,
            "linkedMan": $scope.data.linkedMan,
            "phone": $scope.data.phone,
            "type": $scope.data.type,
            "longitude": $scope.position.lng,
            "latitude": $scope.position.lat,
            "sharingList": $scope.roleData,
            "openTime": $scope.data.openTimeFormat + ":00",
            "endTime": $scope.data.endTimeFormat + ":00",
            "status": $scope.data.status
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
    //分成角色
    $scope.roleShareDatas = {};
    $scope.roleShareData = [];
    $http({
        url: $rootScope.api.getDicList,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "typeCode": "SHARING_ROLE"
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.roleShareData = res.data.data;
            console.log($scope.roleShareData, "分成角色:");


        }
    });
    $scope.getroleShareData = function (item) {
        $scope.roleShareDatas.dicKey = item.dicKey;
        $scope.roleShareDatas.dicValue = item.dicValue;
        console.log($scope.roleShareDatas.dicKey, "key");
        console.log($scope.roleShareDatas.dicValue, "dicValue");

    };


    $scope.roleData = [];
    //新增阶段
    $scope.roleAdd = function () {
        $scope.roleData.push(
            {
                "sharingRole": $scope.roleShareDatas.dicKey,
                "sharingRoleName": $scope.roleShareDatas.dicValue,
                "name": $scope.data.name ? $scope.data.name : null,
                "responsiblePerson": $scope.data.responsiblePerson ? $scope.data.responsiblePerson : null,
                "mobile": $scope.data.mobile ? $scope.data.mobile : null,
                "percent": $scope.data.percent ? $scope.data.percent : null,
                "account": $scope.data.account ? $scope.data.account : null

            }
        );
        for (var i = 0; i < $scope.roleData.length; i++) {
            $scope.roleData[i].sequence = i + 1;

        }
        ;
        console.log($scope.roleData.length, "roleData.length:");
        console.log($scope.roleData, "roleData:");
    };
    //删除阶段
    $scope.roleDel = function (item, $index) {
        $scope.roleData.splice($index, 1);
        //删除后再次读取数组的索引做界面上以及数据上顺序的更新
        for (var i = 0; i < $scope.roleData.length; i++) {
            $scope.roleData[i].sequence = i + 1;

        }
        ;
    };


}]);
