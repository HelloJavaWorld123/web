'use strict';

/*
 * @Author: 唐文雍
 * @Date:   2016-04-15 14:28:07
 * @Last Modified by:   郝晓波
 * @Last Modified time: 2017-05-10 17:24:03
 */

var App, modules;
modules = ['ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ui.router', 'ngSanitize', 'ui.bootstrap',
    'ngTouch', 'ngProgress', 'ui.select', 'checklist-model', "ajoslin.promise-tracker", 'angularPromiseButtons', 'AdminFilters',
    'AdminService', "ui.bootstrap", "cgBusy", 'ngStorage', 'angular-confirm', 'toastr', 'ngTagsInput', 'naif.base64',
    'ngUpload', 'ui.tree', 'angularMoment', 'ui.bootstrap.datetimepicker', 'ui.calendar', 'xeditable'
];
App = angular.module('HealthAdminFrontend', modules);

//路由配置
App.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/User/Login');
    $stateProvider.state('dashboard', {
        url: '/',
        templateUrl: 'app/views/main.html',
        controller: function ($rootScope) {
            $rootScope.title = "";
        }
    })
    //登录
        .state('login', {
            url: '/User/Login',
            templateUrl: 'app/views/User/Login.html',
            controller: function ($rootScope) {
                $rootScope.title = "";
            }
        })

        //***************************设备管理*********************************
        //场馆配置
        .state('gymConfig', {
            url: '/Saas/gymConfig',
            templateUrl: 'app/views/Saas/gymConfig.html',
            controller: function ($rootScope) {
            }
        })
        //从场馆进-设备
        .state('devConfig', {
            url: '/Saas/devConfig?gymId&page',
            templateUrl: 'app/views/Saas/devConfig.html',
            controller: function ($rootScope) {
            }
        })
        //用户信息
        .state('userInfo', {
            url: '/Saas/userInfo',
            templateUrl: 'app/views/Saas/userInfo.html',
            controller: function ($rootScope) {
            }
        })
        //从用户信息列表进-详情
        .state('userDetail', {
            url: '/Saas/userDetail?id',
            templateUrl: 'app/views/Saas/userDetail.html',
            controller: function ($rootScope) {
            }
        })
        //从用户信息详情进-体测报告1-同方
        .state('userBodyReport01', {
            url: '/Saas/userBodyReport01?mallId',
            templateUrl: 'app/views/Saas/userBodyReport01.html',
            controller: function ($rootScope) {
            }
        })
        //从用户信息详情进-体测报告2-东华原
        .state('userBodyReport02', {
            url: '/Saas/userBodyReport02?bodyReportId',
            templateUrl: 'app/views/Saas/userBodyReport02.html',
            controller: function ($rootScope) {
            }
        })
        //从用户信息详情进-运动方案
        .state('sportProgram', {
            url: '/Saas/sportProgram?sportProgramId',
            templateUrl: 'app/views/Saas/sportProgram.html',
            controller: function ($rootScope) {
            }
        })

        //场馆软件升级管理
        .state('gymUpgrade', {
            url: '/Saas/gymUpgrade',
            templateUrl: 'app/views/Saas/gymUpgrade.html',
            controller: function ($rootScope) {
            }
        })
        //从场馆管理进-详情
        .state('checkApk', {
            url: '/Saas/checkApk?id',
            templateUrl: 'app/views/Saas/checkApk.html',
            controller: function ($rootScope) {
            }
        })
}]);

//promise 按钮
App.config(['angularPromiseButtonsProvider', function (angularPromiseButtonsProvider) {
    angularPromiseButtonsProvider.extendConfig({
        spinnerTpl: '<i class="fa fa-spinner" aria-hidden="true"></i>',
        disableBtn: true,
        btnLoadingClass: 'is-loading',
        addClassToCurrentBtnOnly: false,
        disableCurrentBtnOnly: false
    });
}]);

//toast 对话框
App.config(['toastrConfig', function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        timeOut: 3000,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
}]);

// http拦截器
App.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);
}]);

//监控路由变化
App.run(['$state', '$rootScope', 'AuthService', function ($state, $rootScope, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.previousState = fromState;
        $rootScope.previousParams = fromParams;
        //判断是否是不包括头部和侧栏的页面
        $rootScope.isOwnPage = _.contains(["login"], toState.name);
        //路由拦截，无权限则跳转到登录界面
        var nextRoute = toState.name;
        //console.log(nextRoute)
        if (!AuthService.isAuthorized(nextRoute) && !$rootScope.isOwnPage && toState.name != "dashboard") {
            event.preventDefault(); //阻止页面跳转\
            $state.go('login');
        }
    });
}]);

App.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

//设置xeditable主题
App.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});

