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