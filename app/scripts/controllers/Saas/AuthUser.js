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


	$scope.userStatus = [
		{
			id: 1,
			name: "停用"
		},
		{
			id: 2,
			name: "正常"
		}
	];

	$scope.getUserStatus = function (item) {
		item = {};
		$scope.userStatus.id = item.id;
	};

	//分页信息
	$scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
	$scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
	$scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE;

	//重置函数
	$scope.reset = function () {
		$scope.data = {};
		$scope.query();
	};

	$scope.getUserNameStatus = function (item) {

	};

	//设置每页显示的条数
	$scope.pageChanged = function () {
		//每次设置完成 显示的条数 都要去调用接口 查询一遍
		$scope.query();
	};


	//设置跳转的页数
	$scope.setPage = function () {
		$scope.PageIndex = $scope.toPageNum > Math.ceil($scope.userDetailCount / $scope.PageSize) ? Math.ceil($scope.userDatailCount / $scope.PageSize) : $scope.toPageNum;
		$scope.query();
	};


	/*改变用户账号的状态  1 停用 2 正常 */
	$scope.switchUserStatus = function (item) {
		var param = {
			id: item.id,
			status: item.status == 1 ? item.status = 2 : 1
		};

		restful.fetch(
			$rootScope.api.authUserStatus, "POST", param
		).then(function (res) {
			if (res.code == 2000) {
				toastr.success("账号切换状态成功", res.msg);
				$scope.query();
			} else {
				toastr.error("切换状态失败", res.msg);
			}
		}, function (rej) {
			toastr.error("切换状态失败", rej.msg);
		});
	};

	//定义一个query的查询 用于调用后台的接口 进行查询
	$scope.query = function () {
		var params = {
			"page": parseInt($scope.PageIndex) - 1,
			"count": parseInt($scope.PageSize),
			"username": $scope.data.username,
			"name": $scope.data.name,
			"mobile": $scope.data.mobile,
			"status": $scope.data.status
		};
		$scope.authUserListPromise = $http({
			url: $rootScope.api.authUserList,
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			data: params
		}).then(function (res) {
			$scope.authUserListData = res.data.data;
			$scope.totalCount = res.data.page_info.total;
			$scope.toPageNum = $scope.PageIndex;
		});
	};
	$scope.query();

	//编辑按钮
	$scope.authUserEdit = function (data) {
		var item;
		var modalInstance = $uibModal.open({
			templateUrl: 'authUserViewEdit.html',
			controller: 'AuthUserEditController',
			size: 'md',
			resolve: {
				item: function () {
					return data;
				}
			}
		});
		modalInstance.result.then(function () {
			$scope.query();
		}, function () {
			$scope.query();
		})
	};

	/*新增按钮 跳转页面*/
	$scope.addAuthUser = function (data) {
		var item;
		var modalInstance = $uibModal.open({
			templateUrl: 'authUserViewAdd.html',
			controller: 'authUserAddController',
			size: 'md',
			resolve: {
				item: function () {
					return data;
				}
			}
		})
		modalInstance.result.then(function () {
			//close
			$scope.query();
		}, function () {
			//dismissed
			$scope.query();
		})
	}
}]);

/*
 -----------------------
 用户编辑弹窗
 ------------------------
 */
