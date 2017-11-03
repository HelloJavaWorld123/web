 /*
* Created By User: RXK
* Date: 2017/10/30
* Time: 22:13
* Version: V1.0
* Description: 
*/

 'use strict'
App.controller('updatePasswordController',['$scope', '$state', '$rootScope', '$http', '$stateParams','$uibModal', 'restful','$location', 'urlService','ngProgressFactory', 'toastr', function ($scope, $state, $rootScope,$http, $uibModal, restful,$location,$stateParams, urlService,ngProgressFactory, toastr){

	var data = {};

	 var u = urlService.get();

	//忘记密码
	$scope.save = function (path){
		var params = {
			"password": $scope.data.password,
			"newPassword": $scope.data.new_password
		};
		restful.fetch(
			$rootScope.api.updatePassword,"POST",params
		).then(function(res){
			if(res.code == 2000){
				toastr.info("修改密码成功,请重新登录",res.msg);
				$location.path(path);
			}else{
				toastr.info("修改密码失败",res.msg);
			}
		});
	};
	/*取消按钮*/
	$scope.close = function(){
		$state.go(u);
	};

}]);
 