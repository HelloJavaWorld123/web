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