App.controller('AuthUserEditController', ['$scope', '$uibModalInstance', 'restful', '$state', '$rootScope', '$uibModal', 'toastr', 'lifeHouseAreaSelector', 'item', function ($scope, $uibModalInstance, restful, $state, $rootScope, $uibModal, toastr, lifeHouseAreaSelector, item) {
	$scope.data = {};

	//根据Id查询关于用户的详细信息
	var params = {
		id: item.id
	};

	/*获取用户详情*/
	restful.fetch(
		$rootScope.api.authUserInfo, "POST", params
	).then(
		function (res) {
			if (res.code == 2000) {
				for (var key in res.data) {
					$scope.data[key] = res.data[key];
				}
				$scope.data.roleIds == null ? null : $scope.roleIds = $scope.data.roleIds.split(",");

				$scope.data.roleNameStr == null ? null : $scope.roleNameStr = $scope.data.roleNameStr.split(",");

			} else {
				toastr.error(res.msg);
			}

		}, function (rej) {
			console.info(rej);
		});

	//取消按钮
	$scope.close = function () {
		$uibModalInstance.dismiss('close');
	};


	/*编辑保存*/
	$scope.save = function () {
		var params = {
			"id": item.id,
			"name": $scope.data.name,
			"roleNameStr": $scope.roleNameStr.join(','),
			"roleIds": $scope.roleIds.join(','),
			"username": $scope.data.username,
			"mobile": $scope.data.mobile,
		};
		console.log(params);
		restful.fetch($rootScope.api.authUserUpdate, "POST", params).then(function (res) {
			if (res.code == 2000) {
				toastr.success("更新成功");
				console.log(res);
				$uibModalInstance.dismiss('close');
			} else {
				toastr.info(res.msg);
			}
		}, function (rej) {
			console.info(rej);
		});
	};
	$scope.close = function () {
		$uibModalInstance.dismiss('close');
	};


	/*选择角色*/
	lifeHouseAreaSelector.getRoles().then(function (roles) {
		$scope.data.id = "";
		$scope.roles = roles;
	});


	$scope.roleIds = [];
	$scope.roleNameStr = [];
	$scope.chooseRole = function () {
		var isCanPush = true;
		for (var i = 0; i < $scope.roleIds.length; i++) {
			if ($scope.roleIds[i] == $scope.data.id) {
				isCanPush = false;
			}
		}
		if (isCanPush) {
			$scope.roleIds.push($scope.data.id);
			for (var j = 0; j < $scope.roles.length; j++) {
				if ($scope.roles[j].id == $scope.data.id) {
					$scope.name = $scope.roles[j].name

				}
			}
			$scope.roleNameStr.push($scope.name);
			/*console.log($scope.roleIds.join(','));
			 console.log($scope.roleNameStr.join(','));*/
		}
	}
	$scope.delRole = function (index) {
		$scope.roleIds.splice(index, 1);
		$scope.roleNameStr.splice(index, 1);
		/*console.log($scope.roleNameStr);*/
	}

}]);

/*
 ----------------------------------
 新增窗口
 ----------------------------------
 */
App.controller('authUserAddController', ['$scope', '$uibModalInstance', 'lifeHouseAreaSelector', 'restful', '$rootScope', '$uibModal', 'toastr', function ($scope, $uibModalInstance, lifeHouseAreaSelector, restful, $rootScope, $uibModal, toastr) {
	$scope.data = {};
	/*保存*/
	$scope.addUser = function () {
		var params = {
			"name": $scope.data.name,
			"password": $scope.data.password,
			"roleNameStr": $scope.roleNameStr.join(','),
			"roleIds": $scope.roleIds.join(','),
			"username": $scope.data.username,
			"mobile": $scope.data.mobile
		};

		restful.fetch($rootScope.api.authUserAdd, "POST", params).then(function (res) {
			if (res.code == 2000) {
				toastr.success("添加成功");
				console.log(res);
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


	/*选择角色*/
	lifeHouseAreaSelector.getRoles().then(function (roles) {
		$scope.data.id = "";
		$scope.roles = roles;
	});


	$scope.roleIds = [];
	$scope.roleNameStr = [];

	$scope.chooseRole = function () {
		var isCanPush = true;
		for (var i = 0; i < $scope.roleIds.length; i++) {
			if ($scope.roleIds[i] == $scope.data.id) {
				isCanPush = false;
			}
		}
		if (isCanPush) {
			$scope.roleIds.push($scope.data.id);
			for (var j = 0; j < $scope.roles.length; j++) {
				if ($scope.roles[j].id == $scope.data.id) {
					$scope.name = $scope.roles[j].name

				}
			}
			$scope.roleNameStr.push($scope.name);
			console.log($scope.roleIds.join(','));
			console.log($scope.roleNameStr.join(','));
		}
	};
	$scope.delRole = function (index) {
		$scope.roleIds.splice(index, 1);
		$scope.roleNameStr.splice(index, 1);
		console.log($scope.roleNameStr);
	}

}]);



