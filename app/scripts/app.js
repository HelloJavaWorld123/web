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
        //场馆配置-sail
        .state('gymConfig', {
            url: '/Saas/gymConfig',
            templateUrl: 'app/views/Saas/gymConfig.html',
            controller: function ($rootScope) {
            }
        })
        //场馆配置-iot
        .state('gymIotConfig', {
            url: '/Saas/gymIotConfig',
            templateUrl: 'app/views/Saas/gymIotConfig.html',
            controller: function ($rootScope) {
            }
        })
        //从场馆进-设备
        .state('devConfig', {
            url: '/Saas/devConfig?gymId&gymType&deviceCost',//场馆的id和类型type（0：小象-sail，1：生活馆-iot）
            templateUrl: 'app/views/Saas/devConfig.html',
            controller: function ($rootScope) {
            }
        })
        //隐匿-设备锁定与解绑
        .state('devUnbound', {
            url: '/Saas/devUnbound',
            templateUrl: 'app/views/Saas/devUnbound.html',
            controller: function ($rootScope) {
            }
        })
        //分成方
        .state('dividedConfig', {
            url: '/Saas/dividedConfig',
            templateUrl: 'app/views/Saas/dividedConfig.html',
            controller: function ($rootScope) {
            }
        })
        //收入明细
        .state('incomeList', {
            url: '/Saas/incomeList',
            templateUrl: 'app/views/Saas/incomeList.html',
            controller: function ($rootScope) {
            }
        })
        //提现明细
        .state('getMoneyList', {
            url: '/Saas/getMoneyList',
            templateUrl: 'app/views/Saas/getMoneyList.html',
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
        //订单信息
        .state('orderInfo', {
            url: '/Saas/orderInfo',
            templateUrl: 'app/views/Saas/orderInfo.html',
            controller: function ($rootScope) {
            }
        })
        //账户充值
        .state('accountCharge', {
            url: '/Saas/accountCharge',
            templateUrl: 'app/views/Saas/accountCharge.html',
            controller: function ($rootScope) {
            }
        })
        //预约
        .state('makeOrder', {
            url: '/Saas/makeOrder',
            templateUrl: 'app/views/Saas/makeOrder.html',
            controller: function ($rootScope) {
            }
        })
        //排行榜
        .state('rankList', {
            url: '/Saas/rankList',
            templateUrl: 'app/views/Saas/rankList.html',
            controller: function ($rootScope) {
            }
        })
        //充值金额设置
        .state('chargeSet', {
            url: '/Saas/chargeSet',
            templateUrl: 'app/views/Saas/chargeSet.html',
            controller: function ($rootScope) {
            }
        })
        //活动设置
        .state('activitySet', {
            url: '/Saas/activitySet',
            templateUrl: 'app/views/Saas/activitySet.html',
            controller: function ($rootScope) {
            }
        })
        //报障
        .state('reportFault', {
            url: '/Saas/reportFault',
            templateUrl: 'app/views/Saas/reportFault.html',
            controller: function ($rootScope) {
                // $rootScope.title = "报障";
            }
        })
        //投诉
        .state('complain', {
            url: '/Saas/complain',
            templateUrl: 'app/views/Saas/complain.html',
            controller: function ($rootScope) {
            }
        })
        //押金
        .state('cashPledge', {
            url: '/Saas/cashPledge',
            templateUrl: 'app/views/Saas/cashPledge.html',
            controller: function ($rootScope) {
            }
        })
        //优惠券派发
        .state('sendDiscount', {
            url: '/Saas/sendDiscount',
            templateUrl: 'app/views/Saas/sendDiscount.html',
            controller: function ($rootScope) {
            }
        })
        //会员卡
        .state('memberCard', {
            url: '/Saas/memberCard',
            templateUrl: 'app/views/Saas/memberCard.html',
            controller: function ($rootScope) {
            }
        })
        //设备费用管理
        .state('devCostManage', {
            url: '/Saas/devCostManage',
            templateUrl: 'app/views/Saas/devCostManage.html',
            controller: function ($rootScope) {
            }
        })
        //跑步机管理员管理
        .state('treadmillAdmin', {
            url: '/Saas/treadmillAdmin',
            templateUrl: 'app/views/Saas/treadmillAdmin.html',
            controller: function ($rootScope) {
            }
        })
        //跑步机开关机管理
        .state('treadmillSwitch', {
            url: '/Saas/treadmillSwitch',
            templateUrl: 'app/views/Saas/treadmillSwitch.html',
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

        //对公账户审核
        .state('accountAuditing', {
            url: '/Saas/accountAuditing',
            templateUrl: 'app/views/Saas/accountAuditing.html',
            controller: function ($rootScope) {
            }
        })

        //分成主体
        .state('shareholder', {
            url: '/Saas/shareholder',
            templateUrl: 'app/views/Saas/shareholder.html',
            controller: function ($rootScope) {
            }
        })

        //场地方收入明细
        .state('mainIncome', {
            url: '/Saas/mainIncome',
            templateUrl: 'app/views/Saas/mainIncome.html',
            controller: function ($rootScope) {
            }
        })

        //场地方提现记录
        .state('withdrawDeposit', {
            url: '/Saas/withdrawDeposit',
            templateUrl: 'app/views/Saas/withdrawDeposit.html',
            controller: function ($rootScope) {
            }
        })



        //订单分成管理
        .state('incomeManage', {
            url: '/Saas/incomeManage',
            templateUrl: 'app/views/Saas/incomeManage.html',
            controller: function ($rootScope) {
            }
        })

        //分成统计
        .state('shareCount', {
            url: '/Saas/shareCount',
            templateUrl: 'app/views/Saas/shareCount.html',
            controller: function ($rootScope) {
            }
        })

        //场地方提现审核
        .state('depositAuditing', {
            url: '/Saas/depositAuditing',
            templateUrl: 'app/views/Saas/depositAuditing.html',
            controller: function ($rootScope) {
            }
        })

        //*******************************权限管理-用户信息管理******************************************
        .state('AuthUser',{
            url: '/Saas/AuthUser',
            templateUrl: 'app/views/Saas/AuthUser.html',
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

