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

/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//对公账户审核
'use strict';

App.controller('accountAuditingController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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




    //弹窗新增
    $scope.addAccount = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'accountViewAdd.html',
            controller: 'accountAddController',
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



    //打款状态
    $scope.deviceKinds = {};
    $scope.deviceKind = [
        {
            id: 0,
            name: "未打款"
        }, {
            id: 1,
            name: "已打款"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };



    $rootScope.query = function () {
        $scope.accountListPromise = $http({
            url: $rootScope.api.accountList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "bizName": $scope.data.bizName,
                "payMoneyStatus": $scope.data.payMoneyStatus,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.accountListData = res.data.data;
                $scope.accountListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



}]);



/*
 -----------------
 登记打款金额
 -----------------
 */
App.controller("accountAddController",  ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};

    $scope.save = function () {
        var params = {

            "id": item.id,
            "amount": $scope.data.amount,


        }

        restful.fetch($rootScope.api.updatePayStatus, "POST", params).then(function (res) {
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




}]);

/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-29 16:31:17
 */
//账户充值
'use strict';
App.controller('accountChargeController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.accountChargeListDataCount / $scope.PageSize) ? Math.ceil($scope.accountChargeListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }
// 付款方式
    $scope.payType = [
        {
            id: 1,
            name: "支付宝"
        }, {
            id: 2,
            name: "微信"
        }, {
            id: 3,
            name: "系统支付"
        }
    ];
    //*************************分割线结束***********************************
    $rootScope.query = function () {
        //$scope.progressbar.start(); //进度条
        $scope.accountChargeListPromise = $http({
            url: $rootScope.api.getAccountCharge,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "mallId": $scope.data.mallId,
                "orderNo": $scope.data.orderNo,
                "mobile": $scope.data.mobile,
                "startTime":  $rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),
                "endTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.accountChargeListData = res.data.data;
                $scope.totalCount= res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();


}]);

/*
 * @Author: gaof
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-05-31 17:24:03
 */
//活动设置
'use strict';

App.controller('activitySetController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
    }


    //弹窗新增
    $scope.addActivity = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'activityViewAdd.html',
            controller: 'activityAddController',
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


    //首页推荐
    $scope.featuredFirsts = {};
    $scope.featuredFirst = [
        {
            id: 0,
            name: "否"
        }, {
            id: 1,
            name: "是"
        }
    ];
    $scope.getFeature = function (item) {
        $scope.features.id = item.id;
    };




    //弹窗編輯按钮

    $scope.editActivity = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editActivity.html',
            controller: 'editActivityController',
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



    //撤回按钮
    $scope.deleteActivity = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.activityDel, "POST", param).then(function (res) {
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
        $scope.activityListPromise = $http({
            url: $rootScope.api.activityList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "currentPage": parseInt($scope.PageIndex) - 1,
                "pageSize": parseInt($scope.PageSize),
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.activityListData = res.data.data;
                $scope.activityListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取活动列表失败");
            }
        });
    };
    $scope.query();




}]);



/*
 -----------------
 新增活动
 -----------------
 */
App.controller("activityAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    $scope.save = function () {
        var params = {
            "userId":"user123",
            "title": $scope.data.title,
            "activiyLink": $scope.data.activiyLink,
            "startTime": $scope.data.beginTime,
            "endTime": $scope.data.endTime,
            "activiyIcon": $scope.imgUrlIcoArr1 == null?null:$scope.imgUrlIcoArr1[0].url,
            "abstractInfo": $scope.data.abstractInfo,
            "shareTitle": $scope.data.shareTitle,
            "shareAbstract": $scope.data.shareAbstract,

            "shareImage": $scope.imgUrlIcoArr2 == null?null:$scope.imgUrlIcoArr2[0].url,
            "featuredFirst": $scope.data.featuredFirst,
            "homePageRecommendImage": $scope.imgUrlIcoArr3 == null?null:$scope.imgUrlIcoArr3[0].url,

            "citiyIds": $scope.cityIdAll.join(','),
            "citiyNames": $scope.cityNameAll.join(','),


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.activityAdd, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("添加成功");
                console.log(res);
                $scope.query('02');
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






    $scope.data.featuredFirst = 0
    //点击首页推荐
    $scope.autoFeaturedFirst = function(){
        $scope.data.featuredFirst = $scope.data.featuredFirst == 0?1:0;
    }




    //取消上传图片
    $scope.delIco = function (index,picIndex) {
        var key = 'imgUrlIcoArr' + picIndex
        $scope[key].splice(index,1);
    }

}]);



/*
 -----------------
 编辑活动
 -----------------
 */
App.controller("editActivityController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};




    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.activityGetid, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }
            console.log($scope.data,"$scope.data:");
            $scope.data.beginTime = $scope.data.startTime;
            console.log($scope.data.beginTime);

            $scope.cityIdAll = $scope.data.citiyIds.split(',');
            $scope.cityNameAll = $scope.data.citiyNames.split(',');
            $scope.imgUrlIcoArr1 = [];
            $scope.imgUrlIcoArr2 = [];
            $scope.imgUrlIcoArr3 = [];
            var obj1= {
                url:$scope.data.activiyIcon
            }
            var obj2= {
                url:$scope.data.shareImage
            }
            var obj3= {
                url:$scope.data.homePageRecommendImage
            }
            $scope.imgUrlIcoArr1.push(obj1);
            $scope.imgUrlIcoArr2.push(obj2);
            $scope.imgUrlIcoArr3.push(obj3);



        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });


    $scope.save = function () {
        var params = {
            "id": item.id,
            "userId":"user123",
            "title": $scope.data.title,
            "activiyLink": $scope.data.activiyLink,
            "startTime": $scope.tools.dateToTimeStamp13Bit($scope.data.beginTime),
            "endTime": $scope.tools.dateToTimeStamp13Bit($scope.data.endTime),
            "activiyIcon": $scope.imgUrlIcoArr1[0] == null?null:$scope.imgUrlIcoArr1[0].url,
            "abstractInfo": $scope.data.abstractInfo,
            "shareTitle": $scope.data.shareTitle,
            "shareAbstract": $scope.data.shareAbstract,

            "shareImage": $scope.imgUrlIcoArr2[0] == null?null:$scope.imgUrlIcoArr2[0].url,
            "featuredFirst": $scope.data.featuredFirst,
            "homePageRecommendImage": $scope.imgUrlIcoArr3[0] == null?null:$scope.imgUrlIcoArr3[0].url,

            "citiyIds": $scope.cityIdAll.join(','),
            "citiyNames": $scope.cityNameAll.join(','),


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.update, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("添加成功");
                console.log(res);
                $scope.query('02');
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





    //点击首页推荐
    $scope.autoFeaturedFirst = function(){
        $scope.data.featuredFirst = $scope.data.featuredFirst == 0?1:0;
    }




    //取消上传图片
    $scope.delIco = function (index,picIndex) {
        var key = 'imgUrlIcoArr' + picIndex
        $scope[key].splice(index,1);
    }

}]);
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
            refundStatus: itemId.refundStatus == 1 ? 2 : 1
        }
        restful.fetch($rootScope.api.decideToRefund, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("审核通过", res.msg);
                $scope.query('03');
            } else {
                toastr.error( res.msg,"审核失败");
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



    //刷新按钮

    $scope.renovate =function(){
        $http({
            url: $rootScope.api.reflushRufundStatus,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },

        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.query("03");
            } else {
                toastr.error(res.msg, "刷新列表失败");
            }
        });
    }

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
/*
 * @Author: gaof
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-05-31 17:24:03
 */
//充值设置
'use strict';

App.controller('chargeSetController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
    }


    //弹窗新增
    $scope.addActivity = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'chargeViewAdd.html',
            controller: 'chargeAddController',
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

    $scope.editActivity = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editCharge.html',
            controller: 'editChargeController',
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
    $scope.deleteActivity = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.chargeDel, "POST", param).then(function (res) {
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
        $scope.chargeListPromise = $http({
            url: $rootScope.api.chargeList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.chargeListData = res.data.data;
                $scope.chargeListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取活动列表失败");
            }
        });
    };
    $scope.query();




}]);


/*
 -----------------
 新增
 -----------------
 */
