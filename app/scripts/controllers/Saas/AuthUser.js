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
App.controller("AuthUserController", ['$scope', '$state', '$rootScope', '$http', '$uibModal', 'restful', 'ngProgressFactory', 'lifeHouseAreaSelector', 'toastr', function ($scope, $state, $rootScope, $http, $uibModal, restful, ngProgressFactory, lifeHouseAreaSelector, toastr) {

	$scope.data = {};


	$scope.userNameStatus = [
		{
			id: 1,
			name: "停用"
		},
		{
			id: 2,
			name: "正常"
		}
	];

	$scope.getUserNameStatus = function (item){
		item = {};
		$scope.userNameStatus.id = item.id ;
	};

	//分页信息
	$scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
	$scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
	$scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE;

	//重置函数
	$scope.reset = function(){
		$scope.data = {};
		$scope.query();
	};


	$scope.getUserNameStatus = function(item){

	};

	//设置每页显示的条数
	$scope.PageChange = function () {
		//每次设置完成 显示的条数 都要去调用接口 查询一遍
		$scope.query();
	};


	//设置跳转的页数
	$scope.setPage = function (){
		$scope.PageIndex = $scope.toPageNum > Math.ceil($scope.userDetailCount / $scope.PageSize ) ? Math.ceil($scope.userDatailCount / $scope.PageSize ) : $scope.toPageNum;
		$scope.query();
	};


	//定义一个query的查询 用于调用后台的接口 进行查询
	$scope.query = function (){
		var params = {
			"page": parseInt($scope.PageIndex)-1,
			"count": parseInt($scope.PageSize),
			"username": $scope.data.username,
			"name": $scope.data.name,
			"mobile": $scope.data.mobile,
			"status": $scope.data.status,
		};
		$scope.authUserListPromise = $http({
			url: $rootScope.api.authUserList,
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			data: params,
		}).then(function (res){
			$scope.authUserListData = res.data.data;
			$scope.totalCount = res.data.page_info.total;
			$scope.toPageNum = $scope.PageIndex ;
		});
	};
	$scope.query();

	//编辑按钮
	$scope.eaditUserMsg = function(data){
		var item ;
		var modelInstance = $uibModal.open({
			templateUrl: 'authUserEdit.html',
			controller: 'AuthUserEditController',
			size: 'md',
			resolve: {
				item: function(){
					return data;
				}
			},
		});
		modelInstance.result.then(function () {
				$scope.query();
			}, function () {
				$scope.query();
			})
	};

	/*新增按钮 跳转页面*/
	$scope.addUser = function(data){

		var item ;
		var modelInstance = $uibModal.open({
			templateUrl: 'authUserAdd.html',
			controler: 'authUserAddController',
			size: 'md',
			resolve: {
				item: function(){
					return data;
				}
			},
		});
		modelInstance.result.then(function(){
			$scope.query();
		},function(){
			$scope.query();
		})
	};
}]);

/*
-----------------------
用户编辑弹窗
------------------------
*/
App.controller('AuthUserEditController',['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector', 'item',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector,item){
	$scope.data = {};

	//根据Id查询关于用户的详细信息
	var params = {
		id: item.id
	};

	/*获取用户详情*/
	restful.fetch(
		$rootScope.api.authUserInfo,"POST",params
	).then(
		function(res){
			if(res.code == 2000){
				for(var key in res.data){
					$scope.data[key] = res.data[key];
				}

			}else{
				toastr.error(res.msg);
			}

		},function(rej){
			console.info(rej);
		});

	//取消按钮
	$scope.close = function (){
		$uibModalInstance.dismiss('close');
	};

}]);


/*
----------------------------------
新增窗口
----------------------------------
*/

App.controller('authUserAddController',['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', 'AllAreaSelector', '$uibModal', 'toastr', 'CommonData', 'lifeHouseAreaSelector',function ($scope, $uibModalInstance, restful, $state, $rootScope, AllAreaSelector, $uibModal, toastr, CommonData, lifeHouseAreaSelector){

	$scope.data = {};

	/*保存按钮*/
	$scope.save = function (){
		var params = {
			"name": $scope.data.name,
			"roleNameStr": $scope.data.roleNameStr,
			"roleIds": $scope.data.roleIds,
			"username": $scope.data.username,
			"password": $scope.data.password,
			"mobile": $scope.data.mobile,
		}
		restful.fetch(
			$rootScope.api.authUserAdd,"POST",params
		).then(function(res){
			if(res.code == 2000){
				toastr.success("添加成功");
				$scope.query();
				$uibModalInstance.dismiss('close');
			}else{
				toastr.error(res.msg);
			}
		}, function (rej) {
			console.info(rej);
		});
	};
	//取消按钮
	$scope.close = function () {
		$uibModalInstance.dismiss('close');
	};


	$scope.getRoles = function(data){
		var data = {};

		$scope.RoleListPromise = $http({
			url: $rootScope.api.authRoleList,
			method: "post",
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function(res){
			if(res.data.code == 2000 ){
				$scope.roleList = res.data.data;
			}else{
				toastr.error(res.msg,"获取角色列表失败");
			}
		});
	};







}]);




