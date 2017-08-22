/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//押金
'use strict';

App.controller('cashPledgeController', ['$scope','$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {








//子控制器-tab
}]).controller('tabCash',['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {



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
        $scope.query();
    }



    //默认显示基本资料
    $scope.type='01';
    $scope.click=function (type) {
        $scope.data = {};
        $scope.PageIndex = 1;
        $scope.type=type;
        console.log(type,"type:");
        $scope.query();
    }


    //支付方式
    $scope.payTypes = {};
    $scope.payType = [
        {
            id: 1,
            name: "支付宝"
        }, {
            id: 2,
            name: "微信支付"
        }
    ];
    $scope.getPayType = function (item) {
        $scope.payTypes.id = item.id;
    };


    //状态
    $scope.status = {};
    $scope.state = [
        {
            id: 1,
            name: "待审核"
        }, {
            id: 2,
            name: "退款中"
        }, {
            id: 3,
            name: "已完成"
        }, {
            id: 4,
            name: "审核不通过"
        }
    ];
    $scope.getstate = function (item) {
        $scope.status.id = item.id;
        console.log($scope.status.id);
    };


    //同意退款审核  decideToRefund
    $scope.decideToRefund = function (itemId) {
        var param = {
            id: itemId.id,
            decideToRefund: 0,
            refundStatus: itemId.refundStatus == 1 ? itemId.refundStatus = 2 : 1
        }
        restful.fetch($rootScope.api.decideToRefund, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("审核通过", res.msg);
                $scope.query('03');
            } else {
                toastr.error("审核失败", res.msg);
            }
        }, function (rej) {
            toastr.error("审核失败", res.msg);
        });
    }

    /*//不同意退款审核  decideToRefund
    $scope.decideNotToRefund = function (itemId) {
        var param = {
            id: itemId.id,
            decideToRefund: 1,
            refundStatus: itemId.refundStatus == 1 ? itemId.refundStatus = 4 : 1
        }
        restful.fetch($rootScope.api.decideToRefund, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("审核不通过", res.msg);
                $scope.query('03');
            } else {
                toastr.error("审核失败", res.msg);
            }
        }, function (rej) {
            toastr.error("审核失败", res.msg);
        });
    }*/

    //修改押金金额
    $scope.alterDepositAmount = function (itemId) {
        var param = {
            amount: itemId.amount
        }
        restful.fetch($rootScope.api.alterDepositAmount, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("修改成功", res.msg);
                $scope.query('02');
            } else {
                toastr.error("修改失败", res.msg);
            }
        }, function (rej) {
            toastr.error("修改失败", res.msg);
        });
    }


    //单个城市押金开关  cashPledgeSwitch
    $scope.cashPledgeSwitch = function (itemId) {
        var param = {
            id: itemId.id,
            depositStatus: itemId.depositStatus == 0 ? itemId.depositStatus = 1 : 0
        }
        restful.fetch($rootScope.api.cashPledgeSwitch, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("切换成功", res.msg);
                $scope.query('02');
            } else {
                toastr.error("切换失败", res.msg);
            }
        }, function (rej) {
            toastr.error("切换失败", res.msg);
        });
    }

    //一键控制押金开关

    $scope.cashPledgeSwitchAll = function (itemId) {
        var param = {
            depositStatus: 0
        }
        restful.fetch($rootScope.api.cashPledgeSwitch, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("切换成功", res.msg);
                $scope.query('02');
            } else {
                toastr.error("切换失败", res.msg);
            }
        }, function (rej) {
            toastr.error("切换失败", res.msg);
        });
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



    $rootScope.query = function () {
           $scope.switchCashPledgeApi=$rootScope.api.cashPledgeOrder;
         //根据选择不同的tab的head选择不同的数据源


         if($scope.type=="01"){
         $scope.switchCashPledgeApi = $rootScope.api.cashPledgeOrder
         };
         if($scope.type=="02"){
         $scope.switchCashPledgeApi = $rootScope.api.cashPledgeSetting
         };
         if($scope.type=="03"){
         $scope.switchCashPledgeApi = $rootScope.api.cashPledgeRefund
         };


        $scope.cashPledgeDataPromise = $http({
            url:  $scope.switchCashPledgeApi,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "mobile": $scope.data.mobile,
                "startTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),
                "endTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),
                "mallId": $scope.data.mallId,
                "orderNo": $scope.data.orderNo,
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.cashPledgeData = res.data.data;
                $scope.cashPledgeDataCount = res.data.page_info.total;
                console.log($scope.cashPledgeDataCount);
                $scope.toPageNum = $scope.PageIndex;
            }
        });



        //获取押金金额
        $scope.getDepositAmountPromise = $http({
            url:  $rootScope.api.getDepositAmount,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.getDepositAmountData = res.data.data;
            }
        });
    };
    $scope.query();





}]);