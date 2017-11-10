/*
 * @Author: 唐文雍
 * @Date:   2016-04-17 11:51:44
 * @Last Modified by:   tangwy
 * @Last Modified time: 2017-02-06 15:59:39
 */
'use strict';
angular.module("AdminService", [])
    .factory("restful", function ($http) {
        var promise;
        return {
            get: function (resource, _id) {
                promise = $http.get(resource + _id + '/').then(function (response) {
                    return response.data;
                });
                return promise;
            },
            query: function (resource, params) { //查询
                params = (typeof params) !== 'undefined' ? params : {}; //params 请求参数，将在URL上被拼接成？key=value

                promise = $http({url: resource, method: "GET", params: params})
                    .then(function (response) {
                        return response.data;
                    });
                return promise;
            },
            remove: function (resource, _id) {
                promise = $http({url: resource + _id + '/?type=all', method: "DELETE"})
                    .then(function (response) {
                        return response.data;
                    });
                return promise;
            },
            update: function (resource, _id, data) { //更新
                promise = $http({url: resource + _id + '/', method: "PATCH", data: data}) //  数据，将被放入请求内发送至服务器
                    .then(function (response) {
                        return response.data;
                    });
                return promise;
            },
            save: function (resource, data) {
                promise = $http({url: resource, method: "POST", data: data})
                    .then(function (response) {
                        return response.data;
                    });
                return promise;
            },
            fetch: function (resource, method, params) {
                var setMethod = typeof(method) == "undefined" ? "GET" : method;
                var paramsObj = method == "POST" ? {} : params;
                var config = {
                    url: resource,
                    method: setMethod,
                    data: params,
                    params: paramsObj
                };
                promise = $http(config)
                    .then(function (response) {
                        return response.data;
                    });
                return promise;
            }
        };
    })
    .factory('AuthService', ['$http', 'Session', '$rootScope', 'toastr', function ($http, Session, $rootScope, toastr) {
        var authService = {};
        authService.login = function (credentials) {
            //登录，成功后返回用户名
            return $http
                .post($rootScope.api.login, credentials)
                .then(function (res) {
                    if (res.data.code == 2000) {
                        debugger
                        $rootScope.userType = res.data.data.userType;

                        var obj = {username:res.data.data.username,accessToken:res.data.data.accessToken,id:res.data.data.id,userType:$rootScope.userType}
                        Session.create(obj);

                    }
                    else {
                        toastr.error(res.data.msg);
                    }
                    return res.data;
                });
        };

        authService.isAuthenticated = function () {
            //是否登录，返回true或者false
            return !!Session.$storage.username;
        };

        authService.isAuthorized = function (nextRoute) {
            //是否有权限，返回true或者false
            var refuseRoute = Session.$storage.refuseRoute;
            if (refuseRoute) {
                return (authService.isAuthenticated() && refuseRoute.indexOf(nextRoute) == -1);
            } else {
                return authService.isAuthenticated();
            }

        };
        return authService;
    }])
    .service('Session', ['$sessionStorage', function ($sessionStorage) {
        this.$storage = $sessionStorage;
        this.create = function (obj) {
            this.$storage.username = obj.username;
            this.$storage.id = obj.id;
            this.$storage.accessToken = obj.accessToken;
            this.$storage.refuseRoute = obj.refuseRoute;
            this.$storage.userType = obj.userType;

        };
        this.destroy = function () {
            delete this.$storage.username;
            delete this.$storage.id;
            delete this.$storage.accessToken;
            delete this.$storage.refuseRoute;
            delete this.$storage.userType;
        };
        return this;
    }])
    .factory('AuthInterceptor', ['$injector', '$q', 'toastr', function ($injector, $q, toastr) {
        // http拦截器
        return {
            response: function (response) {
                var errorNum = response.data.code;
                if (errorNum == 3425) {
                    // 3425 会话超时
                    // 403 已登录但拒绝访问
                    // 417 登陆超时，session过期
                    // 暂时全部跳转到登录界面
                    toastr.error("会话超时");
                    $injector.get('$state').go("login");
                }
                return $q.resolve(response);
            }
        };
    }])
    .factory('msgBus', ['$rootScope', function ($rootScope) {
        //供controller之间通讯，用法参考login页面和header
        var msgBus = {};
        msgBus.emitMsg = function (msg) {
            $rootScope.$emit(msg);
        };
        msgBus.onMsg = function (msg, scope, func) {
            var unbind = $rootScope.$on(msg, func);
            scope.$on('$destroy', unbind);
        };
        return msgBus;
    }])
    .factory('lifeHouseAreaSelector', ['$http', '$localStorage', '$q', '$rootScope', 'restful', function ($http, $localStorage, $q, $rootScope, restful) {
        //生活馆省市联动
        var selector = {
            //获取区域
            getAreas: function () {
                return $http({url: $rootScope.api.getAreas, method: "get"}).then(function (response) {
                    return response.data.data;
                });
            },
            //获取未发货大区
            getNoDeLiveryAreas: function () {
                return $http({url: $rootScope.api.getNoDeLiveryAreas, method: "POST"}).then(function (response) {
                    return response.data.data;
                });
            },
            getProvinces: function (params) {
                //获取所有省份

                if (params) {
                    return $http({
                        url: ($rootScope.api.getprovincesbyareaid),
                        method: "POST",
                        data: params
                    }).then(function (response) {
                        return response.data.data;

                    });
                } else {
                    return $http({url: ($rootScope.api.getArea + 100000), method: "get"}).then(function (response) {
                        return response.data.data;
                    });
                }
            },
            getCitys: function (params) {
                //获取所有市
                return $http({url: $rootScope.api.getArea + params, method: "get"}).then(function (response) {
                    return response.data.data;
                });
            },
            getCountys: function (params) {
                //获取所有县
                return $http({url: $rootScope.api.getArea + params, method: "get"}).then(function (response) {
                    return response.data.data;
                });
            },
            getLifeHouse: function (params) {
                if (params == 100000) {
                    params = "";
                }
                //获取馆名
                return $http({
                    url: $rootScope.api.getMyLifehouse,
                    method: "POST",
                    data: {"regionId": params}
                }).then(function (response) {
                    return response.data.data;
                });
            },
            //
            getNoDeliveryLifeHoustList: function (params) {

				if (params == 100000) {
					return $http({
						url: $rootScope.api.getNoDeliveryLifeHoustList,
						method: "POST"
					}).then(function (response) {
						return response.data.data;
					});
					return;
				}
				//获取未发货馆名
				return $http({
					url: $rootScope.api.getNoDeliveryLifeHoustList,
					method: "POST",
					data: params
				}).then(function (response) {
					return response.data.data;
				});
			},
			getRoles: function () {
				//获取所有角色
				return $http({url: $rootScope.api.authRoleList, method: "post", data: {}}).then(function (response) {
					return response.data.data;
				});
			}
		};
		return selector;
	}])
	.factory('AllAreaSelector', ['$http', '$localStorage', '$q', '$rootScope', 'restful', function ($http, $localStorage, $q, $rootScope, restful) {
		//生活馆省市联动
		var selector = {
			getProvinces: function () {
				//获取所有省份
				return restful.fetch($rootScope.api.getRegion, "POST", {"regionId": 100000});
			},
			getCitys: function (params) {
				//获取所有市
				return restful.fetch($rootScope.api.getRegion, "POST", {"regionId": Number(params)});
			},
			getCountys: function (params) {
				//获取所有县
				return restful.fetch($rootScope.api.getRegion, "POST", {"regionId": Number(params)});
			}
		};
		return selector;
	}])
	.factory('ImageInfo', ['$q', function ($q) {
		//获取file image 的信息，依赖angular-base64-upload
		var deferred = $q.defer();
		var info = {
			getInfo: function (base64, key) {
				this._getInfoByKey(base64, key).then(function (imageInfo) {
					if (imageInfo) {
						deferred.resolve(imageInfo);
					}
				});
				return deferred.promise;
			},
			_getInfoByKey: function (base64, key) {
				var d = $q.defer();
				var type = base64.filetype;
				var code = base64.base64;
				var size = base64.filesize;
				var name = base64.filename;
				var src = "data:" + type + ";base64," + code;
                var img = new Image();
                img.src = src;
                img.onload = function () {
                    var imageInfos = {
                        dimension: {
                            width: img.width,
                            height: img.height
                        },
                        width: img.width,
                        height: img.height,
                        base64: code,
                        base64Str: src,
                        filetype: type,
                        filesize: size,
                        filename: name,
                    }
                    if (key) {
                        d.resolve(imageInfos[key]);
                    } else {
                        d.resolve(imageInfos);
                    }
                }
                return d.promise;
            }
        };
        return info;
    }])
    .factory('GetLifeHouseName', ['$http', 'Session', '$rootScope', 'toastr', function ($http, Session, $rootScope, toastr) {
        var LifeHouseName = {
            GetName: function (arr, key, val, name) {
                //arr-所有生活馆数组,val-val,key-对象key
                if (arr.length) {
                    for (var i = 0; i < arr.length; i++) {
                        var value = arr[i].key || arr[i][key];
                        if (value == val) {
                            return arr[i][name];
                        }
                    }
                }
            },
            compareObj: function (arr, key1, key2, key3) {
                if (arr.length) {
                    for (var i = 0; i < arr.length; i++) {
                        for (var k = i + 1; k < arr.length; k++) {
                            var oneVal1 = arr[i].key1 || arr[i][key1];
                            var twoVal1 = arr[k].key1 || arr[k][key1];
                            if (oneVal1 == twoVal1) {
                                var oneVal2 = arr[i].key2 || arr[i][key2];
                                var twoVal2 = arr[k].key2 || arr[k][key2];
                                if (oneVal2 == twoVal2) {
                                    if (key3) {
                                        var oneVal3 = arr[i].key3 || arr[i][key3];
                                        var twoVal3 = arr[k].key3 || arr[k][key3];
                                        if (oneVal3 == twoVal3) {
                                            toastr.error("不能选择重复的运动馆", "err");
                                            return true;
                                        }
                                    } else {
                                        toastr.error("不能选择重复的运动馆", "err");
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
                return false;
            },
            checkData: function (arr, key1, key2) {
                if (arr.length) {
                    for (var i = 0; i < arr.length; i++) {
                        var value1 = arr[i].key1 || arr[i][key1] || "";
                        var value2 = arr[i].key2 || arr[i][key2] || "";
                        if (!((!!value1) == (!!value2))) {
                            return true;
                        }
                    }
                }
                return false;
            },
            checkMoney: function (arr, key) {
                var arrC = [];
                if (arr.length) {
                    for (var i = 0; i < arr.length; i++) {
                        var value = arr[i].key || arr[i][key];
                        if (value) {
                            arrC.push(arr[i]);
                        }
                    }
                }
                return arrC;
            },
            removeArr: function (arr, key) {
                var arr_tmp = new Array();
                for (var key_tmp in arr) {
                    if (key_tmp != key) {
                        arr_tmp[key_tmp] = arr[key_tmp];
                    }
                }
                return arr_tmp;
            }
        };
        return LifeHouseName;
    }])
    //公关数据，存放多次使用到的数据
    .factory('CommonData', ['$rootScope', 'restful', function ($rootScope, restful) {
        var data = {
            hourArr: function () {
                //小时数组(以半小时为单位)
                var arr = [];
                for (var i = 0; i < 24 * 2; i++) {
                    arr[i] = {
                        "status": (Math.floor(i / 2) > 9 ? Math.floor(i / 2) : ("0" + Math.floor(i / 2))) + ":" + ((i * 30) % 60 == 0 ? "00" : (i * 30) % 60),
                        "status_id": i
                    }
                }
                return arr;
            },
            /**
             * 根据经营开始时间和结束时间获取可设置时段
             * @param  {number} beginTime unix timestemp
             * @param  {number} endTime   unix timestemp
             * @param  {number} today     unix timestemp，将当前年月日设置为today，留空则默认使用beginTime的
             * @dependencies              moment.js
             * @return {array}            返回可设置时段，单位为30分钟
             */
            getAccessHour: function (beginTime, endTime, today) {
                var arr = [];
                var now = moment.unix(today || beginTime);
                var config = {
                    year: now.get('year'),
                    month: now.get('month'),
                    date: now.get("date")
                };
                var begin = moment.unix(beginTime).set(config);
                var end = moment.unix(endTime).set(config);
                while (begin <= end) {
                    arr.push({
                        timestemp: begin.unix(),
                        text: begin.format("HH-mm")
                    });
                    begin.add(30, 'm');
                }
                return arr;
            },
            /**
             * 获取课程列表
             * @param  {string} lifeId  生活馆ID
             * @return {promise} 返回课程列表promise
             */
            getCourseList: function (lifeId) {
                return restful.fetch($rootScope.api.getCourseList, "POST", {"lifeId": lifeId || null});
            },
            /**
             * 获取私教列表
             * @param  {string} lifeId  生活馆ID
             * @return {promise}        返回私教列表promise
             */
            getTrainerList: function (lifeId) {
                return restful.fetch($rootScope.api.getTrainerList, "POST", {"lifeId": lifeId});
            },
            //获取课时
            getDicItem: function () {
                return restful.fetch($rootScope.api.getDicItem, "POST", {"code": "COURSE_COUNT"});
            },
            //获取城市级别
            getCityLevel: function () {
                return restful.fetch($rootScope.api.getDicItem, "POST", {"code": "city_level"});
            },
            //获取店铺级别
            getLifeLevel: function () {
                return restful.fetch($rootScope.api.getDicItem, "POST", {"code": "life_level"});
            }
        }
        return data;
    }])
    .factory('urlService',function () {
        var urlParam = {};

		function set(data) {
			urlParam = data;
		}

		function get(){
			return urlParam;
		}

		return {
			set: set,
			get: get
		}

	})
