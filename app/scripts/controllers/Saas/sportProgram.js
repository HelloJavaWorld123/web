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
    //性别
    $scope.sexArr = [
        {
            sexId: 0,
            name: "女"
        }, {
            sexId: 1,
            name: "男"
        }, {
            sexId: 2,
            name: "不限"
        }
    ];

    $scope.getSexStatus = function ($item) {
        $item = {};
        $scope.sexId = $item.sexId;
    };
    //查询运动方案
    $rootScope.query = function () {
        var params = {
            "id": $stateParams.schemeId,
            "page": parseInt($scope.PageIndex) - 1,
            "count": parseInt($scope.PageSize),
            "schemeName": $scope.data.schemeName,
            "sex": $scope.data.sex,
            "minBmi": $scope.data.minBmi,
            "maxBmi": $scope.data.maxBmi
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
            "minBmi": $scope.data.minBmi,
            "maxBmi": $scope.data.maxBmi,
            "sex": $scope.data.sex
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
            "minBmi": $scope.data.minBmi,
            "maxBmi": $scope.data.maxBmi,
            "sex": $scope.data.sex
        };
        console.log(params, "编辑丢给后台的参数===========：");
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
