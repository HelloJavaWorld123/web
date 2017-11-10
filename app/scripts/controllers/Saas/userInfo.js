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
	console.log($scope.userInfoListDataCount, "totalCount:=====");
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
            "endTime": $rootScope.tools.dateToTimeStamp13Bit($scope.data.endTime),
            "realType": 0,
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