App.controller("chargeAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    $scope.save = function () {
        var params = {

            "amount": $scope.data.amount,
            "amountExt": $scope.data.amountExt,
            "copywriting": $scope.data.copywriting,
            "hasPresentActive": $scope.data.hasPresentActive,


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.chargeAdd, "POST", params).then(function (res) {
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


    $scope.data.hasPresentActive = 0
    //点击参加活动
    $scope.autoRenew = function(){
        $scope.data.hasPresentActive = $scope.data.hasPresentActive == 0?1:0;
    }




}]);



/*
 -----------------
 编辑
 -----------------
 */
App.controller("editChargeController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};


    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.chargeGetid, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }





        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });


    $scope.save = function () {
        var params = {
            "id": item.id,
            "amount": $scope.data.amount,
            "amountExt": $scope.data.amountExt,
            "copywriting": $scope.data.copywriting,
            "hasPresentActive": $scope.data.hasPresentActive,



        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.chargeUpdate, "POST", params).then(function (res) {
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



    //点击参加活动
    $scope.autoRenew = function(){
        $scope.data.hasPresentActive = $scope.data.hasPresentActive == 0?1:0;
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
 * @Last Modified by:   郝晓波
 * @Last Modified time: 2017-05-31 17:24:03
 */
//投诉
'use strict';

App.controller('complainController', ['$scope', '$http', function ($scope, $http) {

}]);
/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//提现审核
'use strict';

App.controller('depositAuditingController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
        $scope.depositAuditingListPromise = $http({
            url: $rootScope.api.depositAuditingList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "bizName": $scope.data.bizName,
                "auditStatus": $scope.data.auditStatus,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.depositAuditingListData = res.data.data;
                $scope.depositAuditingListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
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
    //弹窗查看设备分成比例
    $scope.DevSharing = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'DevSharing.html',
            controller: 'DevSharingController',
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
    // <!--0：下线（脱络）；1：在线；  2:使用中；-->
    $scope.switchDevStatus = function (item) {
        var param = {
            id: item.id,
            onlineStatus: item.onlineStatus == 1 ? item.onlineStatus = 0 : 1

        };
        restful.fetch($rootScope.api.switchDevStatus, "POST", param).then(function (res) {
            if (res.code == 2000) {
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
    var devTypeArr = [
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

    if ($stateParams.gymType == 0) {
        $scope.deviceKind = devTypeArr;
    } else if ($stateParams.gymType == 1) {
        $scope.deviceKind = devTypeArr;
        $scope.deviceKind.push({
            id: 3,
            name: "AR设备"
        });
    }


    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
    };
    //设备厂商-跑步机
    $scope.deviceTradeT1 = [
        {
            deviceTradeId: 0,
            name: "好家庭"
        }, {
            deviceTradeId: 1,
            name: "汇祥"
        }
    ];
    //设备厂商-椭圆机+分析仪
    $scope.deviceTradeT2 = [
        {
            deviceTradeId: 2,
            name: "清华同方"
        }, {
            deviceTradeId: 3,
            name: "东华原"
        }
    ];
    //设备厂商-AR
    $scope.deviceTradeT3 = [
        {
            id: 4,
            name: "中大AR实验室"
        }
    ];

    $scope.deviceToTradeFn = function (e) {
        var isFlagSelect = 0;
        if ($scope.addDev.kind == 0) {
            //显示的跑步机的供应商F
            return isFlagSelect = 1;
        }
        //显示的非跑步机的供应商
        return isFlagSelect = 0;

    }

    //根据第一个框的选项获取第二个下拉框的可选值
    function getItemsToAppend(selectedValue) {
        var options = new Array();
        if (selectedValue == "1") {
            options.push("11", "12");
        }
        else if (selectedValue == "2") {
            options.push("21", "22");
        }
        else {
            options.push("31", "32");
        }
        return options;

    }
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
    //设备的默认价格，从新增场馆里继承下来。
    $scope.data.cost = $stateParams.deviceCost ? $stateParams.deviceCost : $scope.data.cost;
    /*增加设备*/
    $scope.save = function () {
        var params = {
            "productInfoId": $scope.data.productInfoId,
            "manufacturer": $scope.data.manufacturer,
            "trainerMallId": $scope.data.trainerMallId,
            "deviceIdentity": $scope.data.deviceIdentity,
            "gymId": $stateParams.gymId,
            "type": $stateParams.gymType,//appJs里路由后跟的参数
            "model": $scope.data.model,

            "productionDate": $scope.data.todayStartTime ? $scope.data.todayStartTime : $rootScope.tools.dateToTimeStamp13Bit($scope.data.productionDate),
            "warrantyStartDate": $scope.data.todayStartTime ? $scope.data.todayStartTime : $rootScope.tools.dateToTimeStamp13Bit($scope.data.beginTime),
            "warrantyEndDate": $scope.data.todayEndTime ? $scope.data.todayEndTime : $rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),

            "onceTime": $scope.data.onceTime,
            "cost": $scope.data.cost,

        };
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
    var devTypeArr = [
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

    if ($stateParams.gymType == 0) {
        $scope.deviceKind = devTypeArr;
    } else if ($stateParams.gymType == 1) {
        $scope.deviceKind = devTypeArr;
        $scope.deviceKind.push({
            id: 3,
            name: "AR设备"
        });
    }
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
        $scope.deviceTradeT1s.id = item.id;
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
App.controller("DevEditController", ['$scope', '$stateParams', '$http', '$uibModalInstance', 'restful', '$state', '$rootScope', '$uibModal', 'item', 'toastr', 'lifeHouseAreaSelector', function ($scope, $stateParams, $http, $uibModalInstance, restful, $state, $rootScope, $uibModal, item, toastr, lifeHouseAreaSelector) {


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
    $scope.deviceKinds = {};
    var devTypeArr = [
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

    if ($stateParams.gymType == 0) {
        $scope.deviceKind = devTypeArr;
    } else if ($stateParams.gymType == 1) {
        $scope.deviceKind = devTypeArr;
        $scope.deviceKind.push({
            id: 3,
            name: "AR设备"
        });
    }
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
        $scope.deviceTradeT1s.id = item.id;
    };
    //设备厂商-椭圆机+分析仪
    $scope.deviceTradeT2 = [
        {
            id: 2,
            name: "清华同方"
        }, {
            id: 3,
            name: "东华原"
        }
    ];
    $scope.deviceTradeT2s = {};
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
            "gymId": $stateParams.gymId,
            "type": $scope.data.type,//从上边的根据设备id获取的，后台数据有问题null
            "productInfoId": $scope.data.productInfoId,
            "trainerMallId": $scope.data.trainerMallId,
            "manufacturer": $scope.data.manufacturer,
            "deviceIdentity": $scope.data.deviceIdentity,
            "model": $scope.data.model,
            "productionDate": $scope.data.productionDate,
            "warrantyStartDate": $scope.data.warrantyStartDate,
            "warrantyEndDate": $scope.data.warrantyEndDate,
            "onceTime": $scope.data.onceTime,
            "cost": $scope.data.cost,
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

App.controller("DevSharingController", ['$scope', '$http', '$uibModalInstance', '$state', '$rootScope', '$uibModal', 'item', 'toastr', function ($scope, $http, $uibModalInstance, $state, $rootScope, $uibModal, item, toastr) {


    $scope.data = {};
    //代理级别
    $scope.proxyArr = [
        {
            "id": 0,
            "name": "省代理"
        }, {
            "id": 1,
            "name": "一级代理"
        }, {
            "id": 2,
            "name": "二级代理"
        }, {
            "id": 3,
            "name": "三级代理"
        }
    ];
    //是、否有渠道方
    $scope.isHasRoleId5Arr = [
        {
            id: 0,
            name: "无"
        }, {
            id: 1,
            name: "有"
        }
    ];
    //1：通过设备id查询设备的信息
    $http({
        url: $rootScope.api.getDevSharingById,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "deviceId": item.id
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.data = res.data.data;
        } else {
            toastr.error(res.msg);
        }
    });
    $scope.close=function () {
        $uibModalInstance.close();
    }

}]);
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
/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-07 14:32:33
 */
//场馆设置
'use strict';
App.controller('DevUnbound1Controller', ['$scope', '$stateParams', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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


    //*************************分割线结束***********************************

    $rootScope.query = function () {

        $scope.DevListPromise = $http({
            url: $rootScope.api.getDevUnboundList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "count": parseInt($scope.PageSize) ? parseInt($scope.PageSize) : 20,
                "page": parseInt($scope.PageIndex) - 1 ? parseInt($scope.PageIndex) - 1 : 0,
                "deviceIdentity": $scope.data.deviceIdentity
            }
        }).then(function (res) {
            if (res.data.code == 2000) {

                $scope.DevListData = res.data.data;
                console.log(typeof $scope.DevListData);

/*
                for(var item in  $scope.DevListData){
                    console.log($scope.DevListData[item].bindStatusName="绑定","item:");
                }
*/

                $scope.totalCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();
    //解绑
    $scope.lockToUnbound = function (id) {
        console.log(id,"设备号：");
        $http({
            url: $rootScope.api.getDevUnbound,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "deviceIdentity":id
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                toastr.success("解绑成功");
                $scope.query();

            }else{
                toastr.error("解绑失败");
            }
        },function (rej) {
            toastr.error(res.msg);

        });

    }


}]);

/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-10-16 11:43:51
 */
//分成方设置
'use strict';
App.controller('dividedConfigController', ['$scope', '$stateParams', 'Session', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', 'toastr', function ($scope, $stateParams, Session, $rootScope, $http, ngProgressFactory, $uibModal, toastr) {
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
            "id": Session.$storage.accessToken,
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

    /*公司校验-确认打款金额*/
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
    /*提现*/
    $scope.getDeposit = function (data) {
        console.log(data);
        $uibModal.open({
            templateUrl: 'getDeposit.html',
            controller: 'getDepositController',
            size: 'lg',
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
        });
    }
}]);
//公司账户
App.controller('doVerifyAccountMoneyController', ['$scope', 'item', 'Session', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', '$uibModalInstance', 'toastr', function ($scope, item, Session, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, $uibModalInstance, toastr) {

    //查询账户信息+名下场馆
    $scope.query = function () {
        var params = {
            "id": Session.$storage.accessToken,
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
App.controller('personVerifyController', ['$scope', 'item', 'Session', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', '$uibModalInstance', 'toastr', function ($scope, item, Session, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, $uibModalInstance, toastr) {
    $scope.data = {};
    //查询账户信息+名下场馆
    $scope.query = function () {
        var params = {
            "id": Session.$storage.accessToken,
        };
        $http({
            url: $rootScope.api.getBankInfo,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params
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
    $scope.data.bankCardNum == null ? $scope.data.bankCardNum = item.bankAccount : $scope.data.bankCardNum;
    $scope.data.bankName == null ? $scope.data.bankName = item.bankName : $scope.data.bankName;
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
                $uibModalInstance.close();
                toastr.success("校验通过");
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

//提现（code为2时候方可点击，共用）
App.controller('getDepositController', ['$scope', 'item', 'Session', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', '$uibModalInstance', 'toastr', function ($scope, item, Session, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, $uibModalInstance, toastr) {
    $scope.data = {};

    $scope.save = function () {
        console.log(item.id);
        var params = {
            "id": item.id,
            "depositMongy": $scope.data.depositMongy
        };
        $http({
            url: $rootScope.api.drawmoney,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.data = res.data.data;
                toastr.success("提现成功");
                $uibModalInstance.close();
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
/**
 * Created by haoxb on 2017/6/23.
 */
'use strict';
/*提现记录*/
App.controller('getMoneyListController', ['$scope','Session', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', 'toastr', function ($scope,Session, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, toastr) {
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

    //查询
    $rootScope.query = function () {
        var params = {
            "useid": Session.$storage.accessToken,
            "page": parseInt($scope.PageIndex) - 1,
            "count": parseInt($scope.PageSize),
        };
        $http({
            url: $rootScope.api.getMoneyList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.getMoneyListData = res.data.data;
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
    $scope.gymEditData = {};
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
            "status": $scope.data.status,
            "username": $scope.data.username,
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
                $scope.positionLngAndLatObj = {
                    longitude: res.data.longitude,
                    latitude: res.data.latitude
                };
                console.log($scope.positionLngAndLat, '编辑地图反绑positionLngAndLat:');
                console.log($scope.gymEditData.address, '编辑地图反绑地图address:');
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
    $scope.devDetailList = function (item) {
        console.log(item.id,item.type, "跨页传递的参数：id和type");
        $state.go("devConfig", {"gymId": item.id,"gymType":item.type,"deviceCost":item.deviceCost});

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
    //1:声明变量
    //场地方账户类型
    $scope.bankTypeArr = [
        {
            "id": 0,
            "name": "公司账户"
        },
        {
            "id": 1,
            "name": "个人账户"
        }
    ];
    //代理级别
    $scope.proxyArr = [
        {
            "id": 0,
            "name": "省代理"
        }, {
            "id": 1,
            "name": "一级代理"
        }, {
            "id": 2,
            "name": "二级代理"
        }, {
            "id": 3,
            "name": "三级代理"
        }
    ];
    $scope.getProxyId = function (item) {
        console.log(item.id, "代理的id");
    };
    //场地方开户银行
    $scope.accountNameArr = [
        {
            id: 0,
            name: "兴业银行"
        }, {
            id: 1,
            name: "中国农业银行"
        }, {
            id: 3,
            name: "交通银行"
        }, {
            id: 4,
            name: "中国工商银行"
        }, {
            id: 5,
            name: "中国建设银行"
        }, {
            id: 6,
            name: "中国银行"
        }, {
            id: 7,
            name: "招商银行"
        }, {
            id: 8,
            name: "中国民生银行"
        }, {
            id: 9,
            name: "中国光大银行"
        }
    ];
    //是、否有渠道方
    $scope.isHasRoleId5Arr = [
        {
            id: 0,
            name: "无"
        }, {
            id: 1,
            name: "有"
        }
    ];
    $scope.getIsHasRole5 = function (params) {
        //==0-有渠道方，分成为5；场地方分成是15
        //    或者view里读取webData.Role5Id的值做ng-show。
        if (params.id == 1) {
            //改写对象的里的属性值。刷新视图，并给了后台所要的字
            $scope.gymEditData.roleRelList[5].percent = 5;
            $scope.gymEditData.roleRelList[4].percent = 15;
        } else if (params.id == 0) {
            //编辑
            $scope.gymEditData.roleRelList[5].percent = 0;
            $scope.gymEditData.roleRelList[4].percent = 20;
        }
    };
    //取角色与分成-编辑
    $http({
        url: $rootScope.api.GymPecentRole,
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.ShareRoles = res.data.data;
            console.log($scope.ShareRoles, "分成角色：");//在view里push了一些只是在前端展示的字段，add传递给后台有些多余字
        }
    });
    //下拉开关
    $scope.listBodyIsShow = false;
    //下拉单击事件。
    $scope.getSubjectList = function (subjectItem, item) {
        item.subjectName = subjectItem.subjectName;//
        item.subjectId = subjectItem.id;
        item.listBodyIsShow = false;
        console.log(item.subjectId);
    }
    //获取主体-支持模糊搜索-编辑-根据主体id反查出主体名字
    $scope.getSubject = function (item) {
        item.listBodyIsShow = true;
        if (!item.subjectName || (item.subjectName && item.subjectName == "")) {
            return false;
        }
        //subject:用户输入
        var timer = setTimeout(function () {
            $http({
                url: $rootScope.api.GymPecentBody,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "subjectName": item.subjectName,
                }
            }).then(function (res) {
                if (res.data.code == 2000) {
                    //下来列表里的备选
                    item.subjectListData = res.data.data;
                    //下拉开关
                    item.listBodyIsShow = true;
                }
                /*else{
                 toastr.error(res.msg);
                 }
                 },function (rej) {
                 console.info(rej);*/
            });
        }, 500);
    };
    //2：编辑好后提交场馆的信息
    $scope.saveGymEdit = function (position) {
        console.log(position, "position:坐标信息");
        var positionArr = position.split(",");
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
            "cityId": $scope.gymEditData.cityId,
            "regionId": $scope.gymEditData.regionId,
            "address": $scope.gymEditData.address,
            "linkedMan": $scope.gymEditData.linkedMan,
            "phone": $scope.gymEditData.phone,
            "type": $scope.gymEditData.type,
            "longitude": positionArr[0],
            "latitude": positionArr[1],
            "openTime": $scope.gymEditData.openTimeFormat + ":00",
            "endTime": $scope.gymEditData.endTimeFormat + ":00",
            "status": $scope.gymEditData.status,
            "gymCost": $scope.gymEditData.gymCost,
            "deviceCost": $scope.gymEditData.deviceCost,
            "roleRelList": $scope.gymEditData.roleRelList//有些字段是自己添加此对象。
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
    //场地方账户类型
    $scope.bankTypeArr = [
        {
            "id": 0,
            "name": "公司账户"
        },
        {
            "id": 1,
            "name": "个人账户"
        }
    ];
    //代理级别
    $scope.proxyArr = [
        {
            "id": 0,
            "name": "省代理"
        }, {
            "id": 1,
            "name": "一级代理"
        }, {
            "id": 2,
            "name": "二级代理"
        }, {
            "id": 3,
            "name": "三级代理"
        }
    ];
    $scope.getProxyId = function (item) {
        console.log(item.id, "代理的id");
    };
    //场地方开户银行
    $scope.accountNameArr = [
        {
            id: 0,
            name: "兴业银行"
        }, {
            id: 1,
            name: "中国农业银行"
        }, {
            id: 3,
            name: "交通银行"
        }, {
            id: 4,
            name: "中国工商银行"
        }, {
            id: 5,
            name: "中国建设银行"
        }, {
            id: 6,
            name: "中国银行"
        }, {
            id: 7,
            name: "招商银行"
        }, {
            id: 8,
            name: "中国民生银行"
        }, {
            id: 9,
            name: "中国光大银行"
        }
    ];
    //是、否有渠道方
    $scope.isHasRoleId5Arr = [
        {
            id: 0,
            name: "无"
        }, {
            id: 1,
            name: "有"
        }
    ];
    $scope.getIsHasRole5 = function (params) {
        //==0-有渠道方，分成为5；场地方分成是15
        $scope.webData = {};
        $scope.webData.Role5Id = params.id;
        console.log($scope.webData.Role5Id = params.id, "isHasRoleId5:");
        //    或者view里读取webData.Role5Id的值做ng-show。
        if (params.id == 1) {
            //改写对象的里的属性值。刷新视图，并给了后台所要的字
            $scope.ShareRoles[5].percent = 5;
            $scope.ShareRoles[4].percent = 15;
            $scope.ShareRoles[5].proxyId = 1;
        } else if (params.id == 0) {
            $scope.ShareRoles[5].percent = 0;
            $scope.ShareRoles[4].percent = 20;
            $scope.ShareRoles[5].proxyId = 0;
        }
    };
    //取角色与分成
    $http({
        url: $rootScope.api.GymPecentRole,
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {}
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.ShareRoles = res.data.data;
            console.log($scope.ShareRoles, "分成角色：");//在view里push了一些只是在前端展示的字段，add传递给后台有些多余字
        }
    });
    //下拉开关
    $scope.listBodyIsShow = false;
    //下拉单击事件。
    $scope.getSubjectList = function (subjectItem, item) {
        item.subjectName = subjectItem.subjectName;//
        item.subjectId = subjectItem.id;
        item.listBodyIsShow = false;
    }
    //获取主体-支持模糊搜索
    $scope.getSubject = function (item) {
        item.listBodyIsShow = true;
        if (!item.subjectName || (item.subjectName && item.subjectName == "")) {
            return false;
        }
        //subject:用户输入-调试编辑时候改成subjectName
        var timer = setTimeout(function () {
            $http({
                url: $rootScope.api.GymPecentBody,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "subjectName": item.subjectName,//和后台字段一致，不然编辑时候麻烦。回绑还要改。
                }
            }).then(function (res) {
                if (res.data.code == 2000) {
                    //下来列表里的备选
                    item.subjectListData = res.data.data;
                    //下拉开关
                    item.listBodyIsShow = true;
                }
                /*else{
                 toastr.error(res.msg);
                 }
                 },function (rej) {
                 console.info(rej);*/
            });
        }, 500);
    };
    $scope.save = function (item, $index) {
        if ($scope.position) {
            $scope.ppstr = $scope.position.lng + "," + $scope.position.lat;
            //toastr.info('当前选中的经纬度' + $scope.position.lng + "，" + $scope.position.lat)
        } else {
            toastr.error("定位失败，请重新定位！");
        }
        var params = {
            "name": $scope.data.name,
            "provinceId": $scope.data.provinceId,
            "cityId": $scope.data.cityId,
            "regionId": $scope.data.regionId,
            "address": $scope.data.address,
            "linkedMan": $scope.data.linkedMan,
            "phone": $scope.data.phone,
            "type": $scope.data.type,
            "longitude": $scope.position.lng,
            "latitude": $scope.position.lat,
            "openTime": $scope.data.openTimeFormat + ":00",
            "endTime": $scope.data.endTimeFormat + ":00",
            "status": $scope.data.status,
            "gymCost": $scope.data.gymCost,
            "deviceCost": $scope.data.deviceCost,
            "roleRelList": $scope.ShareRoles,//有些字段是自己添加此对象。
        };
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
}]);
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
App.controller('incomeListController', ['$scope', '$stateParams', '$rootScope', '$http', 'ngProgressFactory', '$uibModal', 'toastr', function ($scope, $stateParams, $rootScope, $http, ngProgressFactory, $uibModal, toastr) {
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
            "page": parseInt($scope.PageIndex) - 1,
            "count": parseInt($scope.PageSize),
            "orderNo": $scope.data.orderNo,
            "startTime": $scope.data.startTime,
            "endTime": $scope.data.endTime,

        };
        $http({
            url: $rootScope.api.getIncomeList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params,
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.incomeListData = res.data.data;
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

    //下拉开关
    $scope.listBodyIsShow = false;
    $scope.item={};
    //下拉单击事件。
    $scope.getSubjectList = function (gymItem, data) {
        data.gymName = gymItem.gymName;//
        data.gymId = gymItem.gymId;
        data.listBodyIsShow = false;
        console.log(data);
    }
    //获取主体-支持模糊搜索-编辑-根据主体id反查出主体名字
    $scope.getSubject = function (data) {
        data.listBodyIsShow = true;
        if (!data.gymName || (data.gymName && data.gymName == "")) {
            return false;
        }
        //gym:用户输入
        var timer = setTimeout(function () {
            $http({
                url: $rootScope.api.getIncomeGymList,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "gymName": data.gymName,
                }
            }).then(function (res) {
                if (res.data.code == 2000) {
                    //下来列表里的备选
                    data.gymListData = res.data.data;
                    //下拉开关
                    data.listBodyIsShow = true;
                }
                /*else{
                 toastr.error(res.msg);
                 }
                 },function (rej) {
                 console.info(rej);*/
            });
        }, 500);
    };
}]);

/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//订单分成管理
'use strict';

App.controller('incomeManageController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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







    $rootScope.query = function () {
        $scope.incomeManageListPromise = $http({
            url: $rootScope.api.incomeManageList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
                "gymName": $scope.data.gymName,
                "proxyName": $scope.data.proxyName,
                "gymSharingName": $scope.data.gymSharingName,
                "channelName": $scope.data.channelName,
                "developName": $scope.data.developName,
                "marketName": $scope.data.marketName,
                "orderNo": $scope.data.orderNo,
                "trainerMallId": $scope.data.trainerMallId,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.incomeManageListData = res.data.data;
                $scope.incomeManageListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



}]);


/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//场地方收入明细
'use strict';

App.controller('mainIncomeController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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




    //会员卡类型
    $scope.memberTypeDatas = {};
    $scope.memberTypeData = [];


    $scope.memberTypePromise = $http({
        url: $rootScope.api.getDicGymList,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            'gymName': $scope.data.gymId
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.memberTypeData = res.data.data;
            console.log($scope.memberTypeData);


            $scope.getMemberTypeData = function (item) {
                $scope.data.gymId = item.gymId;

            };

        }
    });


    $rootScope.query = function () {
        $scope.mainIncomeListPromise = $http({
            url: $rootScope.api.mainIncomeList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "orderNo": $scope.data.orderNo,
                "gymId": $scope.data.gymId,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.mainIncomeListData = res.data.data;
                $scope.mainIncomeListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



}]);
/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-07-24 15:16:04
 */
//预约
'use strict';


App.controller('makeOrderController', ['$scope', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
    //变量声明
    $scope.data = {};
    $scope.orderStatuses = {};
    //预约状态
    $scope.orderStatus = [
        {
            id: 0,
            name: "预约中"
        }, {
            id: 1,
            name: "已取消"
        }, {
            id: 2,
            name: "已爽约"
        }, {
            id: 3,
            name: "规定时间使用"
        }
    ];
    $scope.getorderStatus = function (item) {
        item={};//初始化，否则切换为undefined的时候报错。
        $scope.orderStatuses.id = item.id;
    };
    //查询定义
    $scope.query = function () {
        $scope.makeOrderListPromise = $http({
            url: $rootScope.api.getMakeOrder,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "mallId": $scope.data.mallId,
                "mobile": $scope.data.mobile,
                "status": $scope.data.status,
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId,
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize)
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.makeOrderListData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    //查询
    $scope.query();

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
    };
    //导出

    document.getElementById('makeOrderListEcho').action=$rootScope.api.getMakeOrderEportExcel;

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

    //*************************分割线结束***********************************



}]);

/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//会员卡
'use strict';

App.controller('memberCardController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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





    //子控制器
}]).controller('tabMember',['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {



    $scope.reset = function (type) {
        $scope.data = {};
        $scope.memberTypeDatas = {};
        $scope.query(type);
    }
    //默认显示基本资料
    $scope.type='01';
    $scope.click=function (type) {
        $scope.data = {};
        $scope.type=type;
        $scope.PageIndex = 1
        console.log(type,"type:");
        $scope.query(type);
    }




    //弹窗新增
    $scope.addMember = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'memberViewAdd.html',
            controller: 'memberAddController',
            size: 'md',
            resolve: {
                item: function () {
                    return data;
                }
            },
        });
        modalInstance.result.then(function () {
            //close
            $scope.query('02');
        }, function () {
            //dismissed
            $scope.query('02');
        })
    }


    //弹窗修改按钮

    $scope.compareCard = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'compareCard.html',
            controller: 'compareCardController',
            size: 'md',
            resolve: {
                item: function () {
                    return data;
                }
            },
        });
        modalInstance.result.then(function () {
            //close
            $scope.query('02');
        }, function () {
            //dismissed
            $scope.query('02');
        })
    }



    //删除按钮
    $scope.deleteCard = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.del, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("删除成功", res.msg);
                $scope.query('02');
            } else {
                toastr.error("删除失败", res.msg);
            }
        }, function (rej) {
            toastr.error("删除失败", res.msg);
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




    //会员卡类型
    $scope.memberTypeData = [];



    $scope.memberTypePromise = $http({
        url: $rootScope.api.getDicList,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "typeCode":"CARD_TYPE"
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.memberTypeData = res.data.data;
            console.log($scope.memberTypeData);


            $scope.getMemberTypeData = function (item) {
                $scope.data.cardTypeId = item.dicKey;

            };

        }
    });





    $rootScope.query = function () {
        $scope.switchMemberCardApi=$rootScope.api.getvipinfos;
        //根据选择不同的tab的head选择不同的数据源


        if($scope.type=="01"){
            $scope.switchMemberCardApi = $rootScope.api.getvipinfos
        };
        if($scope.type=="02"){
            $scope.switchMemberCardApi = $rootScope.api.getList
        };

        //alert(type)



        $scope.memberCardDataPromise = $http({
            url:  $scope.switchMemberCardApi,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "mobile": $scope.data.mobile,
                "mallId": $scope.data.mallId,
                "vipAccount": $scope.data.vipAccount,
                "cardTypeId": $scope.data.cardTypeId,
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,



            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.memberCardData = res.data.data;
                $scope.memberCardDataCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();


}]);




/*
 -----------------
 新建会员卡
 -----------------
 */
App.controller("memberAddController", ['$scope', '$state', '$rootScope', '$http', '$uibModal','$uibModalInstance', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr',function ($scope, $state, $rootScope, $http, $uibModal, $uibModalInstance,restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
    $scope.data = {};

    $scope.save = function () {

        var params = {
            "name": $scope.memberTypeDatas.dicValue,
            "cardType": $scope.memberTypeDatas.dicKey,
            "price": $scope.data.price,
            "times": $scope.data.times,
            "frequency": $scope.data.frequency,
            "useTime": $scope.data.useTime,
            "effectiveDays": $scope.data.effectiveDays,
            "startDateType": $scope.data.startDateType,
            "description": $scope.data.description,

            "cityIds": $scope.data.isAllCountry == 0?$scope.cityIdAll.join(','):100000,
            "cityNames": $scope.data.isAllCountry == 0?$scope.cityNameAll.join(','):"全国",

            "isAutoRenew": $scope.data.isAutoRenew,
            "pictureUrl": $scope.imgUrlIcoArr4[0] == null?null:$scope.imgUrlIcoArr4[0].url,
            "iconUrl": $scope.imgUrlIcoArr5[0] == null?null:$scope.imgUrlIcoArr5[0].url,
        }
        console.log("要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.addMember, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("添加成功");
                console.log(res);
                $scope.query('02');
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



    //会员卡类型
    $scope.memberTypeDatas = {};
    $scope.memberTypeData = [];


    $scope.memberTypePromise = $http({
        url: $rootScope.api.getDicList,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "typeCode":"CARD_TYPE"
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.memberTypeData = res.data.data;
            console.log($scope.memberTypeData);


            $scope.getMemberTypeData = function (item) {
                $scope.memberTypeDatas.dicKey = item.dicKey;
                $scope.memberTypeDatas.dicValue = item.dicValue;

            };

        }
    });






    //生效日期
    $scope.effectiveDate = [
        {
            effectiveDateId: 0,
            name: "第一次使用"
        }, {
            effectiveDateId: 1,
            name: "购买当天"
        },
    ];

    $scope.getEffectiveDate = function ($item) {
        $scope.effectiveDateId = $item.effectiveDateId;
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






    $scope.data.isAllCountry = 0;
    //点击选中全国
    $scope.isChina = function(){
        $scope.data.isAllCountry = $scope.data.isAllCountry == 0?1:0;

    }

    $scope.data.isAutoRenew = 0
    //点击自动续费
    $scope.autoRenew = function(){
        $scope.data.isAutoRenew = $scope.data.isAutoRenew == 0?1:0;
    }

    //使用次数是否无限次
    $scope.applyTime = function(){
        $scope.data.times = $scope.data.times == 0?null:0;
        console.log($scope.data.times);
        $scope.data.times == 0?$('#timeSelect').attr("disabled","disabled"):$('#timeSelect').removeAttr("disabled")

    }
    //使用频率是否无限次
    $scope.applyFrequency = function(){
        $scope.data.frequency = $scope.data.frequency == 0?null:0;
        $scope.data.frequency == 0?$('#frequencySelect').attr("disabled","disabled"):$('#frequencySelect').removeAttr("disabled")
    }
    //使用时间是否无限次
    $scope.applyUseTime = function(){
        $scope.data.useTime = $scope.data.useTime == 0?null:0;
        $scope.data.useTime == 0?$('#useTimeSelect').attr("disabled","disabled"):$('#useTimeSelect').removeAttr("disabled")
    }


    //取消上传图片
    $scope.delIco = function (index,picIndex) {
        var key = 'imgUrlIcoArr' + picIndex
        $scope[key].splice(index,1);
    }

}]);


/*
 -----------------
 编辑会员卡
 -----------------
 */
App.controller("compareCardController",['$scope', '$state', '$rootScope', '$http', '$uibModal','$uibModalInstance', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr','item', function ($scope, $state, $rootScope, $http, $uibModal, $uibModalInstance,restful, ngProgressFactory, lifeHouseAreaSelector, toastr,item) {

    $scope.data = {};


    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.getbyId, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }
            console.log($scope.data,"$scope.data:");

            $scope.cityIdAll = $scope.data.cityIds.split(',');
            $scope.cityNameAll = $scope.data.cityNames.split(',');
            $scope.imgUrlIcoArr4 = [];
            $scope.imgUrlIcoArr5 = [];
            var obj4= {
                url:$scope.data.pictureUrl
            }
            var obj5= {
                url:$scope.data.iconUrl
            }
            $scope.imgUrlIcoArr4.push(obj4);
            $scope.imgUrlIcoArr5.push(obj5);
            $scope.memberTypeDatas.dicKey = $scope.data.cardType;
            $scope.memberTypeDatas.dicValue = $scope.data.name;
            console.log($scope.imgUrlIcoArr5);

        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });




    //选择城市



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




    //2：编辑好后提交场馆的信息
    $scope.saveCompareCard = function () {
        var params = {
            "id": item.id,
            "name": $scope.memberTypeDatas.dicValue,
            "cardType": $scope.memberTypeDatas.dicKey,
            "price": $scope.data.price,
            "times": $scope.data.times,
            "frequency": $scope.data.frequency,
            "useTime": $scope.data.useTime,
            "effectiveDays": $scope.data.effectiveDays,
            "startDateType": $scope.data.startDateType,
            "description": $scope.data.description,

            "cityIds": $scope.data.isAllCountry == 0?$scope.cityIdAll.join(','):100000,
            "cityNames": $scope.data.isAllCountry == 0?$scope.cityNameAll.join(','):"全国",

            "isAutoRenew": $scope.data.isAutoRenew,
            "pictureUrl": $scope.imgUrlIcoArr4[0] == null?null:$scope.imgUrlIcoArr4[0].url,
            "iconUrl": $scope.imgUrlIcoArr5[0] == null?null:$scope.imgUrlIcoArr5[0].url,

        };
        console.log(params);
        restful.fetch($rootScope.api.alter, "POST", params).then(function (res) {
            if (res.code == 2000) {
                toastr.success("修改成功");
                console.log(res);
                $rootScope.query('02');
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




    //会员卡类型
    $scope.memberTypeDatas = {};
    $scope.memberTypeData = [];


    $scope.memberTypePromise = $http({
        url: $rootScope.api.getDicList,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "typeCode":"CARD_TYPE"
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.memberTypeData = res.data.data;
            console.log($scope.memberTypeData);


            $scope.getMemberTypeData = function (item) {
                $scope.memberTypeDatas.dicKey = item.dicKey;
                $scope.memberTypeDatas.dicValue = item.dicValue;

            };

        }
    });





    //生效日期
    $scope.effectiveDate = [
        {
            effectiveDateId: 0,
            name: "第一次使用"
        }, {
            effectiveDateId: 1,
            name: "购买当天"
        },
    ];

    $scope.getEffectiveDate = function ($item) {
        $scope.effectiveDateId = $item.effectiveDateId;
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







    //点击选中全国
    $scope.isChina = function(){
        $scope.data.isAllCountry = $scope.data.isAllCountry == 0?1:0;

    }

    //点击自动续费
    $scope.autoRenew = function(){
        $scope.data.isAutoRenew = $scope.data.isAutoRenew == 0?1:0;
    }

    //使用次数是否无限次
    $scope.applyTime = function(){
        $scope.data.times = $scope.data.times == 0?null:0;
        console.log($scope.data.times);
        $scope.data.times == 0?$('.timeSelect').attr("disabled","disabled"):$('.timeSelect').removeAttr("disabled")

    }
    //使用频率是否无限次
    $scope.applyFrequency = function(){
        $scope.data.frequency = $scope.data.frequency == 0?null:0;
        $scope.data.frequency == 0?$('.frequencySelect').attr("disabled","disabled"):$('.frequencySelect').removeAttr("disabled")
    }
    //使用时间是否无限次
    $scope.applyUseTime = function(){
        $scope.data.useTime = $scope.data.useTime == 0?null:0;
        $scope.data.useTime == 0?$('.useTimeSelect').attr("disabled","disabled"):$('.useTimeSelect').removeAttr("disabled")
    }

    //取消上传图片
    $scope.delIco = function (index,picIndex) {
        var key = 'imgUrlIcoArr' + picIndex
        $scope[key].splice(index,1);
    }




}]);
/*
 * @Author: haoxb
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   haoxb
 * @Last Modified time: 2017-06-29 10:53:40
 */
//订单信息
'use strict';
App.controller('orderInfoController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.orderInfoListDataCount / $scope.PageSize) ? Math.ceil($scope.orderInfoListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }
    //*************************数据定义begin***********************************
    $scope.vipCard = [
        {
            "id": 0,
            "name": "月卡"
        }
    ];

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
  // 付款方式
    $scope.payType = [
        {
            id: 1,
            name: "会员卡"
        }, {
            id: 2,
            name: "钱包"
        }
    ]; // 场馆类型
    $scope.gymType = [
        {
            id: 0,
            name: "自营"
        }, {
            id: 1,
            name: "合作"
        }
    ];
    //*************************数据定义end***********************************
    //*************************分割线结束***********************************
    $rootScope.query = function () {
       // $scope.progressbar.start(); //进度条
        $scope.orderInfoListPromise = $http({
            url: $rootScope.api.getOrderInfo,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "gymType":$scope.data.gymType,
                "gymName":$scope.data.gymName,
                "mallId":$scope.data.mallId,
                "orderNum":$scope.data.orderNum,
                "deviceNum":$scope.data.deviceNum,
                "mobile":$scope.data.mobile,
                "payType":$scope.data.payType,
                "productId":$scope.data.productId,
                "startTime": $scope.data.todayStartTime?$scope.data.todayStartTime:$rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),
                "endTime": $scope.data.todayEndTime?$scope.data.todayEndTime:$rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.orderInfoListData = res.data.data;
                $scope.totalCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();


}]);

/*
 * @Author: gaofan
 * @Date:   2017-06-07 19:29:18
 * @Last Modified by:   gaofan
 * @Last Modified time: 2017-07-25 11:24:35
 */

//排行榜
'use strict';
App.controller('rankListController', ['$scope', '$stateParams', '$state', '$rootScope', '$http', 'lifeHouseAreaSelector', 'toastr', 'ngProgressFactory', function ($scope, $stateParams, $state, $rootScope, $http, lifeHouseAreaSelector, toastr, ngProgressFactory) {


//子控制器-tab
}]).controller('tabRank', ['$scope', '$stateParams', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $stateParams, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
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
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.rankListDataCount / $scope.PageSize) ? Math.ceil($scope.rankListDataCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }
    //默认显示基本资料
    $scope.type = '01';
    $scope.click = function (type) {
        $scope.data = {};
        $scope.PageIndex = 1;
        $scope.type = type;
        console.log(type, "type:");
        $scope.query(type);
    };


    $rootScope.query = function () {

        $scope.data.groupType = 1;
        if ($scope.type == "01") {

            $scope.data.groupType = 1;
            $scope.data.startTime = $scope.data.startTime == null?new Date():$scope.data.startTime

        }
        if ($scope.type == "02") {

            $scope.data.groupType = 2;
            $scope.data.startTime = $scope.data.startTime == null?new Date():$scope.data.startTime
        }
        if ($scope.type == "03") {

            $scope.data.groupType = 3;

        }


        $scope.rankListDataPromise = $http({
            url: $rootScope.api.findRank,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {

                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "groupType": $scope.data.groupType,
                "mallId": $scope.data.mallId,
                "mobile": $scope.data.mobile,
                /*good*/
                "startTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),

            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.rankListData = res.data.data;
                $scope.rankListDataCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取排行榜列表失败");
            }
        });
    };

    $scope.query();

}]);


/*
 * @Author: 高帆
 * @Date:   2017-5-31 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-05-31 17:24:03
 */
//报障
'use strict';

App.controller('reportFaultController', ['$scope','$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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

    /*$scope.setPage = function () {
        $scope.PageIndex = $scope.toPageNum > Math.ceil($scope.getAuditListCount / $scope.PageSize) ? Math.ceil($scope.getAuditListCount / $scope.PageSize) : $scope.toPageNum;
        $scope.query();
    };*/
    $scope.reset = function () {
        $scope.data = {};
        $scope.query();
    }




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

    $scope.getDeviceKind = function (item) {
        $scope.id = item.id;
    };


    //保障原因
    $scope.reportFaultCause = [
        {
            id: 0,
            name: "二维码脱落"
        }, {
            id: 1,
            name: "设备损坏"
        }, {
            id: 2,
            name: "设备故障"
        }
    ];
    $scope.getreportFaultCause = function (item) {
        $scope.id = item.id;

    };

    //状态
    $scope.state = [
        {
            id: 0,
            name: "待确认"
        }, {
            id: 1,
            name: "待维修"
        }, {
            id: 2,
            name: "已修复"
        }, {
            id: 3,
            name: "非故障"
        }
    ];
    $scope.getstate = function (item) {
        $scope.id = item.id;
    };


    //*********************************************************//

    $rootScope.query = function () {
        $scope.reportFaultListPromise = $http({
            url: $rootScope.api.getReportFaultList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "startTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.startTime),
                "endTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),
                "deviceIdentity": $scope.data.deviceIdentity,
                "mallName": $scope.data.mallName,
                "mobile": $scope.data.mobile,
                "productInfoId": $scope.data.productInfoId,
                "progress": $scope.data.progress,
                "malfunctionType": $scope.data.malfunctionType
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.reportFaultListData = res.data.data;
                $scope.reportFaultListDataCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取报障列表失败");
            }
        });
    };
    $scope.query();





    //弹窗确认故障
    $scope.confirmReportFault = function (itemId) {
        var param = {
            id: itemId.id,
            progress: itemId.progress.code == 0 ? itemId.progress.code = 1 : 0
        }
        restful.fetch($rootScope.api.changeProgress, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("报障成功", res.msg);
                $scope.query();
            } else {
                toastr.error("报障失败", res.msg);
            }
        }, function (rej) {
            toastr.error("报障失败", res.msg);
        });
    }


    //弹窗确认修复
    $scope.confirmRepair = function (itemId) {
        var param = {
            id: itemId.id,
            progress: itemId.progress.code == 1 ? itemId.progress.code = 2 : 1
        }
        restful.fetch($rootScope.api.changeProgress, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("修复成功", res.msg);
                $scope.query();
            } else {
                toastr.error("修复失败", res.msg);
            }
        }, function (rej) {
            toastr.error("修复失败", res.msg);
        });
    }

    //弹窗确认不是故障
    $scope.confirmNotReportFault = function (itemId) {
        var param = {
            id: itemId.id,
            progress: itemId.progress.code == 0 ? itemId.progress.code = 3 : 0
        }
        restful.fetch($rootScope.api.changeProgress, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("未报障", res.msg);
                $scope.query();
            } else {
                toastr.error("报障失败", res.msg);
            }
        }, function (rej) {
            toastr.error("报障失败", res.msg);
        });
    }


    //点击图片详情
    $scope.picDetial = function(data){
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'picturesDetail.html',
            controller: 'picturesDetailController',
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

}]);



App.controller("picturesDetailController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', '$uibModal', 'item', 'toastr', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, $uibModal, item, toastr, lifeHouseAreaSelector) {

    $rootScope.query();
    $scope.pictureList = item.pictureList;


    //$scope.getpictureList = function ($item) {
    //    $scope.pictureList = $item.pictureList;
    //
    //};

    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
}]);

/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   goafan
 * @Last Modified time: 2017-07-24 17:36:05
 */
//卡券
'use strict';


App.controller('sendDiscountController', ['$scope', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {
    //变量声明
    $scope.data = {};
    //卡券类型
    $scope.deviceKind = [
        {
            id: 0,
            name: "现金"
        }, {
            id: 1,
            name: "会员卡"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.id = item.id;
    };


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
    };
    /*//导出
    document.getElementById('sendDiscountListEcho').action=$rootScope.api.sendDiscountEportExcel;*/




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

    //*************************分割线结束***********************************

    $rootScope.query = function () {
        $scope.sendDiscountListPromise = $http({
            url: $rootScope.api.sendDiscount,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "mallId": $scope.data.mallId,
                "mobile": $scope.data.mobile,
                "type": $scope.data.type,
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.sendDiscountListData = res.data.data;
                $scope.sendDiscountListDataCount = res.data.page_info.total;
                $scope.toPageNum = $scope.PageIndex;
            }
        });
    };
    $scope.query();

}]);

/*
 * @Author: gaofan
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//分成统计
'use strict';

App.controller('shareCountController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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



    //会员卡类型
    $scope.memberTypeDatas = {};
    $scope.memberTypeData = [];


    $scope.memberTypePromise = $http({
        url: $rootScope.api.shareCountDicList,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            'subjectName': $scope.data.subjectId
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.memberTypeData = res.data.data;
            console.log($scope.memberTypeData);


            $scope.getMemberTypeData = function (item) {
                $scope.data.subjectId = item.id;

            };

        }
    });

    $rootScope.query = function () {
        $scope.shareCountListPromise = $http({
            url: $rootScope.api.shareCountList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "subjectId": $scope.data.subjectId,
                "trainerMallId": $scope.data.trainerMallId,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.shareCountListData = res.data.data;
                $scope.shareCountListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });

        $scope.shareCountListAmount = $http({
            url: $rootScope.api.shareCountAmount,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {

                "subjectId": $scope.data.subjectId,
                "trainerMallId": $scope.data.trainerMallId,
                "startTime": $scope.data.startTime,
                "endTime": $scope.data.endTime,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.shareCountAmountData = res.data.data;

            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });

    };
    $scope.query();



}]);


/*
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//主体分成设置
'use strict';

App.controller('shareholderController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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




    //弹窗新增
    $scope.addShareholder = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'shareholderViewAdd.html',
            controller: 'shareholderAddController',
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
            templateUrl: 'editShareholder.html',
            controller: 'editShareholderController',
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
        restful.fetch($rootScope.api.shareholderDel, "POST", param).then(function (res) {
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
        $scope.shareholderListPromise = $http({
            url: $rootScope.api.shareholderList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "subjectName": $scope.data.subjectName,
                "userName": $scope.data.userName,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.shareholderListData = res.data.data;
                $scope.shareholderListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



}]);


/*
 -----------------
 新增
 -----------------
 */
App.controller("shareholderAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {
    $scope.data = {};

    $scope.save = function () {
        var params = {

            "subjectName": $scope.data.subjectName,
            "accountBank": $scope.data.accountBank,
            "accountName": $scope.data.accountName,
            "accountNum": $scope.data.accountNum,
            "accountType": $scope.data.accountType,


        }

        restful.fetch($rootScope.api.shareholderAdd, "POST", params).then(function (res) {
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




    //账户类型
    $scope.deviceKinds = {};
    $scope.deviceKind = [
        {
            id: 0,
            name: "公司账户"
        }, {
            id: 1,
            name: "个人账户"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };

}]);



/*
 -----------------
 修改
 -----------------
 */
App.controller("editShareholderController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};



    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.shareholderId, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }
            console.log($scope.data,"$scope.data:");


        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });



    //账户类型
    $scope.deviceKinds = {};
    $scope.deviceKind = [
        {
            id: 0,
            name: "公司账户"
        }, {
            id: 1,
            name: "个人账户"
        }
    ];

    $scope.getDeviceKind = function (item) {
        $scope.deviceKinds.id = item.id;
        console.log($scope.deviceKinds.id);
    };




    $scope.save = function () {
        var params = {

            "id": item.id,
            "subjectName": $scope.data.subjectName,
            "accountBank": $scope.data.accountBank,
            "accountName": $scope.data.accountName,
            "accountNum": $scope.data.accountNum,
            "accountType": $scope.data.accountType,


        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.shareholderUpdate, "POST", params).then(function (res) {
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

/*
 * @Author: 高帆
 * @Date:   2017-07-20 17:24:03
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-07-20 17:24:03
 */
//跑步机管理员管理
'use strict';

App.controller('treadmillAdminController', ['$scope','$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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


    //弹窗新增
    $scope.addAdmin = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'adminViewAdd.html',
            controller: 'adminAddController',
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

    $scope.editAdmin = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editAdmin.html',
            controller: 'editAdminController',
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
    $scope.deleteAdmin = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.treadmillAdminDel, "POST", param).then(function (res) {
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
        $scope.treadmillAdminListPromise = $http({
            url: $rootScope.api.treadmillAdminList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "managerName": $scope.data.managerName,
                "managerMobile": $scope.data.managerMobile,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.treadmillAdminListData = res.data.data;
                $scope.treadmillAdminListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取跑步机管理员列表失败");
            }
        });
    };
    $scope.query();




}]);

/*
 -----------------
 新建管理员
 -----------------
 */
App.controller("adminAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {

    $scope.data = {};

    $scope.save = function () {
        var params = {
            "managerName": $scope.data.managerName,
            "managerMobile": $scope.data.managerMobile,
            "managerAccount": $scope.data.managerMobile,
            "managerPassword": $scope.data.managerPassword,

        }

        restful.fetch($rootScope.api.treadmillAdminAdd, "POST", params).then(function (res) {
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



}]);


/*
 -----------------
 编辑管理员
 -----------------
 */
App.controller("editAdminController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {
    $scope.data = {};




    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    restful.fetch($rootScope.api.treadmillAdminGetid, "POST", params).then(function (res) {
        if (res.code == 2000) {

            for (var key in res.data) {
                $scope.data[key] = res.data[key];
            }



        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });


    $scope.save = function () {
        alert(0)
        var params = {
            "id": item.id,

            "managerName": $scope.data.managerName,
            "managerMobile": $scope.data.managerMobile,
            "managerAccount": $scope.data.managerMobile,
            "managerPassword": $scope.data.managerPassword,



        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.treadmillAdminUpdate, "POST", params).then(function (res) {
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
}]);
/*
 * @Author: 高帆
 * @Date:   2017-07-26 17:24:03
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-07-26 17:24:03
 */
//跑步机开关机管理
'use strict';

App.controller('treadmillSwitchController', ['$scope','$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope,$state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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
    $scope.progress = [
        {
            id: 0,
            name: "未应用"
        }, {
            id: 1,
            name: "已应用"
        }
    ];
    $scope.getprogress = function (item) {
        $scope.id = item.id;
    };


    //是否应用
    $scope.publish = function (itemId) {
        var param = {
            id: itemId.id,

        }
        restful.fetch($rootScope.api.upushPowerOnTime, "POST", param).then(function (res) {
            if (res.code == 2000) {
                toastr.success("应用成功", res.msg);
                itemId.state = 1
                console.log(itemId.state);
                $scope.query();

            } else {
                toastr.error("应用失败", res.msg);
            }
        }, function (rej) {
            toastr.error("应用失败", res.msg);
        });
    }



    //弹窗新建
    $scope.addSwitch = function (data) {
        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'switchViewAdd.html',
            controller: 'switchAddController',
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
    $scope.deleteSwitch = function (itemId) {
        var param = {
            id: itemId.id,
        }
        restful.fetch($rootScope.api.treadmillSwitchDel, "POST", param).then(function (res) {
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


    //弹窗編輯按钮

    $scope.editSwitch = function (data) {

        var item;
        var modalInstance = $uibModal.open({
            templateUrl: 'editSwitch.html',
            controller: 'editSwitchController',
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



    $rootScope.query = function () {
        $scope.treadmillSwitchListPromise = $http({
            url: $rootScope.api.treadmillSwitchList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "provinceId": $scope.data.provinceId,
                "cityId": $scope.data.cityId,
            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.treadmillSwitchListData = res.data.data;

            } else {
                toastr.error(res.msg);
            }
        });
    };
    $scope.query();



}]);



/*
 -----------------
 新建开关机规则
 -----------------
 */
App.controller("switchAddController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector) {

    $scope.data = {};

    $scope.save = function () {
        var params = {
            "startTime": $scope.data.beginTime,
            "endTime": $scope.data.endTime,
            "provinceId": $scope.data.provinceId,
            "cityId": $scope.data.cityId,

        }

        restful.fetch($rootScope.api.treadmillSwitchAdd, "POST", params).then(function (res) {
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





}]);



/*
 -----------------
 开关机编辑
 -----------------
 */
App.controller("editSwitchController", ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item) {



    //省市区-类型联动查询
    lifeHouseAreaSelector.getProvinces().then(function (provinces) {
        //获取省份
        $scope.provinces = provinces;
    });




    // 编辑-反向向联动
    $scope.getCitys = function (provinces) {
         /*  $scope.data.cityId = "";
         $scope.data.regionId = "";*/
        if (provinces) {
            lifeHouseAreaSelector.getCitys(provinces).then(function (citys) {
                //获取市
                $scope.citys = citys;
                $scope.data.areaCode = provinces;
            });
        }


    };



    //1：通过id查询场馆的信息
    var params = {
        id: item.id
    };
    $scope.data={};

    restful.fetch($rootScope.api.treadmillSwitchGetbyid, "POST", params).then(function (res) {
        if (res.code == 2000) {
            console.log(res.data,"res.data:");
            /*for (var key in res.data) {
             $scope.data[key] = res.data[key];
             }*/
            $scope.data = res.data;
            $scope.data.beginTime = $scope.data.startTime
            console.log($scope.data,"$scope.data:");


            $scope.getCitys(res.data.provinceId);
            $scope.data.cityId = res.data.cityId;

        } else {
            toastr.error(res.msg);
        }
    }, function (rej) {
        console.info(rej);
    });


    $scope.save = function () {
        var params = {
            "id": item.id,

            "startTime": $scope.data.beginTime,
            "endTime": $scope.data.endTime,
            "provinceId": $scope.data.provinceId,
            "cityId": $scope.data.cityId,



        }
        console.log("添加场馆要丢给后台的字段");
        console.log(params);
        restful.fetch($rootScope.api.treadmillSwitchAlter, "POST", params).then(function (res) {
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

    $scope.query = function () {
        //$scope.progressbar.start(); //进度条
        $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail01;
        //根据选择不同的tab的head选择不同的数据源
        if ($scope.type == "01") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail01;
        }
        if ($scope.type == "02") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail02;
            console.log($scope.switchgetUserDetailDetailApi, "地址type=02：");
        }
        if ($scope.type == "03") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail03;
        }
        if ($scope.type == "04") {
            $scope.switchgetUserDetailDetailApi = $rootScope.api.getUserDetail04;
        }
        if ($scope.type == "05") {
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
                $scope.item = res.data.data;
                if(!res.data.page_info){
                    res.data.page_info={};
                }
                $scope.totalCount = res.data.page_info.total;
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

    //会员卡类型
    $scope.memberTypeDatas = {};
    $scope.memberTypeData = [];


    $scope.memberTypePromise = $http({
        url: $rootScope.api.getDicList,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "typeCode": "CARD_TYPE"
        }
    }).then(function (res) {
        if (res.data.code == 2000) {
            $scope.memberTypeData = res.data.data;
            console.log($scope.memberTypeData);


            $scope.getMemberTypeData = function (item) {
                $scope.memberTypeDatas.dicKey = item.dicKey;
                /*视图中绑定的，为了和后台接口字段一致，分2个接口处理；一个叫：dicKey另一个叫vipCard*/
                $scope.data.vipCard = item.dicKey;

            };

        }
    });


    //*************************数据定义end***********************************
    //*************************分割线结束***********************************
    $rootScope.query = function () {
        var params = {
            "page": parseInt($scope.PageIndex) - 1,
            "count": parseInt($scope.PageSize),
            "cityId": $scope.data.cityId,
            "phone": $scope.data.phone,
            "vipCard": $scope.data.vipCard,
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
 * @Author: haoxb
 * @Date:   2017-6-7 9:01:54
 * @Last Modified by:   高帆
 * @Last Modified time: 2017-06-31 17:24:03
 */
//场地方提现记录
'use strict';

App.controller('withdrawDepositController', ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

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




    $rootScope.query = function () {
        $scope.withDrawRecordListPromise = $http({
            url: $rootScope.api.withDrawRecordList,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "page": parseInt($scope.PageIndex) - 1,
                "count": parseInt($scope.PageSize),
                "userid": "04f1cb1fa03a11e7b9def48e38c3c5b0",

            }
        }).then(function (res) {
            if (res.data.code == 2000) {
                $scope.withDrawRecordListData = res.data.data;
                $scope.withDrawRecordListDataCount = res.data.page_info.total;

                $scope.toPageNum = $scope.PageIndex;
            } else {
                toastr.error(res.msg, "获取列表失败");
            }
        });
    };
    $scope.query();



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
            if (res.data.username) {
                msgBus.emitMsg("login");

                $state.go('dashboard');
            } else {
                $scope.error = data.msg || "超时";
            }
        });
    };


}]);
