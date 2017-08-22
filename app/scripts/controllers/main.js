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
