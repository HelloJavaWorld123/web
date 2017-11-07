/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//提现审核
'use strict';

App.controller('resourceListController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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



    //弹窗确认审核
    $scope.confirmAuditing = function (itemId,num) {
        var param = {
            id: itemId.id,
            auditStatus: num
        }
        restful.fetch($rootScope.api.depositAuditingStatus, "POST", param).then(function (res) {
            if (res.code == 2000) {
                if(num == 1){
                    toastr.success("审核通过", res.msg);
                }else if(num == 2){
                    toastr.success("审核不通过", res.msg);
                }

                $scope.query();
            } else {
                toastr.error("审核失败", res.msg);
            }
        }, function (rej) {
            toastr.error("审核失败", res.msg);
        });
    }

    //删除按钮
    $scope.deleteResource = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.resourceDel, "POST", param).then(function (res) {
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



    //审核状态
    $scope.deviceKinds = {};
    $scope.deviceKind = [
        {
            id: 0,
            name: "未审核"
        }, {
            id: 1,
            name: "审核通过"
        }, {
            id: 2,
            name: "审核不通过"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };

    $rootScope.query = function () {
        $scope.resourceListPromise = $http({
            url: $rootScope.api.resourceList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "name": $scope.data.name,
                "longNumber": $scope.data.number,
                "url": $scope.data.url,
                "showMenu": $scope.data.showMenu,
            }
        }).then(function (res) {

            if (res.data.code == 2000) {
                var stack = [],arr = [];
                // stack=stack.concat( res.data.data);
                // while (stack.length !=0){
                //     var node =stack.pop();
                //     node.longNumber= node.longNumber.replace("0,","").replace(/,/g,".")
                //     node.show=true;
                //     node.up = true;
                //     arr.push(node);
                //     if(node.children){
                //         stack=stack.concat(node.children)
                //     }
                // }
                $scope.changeItemToArray(res.data.data,arr);
                $scope.resourceListData = arr;
                // $scope.resourceListDataCount = res.data.page_info.total;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }

        });
    };
    $scope.query();

    $scope.resourceShow= function(item){
        item.up = !item.up;
        $scope.changeChidirenShowStatus(item, item.up);
    }

    $scope.changeItemToArray = function (data,arr,name) {
        if(data.length == 0){
            return;
        }

        for(var i=0; i<data.length; i++){
            var node =data[i];
                node.longNumber= node.longNumber.replace("0,","").replace(/,$/,"").replace(/,/g,".")
                node.show=true;
                node.parentName=name;

              if (node.showMenu == 0 ) {
                node.showText = '是'
              }else {
                node.showText = '否'
              }
                node.up = true;
            arr.push(node);
            $scope.changeItemToArray(node.children,arr,node.name);
        }
    }
    $scope.changeChidirenShowStatus = function (item,status) {
        if(item.children.length == 0){
            return;
        }
        var arr = item.children;
        for(var i=0; i<arr.length; i++){
            var node =arr[i];
            node.show = status;
            if(node.up){
                $scope.changeChidirenShowStatus(node,status);
            }
            // node.up = status;

        }

    }

    $scope.treeStyle= function (item) {
        var style;
        if(item.level == 1){
            style={
                "padding-left":"10px"
            }
        }else if (item.level == 2){
            style={
                "padding-left":"30px"
            }
        }else{
            style={
                "padding-left":"50px"
            }
        }
        return style

    }

    $scope.mainResourceAdd = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'mainResourceAdd.html',
            controller: 'mainResourceAddController',
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



    $scope.ResourceAdd = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'ResourceAdd.html',
            controller: 'ResourceAddController',
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

    $scope.ResourceEdit = function (data,type) {
        if(type == 1){
            $scope.mainResourceEdit(data);
            return
        }
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'ResourceEdit.html',
            controller: 'ResourceEditController',
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

    $scope.mainResourceEdit = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'mainResourceEdit.html',
            controller: 'mainResourceEditController',
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



}]);

App.controller("mainResourceAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', '$http', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, $http) {
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

    //一次性保存所有阶段
    $scope.save = function (item, $index) {


        var params = {
            "name": $scope.data.name,
            "orderNum": $scope.data.orderNum,
            "showMenu": $scope.data.showMenu==true?0:1,
            "type":0
        };
        console.log(params);
        $http({
            url: $rootScope.api.resourceAdd,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success('新增主菜单成功', res.data.msg);

                $uibModalInstance.dismiss('close');
            } else {

                toastr.error(res.data.msg);
            }
        }, function (rej) {
            toastr.error("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };


}]);

App.controller("ResourceAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', '$http','item', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, $http,item) {
    $scope.data = {};
    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };

    $scope.data["parentName"] = item["name"];
    var parentId = item["id"];

    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };

    //输入与显示的切换
    $scope.isShow = true;
    $scope.showUrl = false;
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
    // $scope.selected = { type: $scope.itemArray[0] };

    $scope.itemArray= [{ id: 0, name: '菜单项' },
        {id: 1, name: '功能项' }];
    $scope.selected = { type: $scope.itemArray[0] };

    $scope.data.type=0;

    $scope.getType = function (item) {
        $scope.data.type = item.id;
        if(item.id == 0) {
            $scope.showUrl = false;
        }else {
            $scope.showUrl = true;
        }
        console.log($scope.data.type);
    };

    //一次性保存所有阶段
    $scope.save = function (item, $index) {


        var params = {
            "name": $scope.data.name,
            "orderNum": $scope.data.orderNum,
            "showMenu": $scope.data.showMenu==true?0:1,
            "type":$scope.data.type,
            "parentId":parentId,
            "url":$scope.data.url
        };
        console.log(params);
        $http({
            url: $rootScope.api.resourceAdd,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success('新增主菜单成功', res.data.msg);

                $uibModalInstance.dismiss('close');
            } else {

                toastr.error(res.data.msg);
            }
        }, function (rej) {
            toastr.error("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };


}]);

//主菜单编辑
App.controller("mainResourceEditController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', '$http','item', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, $http,item) {
    $scope.data = {};
    //1：通过id查权限
    var params = {
        id: item.id
    };

    var parentId = item["id"];

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
    // $scope.selected = { type: $scope.itemArray[0] };

    $scope.itemArray= [{ id: 0, name: '菜单项' },
        {id: 1, name: '功能项' }];

    $scope.getType = function (item) {
        $scope.data.type = item.id;
        if(item.id == 0) {
            $scope.showUrl = false;
        }else {
            $scope.showUrl = true;
        }
        console.log($scope.data.type);
    };

    restful.fetch($rootScope.api.getResource, "POST", params).then(function (res) {
        if (res.code == 2000) {
            var type = res.data["type"]
            console.log(res.data)
            $scope.data["id"]= res.data["id"];
            $scope.data["name"]= res.data["name"];
            $scope.data["orderNum"]= res.data["number"];
            if(res.data.showMenu==0){
                $scope.data["showMenu"]= true;
            }else {
                $scope.data["showMenu"]= false;
            }


        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });

    //一次性保存所有阶段
    $scope.save = function (item, $index) {


        var params = {
            "id":$scope.data.id,
            "name": $scope.data.name,
            "orderNum": $scope.data.orderNum,
            "type":0,
        };
        console.log(params);
        $http({
            url: $rootScope.api.resourceEdit,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success('编辑主菜单成功', res.data.msg);

                $uibModalInstance.dismiss('close');
            } else {

                toastr.error(res.data.msg);
            }
        }, function (rej) {
            toastr.error("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };


}]);


App.controller("ResourceEditController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', '$http','item', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, $http,item) {
    $scope.data = {};
    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };

    var parentId = item["id"];

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
    // $scope.selected = { type: $scope.itemArray[0] };

    $scope.itemArray= [{ id: 0, name: '菜单项' },
        {id: 1, name: '功能项' }];

    $scope.getType = function (item) {
        $scope.data.type = item.id;
        if(item.id == 0) {
            $scope.showUrl = false;
        }else {
            $scope.showUrl = true;
        }
        console.log($scope.data.type);
    };

    restful.fetch($rootScope.api.getResource, "POST", params).then(function (res) {
        if (res.code == 2000) {
            var type = res.data["type"]
             console.log(res.data)
              $scope.data["id"]= item["id"];
              $scope.data["type"]= item["type"];
              $scope.data["parentName"]= item["parentName"];
              $scope.data["name"]= res.data["name"];
              $scope.data["orderNum"]= res.data["number"];
              $scope.data["url"]= res.data["url"];
              $scope.selected = { type: $scope.itemArray[type] };
              if(type==0){
                  $scope.data["typeName"]= "菜单项";
                  $scope.showUrl =false;
             } else {
                  $scope.data["typeName"]= "功能项";
                  $scope.showUrl =true;
              }
        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });

    //一次性保存所有阶段
    $scope.save = function (item, $index) {


        var params = {
            "id":$scope.data.id,
            "name": $scope.data.name,
            "orderNum": $scope.data.orderNum,
            "type":$scope.data.type,
            "url":$scope.data.url
        };
        console.log(params);
        $http({
            url: $rootScope.api.resourceEdit,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success('新增主菜单成功', res.data.msg);

                $uibModalInstance.dismiss('close');
            } else {

                toastr.error(res.data.msg);
            }
        }, function (rej) {
            toastr.error("失败状态码：" + rej.code, +",失败信息：" + rej.data);
        });
    };


}]);

