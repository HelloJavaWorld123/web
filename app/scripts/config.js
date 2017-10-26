/*
 * @Author: 唐文雍
 * @Date:   2016-04-27 18:27:43
 * @Last Modified by:   Marte
 * @Last Modified time: 2017-01-22 16:40:39
 * 站点常量配置
 */

'use strict';

App.run(['$rootScope', 'Session', function ($rootScope, Session) {
    //分页配置
    $rootScope.PAGINATION_CONFIG = {
        PAGEINDEX: "1", //默认当前页数
        PAGESIZE: "20", //每页显示多少条
        MAXSIZE: "10" //最多显示的分页按钮数
    };
    //正则验证
    $rootScope.PATTERN_CONFIG = {
        //手机号
        PHONE: /^1\d{10}$/,
        //身份证号
        IDCARD: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i,
        //手机号码和固话
        //      TEL: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[34578]\d{9})$)/,
        TEL: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1\d{10})$)/,
        //正整数
        INT: /^[1-9][0-9]*$/,
        //数字、字母、下划线
        numAndCha: /^\w+$/,
        //两位小数的正实数
        TwoBitFloatNum: /^[0-9]+(.[0-9]{2})?$/,
    };

    //服务器地址
    //$rootScope.BASEURL = "http://betamanagelife2.healthmall.cn/";
    //$rootScope.BASEURL = "http://10.0.2.47:8082/";旧
    //$rootScope.BASEURL = "http://192.168.60.80:8003";新
    //$rootScope.BASEURL = "http://managelife.healthmall.cn/";
    $rootScope.BASEURL = "";
    // api地址
    $rootScope.api = {
        //登陆接口--47环境
        // login: $rootScope.BASEURL + "api/login",


        //测试的登录-本地json
        // login: "app/scripts/loginTest.json",

        //小象运动登录
        login: $rootScope.BASEURL + "sail/permission/login",
        logout: $rootScope.BASEURL + "sail/permission/logout",

        //获取省市区
        getArea: $rootScope.BASEURL + "api/region/getregion/",
        //获取生活馆

        getLifeHouse: $rootScope.BASEURL + "api/manage/lifehouse/getmylifehouse",
        //获取数据字典
        getDicItem: $rootScope.BASEURL + "api/manage/dic/getDicItem",
        //目前用到的代替省份

        //生活馆相关
        getLifehouseList: $rootScope.BASEURL + "api/manage/lifehouse/list",
        loadById: $rootScope.BASEURL + "api/manage/lifehouse/loadById",
        //生活馆增加
        addLifeHouse: $rootScope.BASEURL + "api/manage/lifehouse/add",
        //获取菜单相关
        getSideNav: $rootScope.BASEURL + "api/menu/myMenu",


        //场馆-sail
        getGymList: $rootScope.BASEURL + "api/devMgmt/gym/getlist",
        addGym: $rootScope.BASEURL + "api/devMgmt/gym/add",
        delGym: $rootScope.BASEURL + "api/devMgmt/gym/del",
        EditGym: $rootScope.BASEURL + "api/devMgmt/gym/alter",
        getGymById: $rootScope.BASEURL + "api/devMgmt/gym/getid",
        GymEportExcel: $rootScope.BASEURL + "api/devMgmt/gym/exportExcel",



        //场馆-iot
        getGymIotList: $rootScope.BASEURL + "api/mgmt/lifeGym/getlist",
        addGymIot: $rootScope.BASEURL + "api/mgmt/lifeGym/add",
        delGymIot: $rootScope.BASEURL + "api/mgmt/lifeGym/del",
        EditGymIot: $rootScope.BASEURL + "api/mgmt/lifeGym/alter",
        getGymIotById: $rootScope.BASEURL + "api/mgmt/lifeGym/getid",
        GymIotEportExcel: $rootScope.BASEURL + "api/mgmt/lifeGym/exportExcel",

        //场馆角色+分成
        GymPecentRole: $rootScope.BASEURL + "api/gym/gymRole/listDefaultGymRole",
        GymPecentBody: $rootScope.BASEURL + "api/subject/getSubjectNameList",
        //test-get方式访问本地json

        role: "test/02-getGymByIdAPI.json",


        // 设备
        getDevList: $rootScope.BASEURL + "api/devMgmt/device/getAllByPage",
        addDev: $rootScope.BASEURL + "api/devMgmt/device/add",
        delDev: $rootScope.BASEURL + "api/devMgmt/device/del",
        EditDev: $rootScope.BASEURL + "api/devMgmt/device/alter",
        getDevById: $rootScope.BASEURL + "api/devMgmt/device/getById",
        switchDevStatus: $rootScope.BASEURL + "api/devMgmt/device/alterOnlineStatus",
        getDevSharingById: $rootScope.BASEURL + "api/devMgmt/device/listSharingByDeviceId",

        //所有设备-与场馆无关
        getDevUnboundList: $rootScope.BASEURL + "api/deviceLock/findAll",
        //锁定与解绑
        getDevUnbound: $rootScope.BASEURL + "api/deviceLock/unbound",

        //用户信息
        getUserList: $rootScope.BASEURL + "api/memberMgmt/member/list",
        UserListEportExcel: $rootScope.BASEURL + "api/memberMgmt/member/exportExcel",

        /*用户详情begin*/
        //基本信息
        getUserDetail01: $rootScope.BASEURL + "api/memberMgmt/member/getDetailById",
        //检测报告
        getUserDetail02: $rootScope.BASEURL + "api/sailMgmt/bodyReportView/getListByMemId",
        //跑步方案
        getUserDetail03: $rootScope.BASEURL + "api/memberMgmt/member/getMemberScheme",
        //充值记录
        getUserDetail04: $rootScope.BASEURL + "api/memberMgmt/wallet/getAccountCharge",
        //活动记录
        getUserDetail05: $rootScope.BASEURL + "api/sailMgmt/sportRecord/getlist",
        /*用户详情end*/

        //体测报告-东华原
        getUserBodyReport: $rootScope.BASEURL + "api/sailMgmt/bodyReportView/getid",

        // 运动方案
        getSportProgram: $rootScope.BASEURL + "api/sailMgmt/motionScheme/schemeList",
        delSportProgram: $rootScope.BASEURL + "api/sailMgmt/motionScheme/deleteScheme",
        getSportProgramById: $rootScope.BASEURL + "api/sailMgmt/motionScheme/getById",
        EditSportProgram: $rootScope.BASEURL + "api/sailMgmt/motionScheme/editScheme",

        addSportProgram: $rootScope.BASEURL + "api/sailMgmt/motionScheme/addScheme",
        SportProgramEportExcel: $rootScope.BASEURL + "api/sailMgmt/motionScheme/exportExcel",


        // 订单
        getOrderInfo: $rootScope.BASEURL + "api/report/orderInfo",
        OrderInfoEportExcel: $rootScope.BASEURL + "api/report/exportExcel",

        // 充值
        getAccountCharge: $rootScope.BASEURL + "api/memberMgmt/wallet/getAccountChargeByPage",
        AccountChargeEportExcel: $rootScope.BASEURL + "api/memberMgmt/wallet/exportExcel",

        //预约
        getMakeOrder: $rootScope.BASEURL + "api/mgmt/bespeak/getList",
        getMakeOrderEportExcel: $rootScope.BASEURL + "api/mgmt/bespeak/exportExcel",

        //报障
        getReportFaultList: $rootScope.BASEURL + "api/devMgmt/malfunction/getAllByPage",
        changeProgress: $rootScope.BASEURL + "api/devMgmt/malfunction/alterProcess",
        reportFaultExportExcel: $rootScope.BASEURL + "api/devMgmt/malfunction/exportExcel",

        //押金
        cashPledgeOrder: $rootScope.BASEURL + "api/memberMgmt/wallet/getDepositChargeByPage",
        cashPledgeSetting: $rootScope.BASEURL + "api/memberMgmt/wallet/getCityToDeposit",
        cashPledgeRefund: $rootScope.BASEURL + "api/memberMgmt/wallet/getDepositRefundByPage",


        cashPledgeSwitch: $rootScope.BASEURL + "api/memberMgmt/wallet/alterDepositStatus",
        getDepositAmount: $rootScope.BASEURL + "api/memberMgmt/wallet/getDepositAmount",
        alterDepositAmount: $rootScope.BASEURL + "api/memberMgmt/wallet/alterDepositAmount",
        decideToRefund: $rootScope.BASEURL + "api/memberMgmt/wallet/decideToRefund",
        reflushRufundStatus: $rootScope.BASEURL + "api/memberMgmt/wallet/reflushRufundStatus",
        cashPledgeListExport: $rootScope.BASEURL + "api/memberMgmt/wallet/exportDepositCharge",
        cashPledgeExport: $rootScope.BASEURL + "api/memberMgmt/wallet/dataExport",


        //会员卡
        getvipinfos: $rootScope.BASEURL + "api/vipinfo/getVipList",
        getDicList: $rootScope.BASEURL + "api/common/getDicList",
        getList: $rootScope.BASEURL + "api/cardtype/getList",
        addMember: $rootScope.BASEURL + "api/cardtype/add",
        getbyId: $rootScope.BASEURL + "api/cardtype/getbyId",
        alter: $rootScope.BASEURL + "api/cardtype/alter",
        del: $rootScope.BASEURL + "api/cardtype/del",
        multiFileUpload: $rootScope.BASEURL + "api/upload/multiFileUpload",
        memberCardFirstEportExcel: $rootScope.BASEURL + "api/vipinfo/exportExcel",


        //活动
        activityList: $rootScope.BASEURL + "api/devMgmt/activity/getlist",
        activityDel: $rootScope.BASEURL + "api/devMgmt/activity/del",
        activityAdd: $rootScope.BASEURL + "api/devMgmt/activity/add",
        activityGetid: $rootScope.BASEURL + "api/devMgmt/activity/getid",
        update: $rootScope.BASEURL + "api/devMgmt/activity/update",


        //设备费用管理
        devCostList: $rootScope.BASEURL + "api/devMgmt/devicePrice/getlist",
        devCostDel: $rootScope.BASEURL + "api/devMgmt/devicePrice/del",
        devCostGetid: $rootScope.BASEURL + "api/devMgmt/devicePrice/getid",
        devCostUpdate: $rootScope.BASEURL + "api/devMgmt/devicePrice/update",
        updateUse: $rootScope.BASEURL + "api/devMgmt/devicePrice/updateUse",
        devCostAdd: $rootScope.BASEURL + "api/devMgmt/devicePrice/add",
        devCostExportExcel: $rootScope.BASEURL + "api/devMgmt/devicePrice/exportExcel",


        //跑步机管理员管理
        treadmillAdminList: $rootScope.BASEURL + "api/devMgmt/deviceManager/findAll",
        treadmillAdminDel: $rootScope.BASEURL + "api/devMgmt/deviceManager/del",
        treadmillAdminAdd: $rootScope.BASEURL + "api/devMgmt/deviceManager/add",
        treadmillAdminGetid: $rootScope.BASEURL + "api/devMgmt/deviceManager/getid",
        treadmillAdminUpdate: $rootScope.BASEURL + "api/devMgmt/deviceManager/update",


        //跑步机开关机管理
        treadmillSwitchList: $rootScope.BASEURL + "api/powerontime/getlist",
        upushPowerOnTime: $rootScope.BASEURL + "api/powerontime/upushPowerOnTime",
        treadmillSwitchAdd: $rootScope.BASEURL + "api/powerontime/add",
        treadmillSwitchDel: $rootScope.BASEURL + "api/powerontime/del",
        treadmillSwitchGetbyid: $rootScope.BASEURL + "api/powerontime/getbyid",
        treadmillSwitchAlter: $rootScope.BASEURL + "api/powerontime/alter",


        //软件升级管理
        gymUpgradeList: $rootScope.BASEURL + "api/devMgmt/apkUploadManage/getlist",
        gymUpgradeDel: $rootScope.BASEURL + "api/devMgmt/apkUploadManage/del",
        gymUpgradeAdd: $rootScope.BASEURL + "api/devMgmt/apkUploadManage/add",
        gymUpgradeGetid: $rootScope.BASEURL + "api/devMgmt/apkUploadManage/getid",
        gymUpgradeUpdate: $rootScope.BASEURL + "api/devMgmt/apkUploadManage/update",
        findApkPushState: $rootScope.BASEURL + "api/devMgmt/apkUploadManage/findApkPushState",
        pushApk: $rootScope.BASEURL + "api/devMgmt/apkUploadManage/pushApk",
        fileUpload: $rootScope.BASEURL + "api/upload/fileUpload",


        //卡券
        sendDiscount: $rootScope.BASEURL + "api/mgmt/reward/getList",
        sendDiscountEportExcel: $rootScope.BASEURL + "api/mgmt/reward/exportExcel",

        //充值金额设置
        chargeList: $rootScope.BASEURL + "api/chargeAmount/getList",
        chargeDel: $rootScope.BASEURL + "api/chargeAmount/del",
        chargeAdd: $rootScope.BASEURL + "api/chargeAmount/add",
        chargeGetid: $rootScope.BASEURL + "api/chargeAmount/getbyId",
        chargeUpdate: $rootScope.BASEURL + "api/chargeAmount/alter",


        //排行榜
        findRank: $rootScope.BASEURL + "api/memberMgmt/ranking/findRankDistanceByType",

        rankListExportExcel: $rootScope.BASEURL + "api/memberMgmt/ranking/exportExcel",


        //对公账户审核
        accountList: $rootScope.BASEURL + "api/devMgmt/accountAuditRecord/list",
        updatePayStatus: $rootScope.BASEURL + "api/devMgmt/accountAuditRecord/updatePayStatus",
        accountExcelList: $rootScope.BASEURL + "api/devMgmt/accountAuditRecord/exportExcel",



        //主体分成设置
        shareholderList: $rootScope.BASEURL + "api/subject/list",
        shareholderAdd: $rootScope.BASEURL + "api/subject/insert",
        shareholderDel: $rootScope.BASEURL + "api/subject/delete",
        shareholderId: $rootScope.BASEURL + "api/subject/id",
        shareholderUpdate: $rootScope.BASEURL + "api/subject/update",
        shareholderExport: $rootScope.BASEURL + "api/subject/export",


        //分成方后台收入明细
        mainIncomeList: $rootScope.BASEURL + "api/devMgmt/income/list",
        mainIncomeExcel: $rootScope.BASEURL + "api/devMgmt/income/exportExcel",
        getDicGymList: $rootScope.BASEURL + "api/deposit/gym/info",
        getIncomeList:$rootScope.BASEURL+"api/devMgmt/income/list",
        getIncomeGymList:$rootScope.BASEURL+"api/devMgmt/income/gym/list",
        IncomeListEportExcel:$rootScope.BASEURL+"api/devMgmt/income/exportExcel",
        getMoneyList:$rootScope.BASEURL+"api/devMgmt/withDrawRecord/user/list",
        //账户
        getBankInfo:$rootScope.BASEURL+"api/deposit/gym/bank",
        getGymInfo:$rootScope.BASEURL+"api/deposit/gym/info",
        //提现-btn
        drawmoney:$rootScope.BASEURL+"/api/deposit/gym/drawmoney",
        //公司账户校验
        companyVerify:$rootScope.BASEURL+"api/deposit/gym/bank/status",
        //个人账户校验
        personVerify:$rootScope.BASEURL+"api/deposit/gym/verify/self/accountmoney",
        //场馆方公司账户汇款金额校验
        gymVerifyAccountMoney:$rootScope.BASEURL+"api/deposit/gym/verify/company/accountmoney",

        //分成方后台提现记录
        withDrawRecordList: $rootScope.BASEURL + "api/devMgmt/withDrawRecord/user/list",



        //场地方提现审核
        depositAuditingList: $rootScope.BASEURL + "api/devMgmt/withDrawRecord/list",
        depositAuditingStatus: $rootScope.BASEURL + "api/devMgmt/withDrawRecord/updateAuditStatus",
        depositAuditingExcel: $rootScope.BASEURL + "api/devMgmt/withDrawRecord/exportExcel",

        //订单分成管理
        incomeManageList: $rootScope.BASEURL + "api/devMgmt/income/order/share",
        incomeManageExcel: $rootScope.BASEURL + "api/devMgmt/income/order/share/exportExcel",

        //分成统计
        shareCountList: $rootScope.BASEURL + "api/devMgmt/income/statistics/list",
        shareCountExcel: $rootScope.BASEURL + "api/devMgmt/income/exportExcel",
        shareCountAmount: $rootScope.BASEURL + "api/devMgmt/income/statistics/totalAmount",





    };
}]);
//全局工具类
App.run(function ($rootScope) {
    $rootScope.tools = {
        //时间戳转换成日期
        timeStampToDate: function (tm, str) {
            var tmdate, sym;
            var sym = (str == undefined ? "-" : str);

            function autoFull(str) {
                if (str < 10) {
                    return 0 + str.toString();
                } else {
                    return str;
                }
            }

            if (tm) {
                tm = Number(tm);
                tm = tm * (Math.pow(10, (13 - tm.toString().length)));
                var date = new Date(tm);
                var month = autoFull((date.getMonth() + 1));
                var day = autoFull(date.getDate());
                var hour = autoFull(date.getHours());
                var minute = autoFull(date.getMinutes());
                var second = autoFull(date.getSeconds());
                tmdate = date.getFullYear() + sym + month + sym + day + " " + hour + ":" + minute + ":" + second;
            } else {
                return undefined;
            }
            return tmdate;
        },
        //获取当前日期的年、月、日
        dateToYearAndMonth: function (tm) {
            var tmDate = new Date(tm);
            var needTime = {
                "year": tmDate.getFullYear(),
                "month": tmDate.getMonth() + 1,
                "day": tmDate.getDate(),
            }
            return needTime;
        },
        //日期转换时间戳(10bit-s)
        dateToTimeStamp: function (date) {
            if (date != undefined) {
                var tm = Date.parse(new Date(date)) / 1000;
            } else {
                return;
            }
            return tm;
        },
        //日期转换时间戳(13bit-ms)
        dateToTimeStamp13Bit: function (date) {
            if (date != undefined) {
                var tm = Date.parse(new Date(date));
            } else {
                return;
            }
            return tm;
        },
        //图片压缩    不拼接字符串
        imgCompress: function (str) {
            if (str) {
                var arr = str.split(".");

                var imgUrl = arr.join(".");
                return imgUrl;
            } else {
                return;
            }

        },
        //计算某月有多少周，每周的起始日期
        DateInfo: function (tmDate, rankWeek, rankWeekday) {
            var tm = new Date(tmDate);
            var oldDate = new Date(tm);
            var month = oldDate.getMonth() + 1;
            var year = oldDate.getFullYear();
            var newDate = year + "/" + month + "/01";
            //当前月的第一天是周几
            var weektime = new Date(newDate).getDay() == 0 ? 7 : new Date(newDate).getDay();
            //当前月一共多少天
            var newDays = getDays(newDate);
            //当前月一共多少周
            var weeks = null;
            if (weektime == 1) {
                weeks = newDays % 7 == 0 ? parseInt(newDays / 7) : parseInt(newDays / 7) + 1;
            } else if (weektime == 7) {
                weeks = (newDays - 1) % 7 == 0 ? parseInt((newDays - 1) / 7) + 1 : parseInt((newDays - 1) / 7) + 2;
            } else {
                weeks = (newDays - 7 + weektime) % 7 == 0 ? parseInt((newDays - 7 + weektime) / 7) + 1 : parseInt((newDays - 7 + weektime) / 7) + 2;
            }
            //当前日期是本月多少周
            var w = tm.getDay();
            var d = tm.getDate();
            var rankweeks = Math.ceil((d + 6 - w) / 7);
            //计算每周开始和结束的时间
            var weekDays = [];
            for (var i = 1; i <= weeks; i++) {
                var startTime = null;
                var endTime = null;
                if (weektime == 1) {
                    startTime = 7 * (i - 1) + 1 > newDays ? newDays : 7 * (i - 1) + 1;
                    endTime = 7 * i + 1 > newDays ? newDays : 7 * i + 1;
                    var timeObj = {
                        "startTime": startTime,
                        "endTime": endTime
                    }
                    weekDays.push(timeObj);
                } else {
                    if (i == 1) {
                        startTime = 1;
                        endTime = 8 - weektime;
                    } else {
                        startTime = 7 * (i - 2) + (8 - weektime + 1) > newDays ? newDays : 7 * (i - 2) + (8 - weektime + 1);
                        endTime = 7 * (i - 1) + (8 - weektime) > newDays ? newDays : 7 * (i - 1) + (8 - weektime);
                    }
                    var timeObj = {
                        "startTime": startTime,
                        "endTime": endTime
                    }
                    weekDays.push(timeObj);
                }
            }
            var howManyDay;
            if (rankWeekday) {
                for (var i = 0; i < weekDays.length; i++) {
                    //获取这一天是星期几 星期天转换为7
                    var newRankWeekday = new Date(year + "-" + month + "-" + weekDays[i].startTime).getDay();
                    newRankWeekday = newRankWeekday == 0 ? 7 : newRankWeekday;
                    if (i == rankWeek - 1 && i == 0) {
                        if (newRankWeekday > rankWeekday) {
                            alert("您输入的日期在当月当周不存在");
                        } else {
                            if (rankWeekday > 0 && rankWeekday < 8) {

                                if (newRankWeekday == rankWeekday) {
                                    howManyDay = weekDays[i].startTime
                                } else {
                                    howManyDay = weekDays[i].startTime + rankWeekday - newRankWeekday;
                                }
                                //alert("第" + rankWeek + "周，周" + rankWeekday + "是" + month + "月" + howManyDay + "号");
                            } else {
                                alert("您输入的日期不正确");
                            }
                        }
                    } else if (i == rankWeek - 1) {
                        if (rankWeekday > 0 && rankWeekday < 8) {
                            if (newRankWeekday == rankWeekday) {
                                howManyDay = weekDays[i].startTime
                            } else {
                                howManyDay = weekDays[i].startTime + rankWeekday - 1;
                            }
                            //alert("第" + rankWeek + "周，周" + rankWeekday + "是" + month + "月" + howManyDay + "号");
                        } else {
                            alert("您输入的日期不正确");
                        }

                    }
                }
            }
            //计算当前月份有多少天
            function getDays(t) {
                //构造当前日期对象
                var date = new Date(t);
                //获取年份
                var year = date.getFullYear();
                //获取当前月份
                var mouth = date.getMonth() + 1;
                //定义当月的天数；
                var days;
                //当月份为二月时，根据闰年还是非闰年判断天数
                if (mouth == 2) {
                    days = year % 4 == 0 ? 29 : 28;
                } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
                    //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
                    days = 31;
                } else {
                    //其他月份，天数为：30.
                    days = 30;
                }
                //输出天数
                return days;
            }

            var DateInfoList = {
                //几号
                "howManyDay": howManyDay,
                //那一年
                "year": year,
                //几月
                "month": month,
                //每周时间起始点
                "weekDays": weekDays,
                //当月一共多少天
                "newDays": newDays,
                //有多少周
                "weeks": weeks,
                //当前日期是本月多少周
                "rankweeks": rankweeks
            }
            return DateInfoList;
        }
    };
});

//是否debug模式
App.run(function ($rootScope) {
    $rootScope.isDebug = function (status) {
        if (status) {
            return;
        }
        ;
        console.log = function () {
        };
    };
    $rootScope.isDebug($rootScope.isDebug);
});