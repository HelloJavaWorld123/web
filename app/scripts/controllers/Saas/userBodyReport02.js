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
