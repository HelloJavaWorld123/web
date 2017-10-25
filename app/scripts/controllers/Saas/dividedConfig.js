/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-10-16 11:43:51
 */
//分成方设置
'use strict';
App.controller('dividedConfigController', ['$scope', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', 'toastr', function ($scope, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, toastr) {
    $rootScope.comData = {};

    $rootScope.comData.uid = "5536b420ad8c11e7b9def48e38c3c5b0";
    $scope.data = {};
    $scope.gymRoleData = {};
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
    //查询账户信息+名下场馆
    $scope.query = function () {
        var params = {
            "id": $rootScope.comData.uid,
        };
        $http({
            url: $rootScope.api.getBankInfo,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.data = res.data.data;
                /*用于调试个人账户*/
            } else {
                toastr.error(res.data.msg);
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });

        $http({
            url: $rootScope.api.getGymInfo,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.gymRoleData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
            } else {
                toastr.error(res.data.msg);
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };
    $scope.query();

    /*账户校验*/
    $scope.doVerify = function (bankType, item) {
        var params = {
            "bankCheckStatus": 1,
            "id": item.id,
        };
        if (bankType.code == 0) {//公司账户
            $http({
                url: $rootScope.api.companyVerify,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: params,
            }).then(function (res) {
                if (res.data.code == 2000) {
                    toastr.success("我们会给该账户汇入一笔非常小的金额，请在收到后，登录平台进行验证");
                    //变成校验中
                    var timer = setTimeout(function () {
                        $scope.data.bankCheckStatus.code = 1;
                    }, 700);
                } else {
                    toastr.error(res.data.msg);
                }
            }, function (rej) {
                console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
            });
        } else {//个人账户
            $uibModal.open({
                templateUrl: 'personVerifyAccountMoney.html',
                controller: 'personVerifyController',
                size: 'md',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            }).result.then(function () {
                //close
                $scope.query();
            }, function () {
                //dismiss
            });
        }
    }

    /*确认打款金额*/
    $scope.doVerifyAccountMoney = function (data) {
        var item;
        $uibModal.open({
            templateUrl: 'doVerifyAccountMoney.html',
            controller: 'doVerifyAccountMoneyController',
            size: 'md',
            resolve: {
                item: function () {
                    return data;
                }
            }
        }).result.then(function () {
            //close
            $scope.query();
        }, function () {
            //dismiss
            $scope.query();
        });

    }
}]);
//公司账户
App.controller('doVerifyAccountMoneyController', ['$scope', 'item', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', '$uibModalInstance', 'toastr', function ($scope, item, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, $uibModalInstance, toastr) {
    //查询账户信息+名下场馆
    $scope.query = function () {
        var params = {
            "id": $rootScope.comData.uid,
        };
        $http({
            url: $rootScope.api.getBankInfo,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.data = res.data.data;
            } else {
                toastr.error(res.data.msg);
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });

        $http({
            url: $rootScope.api.getGymInfo,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.gymRoleData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
            } else {
                toastr.error(res.data.msg);
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };
    /*账户校验*/
    $scope.save = function () {
        var params = {
            "id": item.id,
            "amount": $scope.data.amount

        };
        $http({
            url: $rootScope.api.gymVerifyAccountMoney,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.data = res.data.data;
                toastr.success($scope.data.data);
                $scope.query();
            } else {
                toastr.error(res.data.msg);
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };

}]);
//个人账户
App.controller('personVerifyController', ['$scope', 'item', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', '$uibModalInstance', 'toastr', function ($scope, item, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, $uibModalInstance, toastr) {
    $scope.data={};
    //查询账户信息+名下场馆
    $scope.query = function () {
        var params = {
            "id": $rootScope.comData.uid,
        };
        $http({
            url: $rootScope.api.getBankInfo,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $rootScope.data = res.data.data;
            } else {
                toastr.error(res.data.msg);
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };
    /*账户校验*/
    $scope.data.bankCardNum == null ? $scope.data.bankCardNum=item.bankAccount : $scope.data.bankCardNum;
    $scope.data.bankName == null ? $scope.data.bankName=item.bankName : $scope.data.bankName;
    $scope.save = function () {

        var params = {
            "id": item.id,
            "bankCardNum": $scope.data.bankCardNum == null ? item.bankAccount : $scope.data.bankCardNum,
            "bankName": $scope.data.bankName == null ? item.bankName : $scope.data.bankName,
            "idCardName": $scope.data.idCardName,
            "idCard": $scope.data.idCard,
            "mobile": $scope.data.mobile,

        };
        $http({
            url: $rootScope.api.personVerify,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.data = res.data.data;
                $uibModalInstance.close(res.data.data);
                toastr.success("校验通过");
                $scope.query();
            } else {
                toastr.error(res.data.msg);
            }
        }, function (rej) {
            console.log("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };
    $scope.close = function (dataCode) {
        $uibModalInstance.close(dataCode);
    };

}]);