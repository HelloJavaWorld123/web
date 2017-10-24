/*
 * Created By User: RXK
 * Date: 2017/10/23
 * Time: 17:16
 * Version: V1.0
 * Description:
 */

/*
 *权限管理-用户信息模块
 */
'use strict';
App.controller("AuthUserController", ['$scope', '$state', '$rootScope', '$http', '$uibModal', function ($scope, $state, $rootScope, $http, $uibModal) {


	//分页信息
	$scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
	$scope.PageSize = $rootScope.PAGINATION_CONFIG.PageSize ;
	$scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE ;









	//发送http请求
	$scope.authUserListPromise = $http({
		url: $rootScope.api.authUserInfo,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		data: {
			//TODO
		}

	}).then(function(res){
		if(res.data.code == 2000){
			$scope.authUserListData = res.data.data;
			console.log($scope.authUserListData);
		}
	});











}]);



