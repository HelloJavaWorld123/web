/*
 * @Author: 唐文雍
 * @Date:   2016-04-20 22:10:28
 * @Last Modified by:   Marte
 * @Last Modified time: 2017-02-15 16:47:39
 */

'use strict';
App.directive('percentage', function () {
    //百分比
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            ctrl.$formatters.push(function (modelValue) {
                return parseFloat((modelValue * 100).toFixed(2));
            });
            ctrl.$parsers.push(function (viewValue) {
                return (viewValue / 100).toFixed(4);
            });
        }
    };
});
App.directive('dateToTimestamp', function () {
    //日期转为短时间戳
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            ctrl.$parsers.push(function (viewValue) {
                return Math.floor(new Date(viewValue).getTime() / 1000);
            })
        }
    }
});
App.directive('datetimeTransform', ['$filter', '$timeout', function ($filter, $timeout) {
    //时间戳和时间互转
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            format: '@'
        },
        link: function (scope, element, attr, ctrl) {
            var datetimeFormat = scope.format;
            ctrl.$formatters.push(function (modelValue) {
                var datetime = isNaN(modelValue) ? modelValue : new Date(modelValue);
                return $filter('date')(datetime, datetimeFormat);
            });
            ctrl.$parsers.push(function (viewValue) {
                var datetime = new Date(viewValue).getTime();
                return datetime;
            });
        }
    }
}]);
App.directive('stringToNumber', function () {
    //字符串转数字
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function (modelValue) {
                return parseFloat(modelValue, 10);
            });
            ctrl.$parsers.push(function (viewValue) {
                return '' + viewValue;
            });
        }
    };
});
App.directive('lowerThan', function () {
    //inpuit a要小于某个值
    var link = function ($scope, $element, $attrs, ctrl) {

        var validate = function (viewValue) {
            var comparisonModel = $attrs.lowerThan;

            if (!viewValue || !comparisonModel) {
                // It's valid because we have nothing to compare against
                ctrl.$setValidity('lowerThan', true);
            }

            if (!viewValue && !comparisonModel) {
                //NaN，可留空
                ctrl.$setValidity('lowerThan', true);
            } else {
                // It's valid if model is lower than the model we're comparing against
                ctrl.$setValidity('lowerThan', parseInt(viewValue, 10) < parseInt(comparisonModel, 10));
            }
            return viewValue;
        };

        ctrl.$parsers.unshift(validate);
        ctrl.$formatters.push(validate);

        $attrs.$observe('lowerThan', function (comparisonModel) {
            return validate(ctrl.$viewValue);
        });

    };

    return {
        require: 'ngModel',
        link: link
    };

});
App.directive('focusOnFirstInvalidInput', function () {
    //提交表单时，如有验证不通过的表单即将焦点定在第一个invalid input
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('submit', function () {
                var firstInvalid = element[0].querySelector('.ng-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
});
App.directive('setClassWhenAtTop', ['$window', function ($window) {
    //当某个元素滚动到顶部时，设置class, 用法如 set-class-when-at-top="fix-to-top"
    var $win = angular.element($window);
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var topClass = attr.setClassWhenAtTop,
                offsetTop = element.offset().top;
            $win.on('scroll', function (e) {
                if ($win.scrollTop() >= offsetTop) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
}]);
App.directive('ignoreMouseWheel', ['$rootScope', function ($rootScope) {
    //禁用鼠标滚动，用在type=number的标签上
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('mousewheel', function (event) {
                element.blur();
            });
        }
    }
}]);
App.directive('activeLink', ['$location', function ($location) {
    //路由改变时，给菜单栏 对应的链接父元素加上active
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem) {
            scope.$on("$stateChangeStart", function () {
                var hrefs = ['/#' + $location.path(),
                    '#' + $location.path(), //html5: false
                    $location.path()
                ]; //html5: true
                angular.forEach(elem.find('a'), function (a) {
                    a = angular.element(a);
                    if (-1 !== hrefs.indexOf(a.attr('href'))) {
                        a.parent().addClass('active');
                    } else {
                        a.parent().removeClass('active');
                    }
                    ;
                });
            });
        }
    }
}]);
App.directive('ngEnter', function () {
    //回车键，ng-enter='doSomething()'
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
App.directive('imageViewer', ['$window', function ($window) {
    //图片查看器, 依赖viewer.js插件
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var Viewer = $window.Viewer;
            var options = {
                navbar: false,
                zoomRatio: 0.3,
                show: function (e) {
                    //本身viewer部分的html是追加在目标img后面，不能全屏浏览，暂时办法为：移动viewer html到body
                    $("body").append($(".viewer-container"));

                    //暂时不需要以下这些按钮，所以去掉
                    $(".viewer-container .viewer-prev,.viewer-play,.viewer-next,.viewer-reset,.viewer-flip-horizontal,.viewer-flip-vertical").remove();

                    var viewerCanvas = $(".viewer-canvas");
                    viewerCanvas.on('mousedown', function (evt) {
                        viewerCanvas.on('mouseup mousemove', function handler(evt) {
                            console.info(evt.type);
                            if (evt.type === 'mouseup') {
                                // 点击，关闭
                                viewer.hide();
                            } else {
                                // 拖拽
                            }
                            viewerCanvas.off('mouseup mousemove', handler);
                        });
                    });
                }
            };
            var dom = $(element).context;
            var viewer = new Viewer(dom, options);
        },
    };
}]);
App.directive('toggleMenu', function () {
    //左侧菜单伸缩
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.click(function () {
                $(this).parent().children('ul.tree').toggle(200);
                $(this).children('i.pull-right').toggleClass('fa-angle-right fa-angle-down');
            });
        }
    }
});
App.directive('booleanToNumber', function () {
    //布尔值转数字，数字转布尔值
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            ctrl.$formatters.push(function (modelValue) {
                return modelValue === 1 ? true : false;
            });
            ctrl.$parsers.push(function (viewValue) {
                return viewValue === true ? 1 : 0;
            });
        }
    };
});
App.directive('hideParent', ['$timeout', function ($timeout) {
    //当子元素的内容为空时，隐藏父元素，本项目用在侧栏菜单
    return {
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            $timeout(function () {
                var childLength = element.find(attr.hideParent + ":first").children().length;
                if (!childLength) {
                    element.hide();
                } else {
                    element.show();
                }
            });
        }
    }
}]);
App.directive('goBack', ['$window', function ($window) {
    //后退一个页面
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on('click', function () {
                $window.history.back();
            });
        }
    }
}]);
App.directive('imgUploader', function ($timeout, toastr, msgBus) {
    //文件上传器
    var link = function ($scope, $ele, $attr, $ctrl) {
        //初始化当前input的material样式
        $.material.input($ele);
        //文件上传成功之后的回调
        $scope.uploadComplete = function (res) {
            $scope.result = res;
            if (res.success) {
                $scope.file = $scope.result.data || $scope.result.msg;
                toastr.success('上传成功');
            } else {
                toastr.error($scope.result.msg);
            }
        };

        if ($scope.auto) {
            //如果设为自动上传
            $ele.find("#uploadFile").bind("change", function (e) {
                $(this).val() && $ele.submit();
                var fileName = $(this)[0].files[0].name;
                fileName && $(this).val("");

                $timeout(function () {
                    $scope.fileName = fileName;
                    $ele.find("#uploadFileName").val(fileName);
                });
            });
        }

        //接受“清空”消息
        msgBus.onMsg('reset', $scope, function () {
            $scope.file = null;
            $scope.fileName = null;
        });
    };
    return {
        scope: {
            api: '@', //文件上传接口地址
            file: '=', //上传成功后的文件名
            accept: '@', //所接受的文件类型，使用方式和inpu=file accept一样
            placeholder: '@', //输入提示
            auto: '=' //是否自动上传
        },
        replace: true,
        link: link,
        templateUrl: 'app/scripts/directives/template/uploadImg.html'
    }
});
App.directive('upImg', ['$http', 'toastr', '$rootScope', function ($http, toastr, $rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var imglength = attr && attr.imglength ? parseInt(attr.imglength) : 9;
            element.on('change', function () {
                console.log(this);
                var initLength = 0;
                if (this.files.length == 0) {
                    //图片为0，就是没选择，直接跳出
                    return;
                }
                //判断原来是否已经存在图片了
                if (scope.imgUrlArr) {
                    initLength = scope.imgUrlArr.length;
                } else {
                    //没有就清空数组
                    scope.imgUrlArr = [];
                }
                if (this.files.length + initLength > imglength) {
                    var str = "你选择的图片总和超过了" + imglength + "张，请重新选择";
                    toastr.error(str);
                    return;
                } else {
                    scope.isLoading = true;
                }
                var fd = new FormData();
                for (var i = this.files.length; i >= 0; i--) {
                    fd.append('imageList', this.files[i]);
                }
                for (var i = 0; i < this.files.length; i++) {
                    var imageObj = this.files[i];
                    if (this.files[i].size > 10 * 1024 * 1024) {
                        toastr.error("你的文件超过了10M，请重新选择图片上传！");
                        scope.isLoading = false;
                        return;
                    }
                    if (typeof(FileReader) != undefined) {
                        var reader = new FileReader();
                        reader.readAsDataURL(this.files[i]);
                        //监听文件读取结束后事件
                        reader.onloadend = function (e) {
                            var img = new Image();
                            img.src = e.target.result;
                            console.log(img.width, img.height);
                            if (img.width * 3 != img.height * 4) {
                                toastr.error("你选的图片比例不是标准的4：3，请重新选择图片上传！");
                                scope.isLoading = false;
                                element.val("");
                                return;
                            } else {
                                $http({
                                    method: 'POST',
                                    url: $rootScope.api.uploadImgMany,
                                    data: fd,
                                    headers: {
                                        'Content-Type': undefined
                                    },
                                    transformRequest: angular.identity
                                })
                                    .success(function (response) {
                                        //上传成功的操作
                                        $(".imgArr").remove();
                                        console.log("上传成功返回的数据：", response);
                                        for (var i = 0; i < response.data.length; i++) {
                                            scope.imgUrlArr.push(response.data[i]);
                                        }
                                        console.log(scope.imgUrlArr);
                                        scope.isLoading = false;
                                    });
                            }
                        }
                    } else {
                        toastr.error("不支持H5文件读取");
                    }
                }
            });
        }
    }
}]);


App.directive('upIco', ['$http', 'toastr', '$rootScope', function($http, toastr, $rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var imglength = attr && attr.imglength ? parseInt(attr.imglength) : 9;
            var imgsize = attr && attr.imgsize ? parseInt(attr.imgsize) : 10;
            var picIndex = attr && attr.picIndex ? parseInt(attr.picIndex) : 2;

            var key = 'imgUrlIcoArr' + picIndex
            console.log(key);

            if (attr && attr.imgwidth && attr.imgheight) {
                var scale = parseInt(attr.imgwidth) / parseInt(attr.imgheight);
            }
            element.on('change', function () {
                console.log(this);
                var initLength = 0;
                if (this.files.length == 0) {
                    //图片为0，就是没选择，直接跳出
                    return;
                }
                //判断原来是否已经存在图片了
                if (scope[key]) {
                    initLength = scope[key].length;
                } else {
                    //没有就清空数组
                    scope[key] = [];
                }
                if (this.files.length + initLength > imglength) {
                    var str = "你选择的图片总和超过了" + imglength + "张，请重新选择";
                    toastr.error(str);
                    return;
                } else {
                    scope.isLoadingIco = true;
                }
                var fd = new FormData();
                for (var i = this.files.length; i >= 0; i--) {
                    fd.append('img', this.files[i]);
                }
                for (var i = 0; i < this.files.length; i++) {
                    var imageObj = this.files[i];
                    if (this.files[i].size > 2 * 1024 * 1024) {
                        toastr.error("你的文件超过了" + 2 + "M，请重新选择图片上传！");
                        scope.isLoadingIco = false;
                        return;
                    } else {
                        $http({
                            method: 'POST',
                            url: $rootScope.api.multiFileUpload,
                            data: fd,
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: angular.identity
                        })
                            .success(function (response) {
                                //上传成功的操作
                                $(".imgArr").remove();
                                console.log("上传成功返回的数据：", response);
                                if (response.data.length) {
                                    for (var i = 0; i < response.data.length; i++) {

                                        scope[key].push(response.data[i]);
                                    }
                                } else {
                                    var imgObj = {
                                        url: response.data.url,
                                        imgId: response.data.id,
                                    }
                                    scope[key].push(imgObj);
                                }
                                console.log(scope[key]);
                                scope.isLoadingIco = false;
                            });
                    }
                }
            });
        }
    }
}]);
//百度地图
App.directive('map', function () {
    return {
        restrict: 'ECMA',
        template: '<div><div id="l-map" style="width: 100%;height: 500px;"></div></div>',
        replace: true,
        link: function (scope, element, attr) {
            // 百度地图API功能
            function G(id) {
                return document.getElementById(id);
            }
            var map = new BMap.Map("l-map");
            var point = new BMap.Point(113.424239, 23.180031);
            // 初始化地图,设置城市和地图级别。
            map.centerAndZoom(point, 18);
            //滚轮放大放小
            map.enableScrollWheelZoom(true);
            var marker = new BMap.Marker(point); // 创建标注
            map.addOverlay(marker); // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            var ac = new BMap.Autocomplete( //建立一个自动完成的对象
                {
                    "input": "suggestId",
                    "location": map
                });


            ac.addEventListener("onhighlight", function (e) { //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });

            var myValue;
            ac.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                setPlace(myValue);
            });

            function setPlace() {
                map.clearOverlays(); //清除地图上所有覆盖物
                function myFun() {
                    var position = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果

                    scope.position = position;
                    scope.positionLngAndLat = position.lng + "," + position.lat;

                    alert("当前选中的经纬度：" + position.lng + "," + position.lat);
                    map.centerAndZoom(position, 18);
                    map.addOverlay(new BMap.Marker(position)); //添加标注
                }

                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }

            map.addEventListener("click", function (e) {
                alert("当前选中的经纬度：" + e.point.lng + "," + e.point.lat);
                scope.position = {
                    "lat": e.point.lat,
                    "lng": e.point.lng
                }
                scope.positionLngAndLat = scope.position.lng + "," + scope.position.lat;
            });
        }
    }
});

App.directive('lifehouseList', function ($timeout, toastr, restful, $rootScope) {
    var link = function ($scope, $ele, $attr, $ctrl) {
        $scope.data = {};
        // 假如有数据
        var courseArr = $scope.course;
        if (courseArr.campaignDetails && courseArr.campaignDetails.length) {
            for (var k = 0; k < courseArr.campaignDetails.length; k++) {
                var campaignDetailArr = courseArr.campaignDetails[k];
                var levelParams = {
                    cityLevel: campaignDetailArr.citylevel,
                    lifeLevel: campaignDetailArr.lifelevel
                }
                restful.fetch($rootScope.api.getLifehouseList, "POST", levelParams).then(function (res) {
                    if (res.code == 2000) {
                        $scope.getMyLifehouseList = res.data;
                    }
                }, function (rej) {
                    console.info(rej);
                });
            }
        }
        // 获取课程列表
        restful.fetch($rootScope.api.getCoursesList, "POST").then(function (res) {
            if (res.code == 2000) {
                $scope.getCoursesList = res.data;
            }
        }, function (rej) {
            console.info(rej);
        });
        // // 获取运动馆接口-CITY_LEVEL级别
        restful.fetch($rootScope.api.getDicItem, "POST", {
            "code": "CITY_LEVEL"
        }).then(function (res) {
            if (res.code == 2000) {
                $scope.getDicItemOfCityList = res.data;
            }
        }, function (rej) {
            console.info(rej);
        });
        // // 获取运动馆接口-LIFE_LEVEL级别
        restful.fetch($rootScope.api.getDicItem, "POST", {
            "code": "LIFE_LEVEL"
        }).then(function (res) {
            if (res.code == 2000) {
                $scope.getDicItemOfLifeList = res.data;
            }
        }, function (rej) {
            console.info(rej);
        });
        // 重新选择课程名称的时候
        $scope.getCourseID = function (courseArr) {
            courseArr.campaignDetails = [{
                campaignPackageDetails: []
            }];
        }
        // 点击一级运动馆的时候清空二级运动馆
        $scope.resetId = function (campaignDetailArr) {
            campaignDetailArr.lifelevel = null;
            campaignDetailArr.lifeId = null;
            campaignDetailArr.campaignPackageDetails = [];
        }
        // 通过课程id、生活馆id查询课程包、查询生活馆列表
        $scope.getPackById = function (data, campaignDetailArr, courseArr) {
            var params = {
                courseId: courseArr.courseId,
                citylevel: campaignDetailArr.citylevel,
                lifelevel: campaignDetailArr.lifelevel
            }
            var levelParams = {
                cityLevel: campaignDetailArr.citylevel,
                lifeLevel: campaignDetailArr.lifelevel
            }
            campaignDetailArr.lifeId = null;
            restful.fetch($rootScope.api.getcoursePackagesBylevel, "POST", params).then(function (res) {
                if (res.code == 2000) {
                    var arr = res.data;
                    var result = [];
                    if (arr.length) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].coursePackagePrice) {
                                var obj = {};
                                obj.coursePackageId = arr[i].coursePackageId;
                                obj.coursePackageCount = arr[i].courseCount;
                                obj.price = arr[i].coursePackagePrice;
                                obj.campaignPrice = '';
                                result.push(obj);
                            }
                        }
                    }
                    campaignDetailArr.campaignPackageDetails = result;
                }
            }, function (rej) {
                console.info(rej);
            });
            restful.fetch($rootScope.api.getLifehouseList, "POST", levelParams).then(function (res) {
                if (res.code == 2000) {
                    $scope.getMyLifehouseList = res.data;
                }
            }, function (rej) {
                console.info(rej);
            });
        }
        // 添加其他课程
        $scope.addCampaignDetails = function () {
            var campaignDetailObj = {
                campaignPackageDetails: []
            };
            courseArr.campaignDetails.push(campaignDetailObj);
            $scope.course = courseArr;
        };
    };
    return {
        scope: {
            course: "="
        },
        link: link,
        templateUrl: 'app/scripts/directives/template/lifehouseSelector.html'
    }
});

//数据后台》统计图形
App.directive('eChart', function () {
    function link($scope, element, attrs) {
        var myChart = echarts.init(element[0]);
        $scope.$watch(attrs['eData'], function () {
            var option = $scope.$eval(attrs.eData);
            if (angular.isObject(option)) {
                myChart.setOption(option, true);
            }
        }, true);
        $scope.getDom = function () {
            return {
                'height': element[0].offsetHeight,
                'width': element[0].offsetWidth
            };
        };
        $scope.$watch($scope.getDom, function () {
            // resize echarts图表
            myChart.resize();
        }, true);
    }

    return {
        restrict: 'ECMA',
        link: link,
        template: '<div style="width: 100%;height:100%;"></div>'
    };
});


App.directive('fileUploader', function($timeout, toastr, msgBus) {
	//文件上传器
	var link = function($scope, $ele, $attr, $ctrl) {
		//初始化当前input的material样式
		$.material.input($ele);
		//文件上传成功之后的回调
		$scope.uploadComplete = function(res) {
			$scope.result = res;
			if (res.success) {
				$scope.file = $scope.result.data || $scope.result.msg;
				toastr.success('上传成功');
				console.log($scope.file,'123');
			} else {
				toastr.error($scope.result.msg);
			}
		};

		if ($scope.auto) {
			//如果设为自动上传
			$ele.find("#uploadFile").bind("change", function(e) {
				$(this).val() && $ele.submit();
				var fileName = $(this)[0].files[0].name;
				fileName && $(this).val("");

				$timeout(function() {
					$scope.fileName = fileName;
					$ele.find("#uploadFileName").val(fileName);
				});
			});
		}

		//接受“清空”消息
		msgBus.onMsg('reset', $scope, function() {
			$scope.file = null;
			$scope.fileName = null;
		});
	};
	return {
		scope: {
			api: '@', //文件上传接口地址
			file: '=', //上传成功后的文件名
			accept: '@', //所接受的文件类型，使用方式和inpu=file accept一样
			placeholder: '@', //输入提示
			auto: '=' //是否自动上传
		},
		replace: true,
		link: link,
		templateUrl: 'app/scripts/directives/template/uploader.html'
	}
});



App.directive('myFileUp', ['$http', 'toastr', '$rootScope', function($http, toastr, $rootScope) {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			var imglength = attr && attr.imglength ? parseInt(attr.imglength) : 9;

			var picIndex = attr && attr.picIndex ? parseInt(attr.picIndex) : 2;

			var key = 'imgUrlIcoArr' + picIndex
			console.log(key);

			if(attr && attr.imgwidth && attr.imgheight) {
				var scale = parseInt(attr.imgwidth) / parseInt(attr.imgheight);
			}
			element.on('change', function() {

				console.log(this);
				var initLength = 0;
				if(this.files.length == 0) {
					//图片为0，就是没选择，直接跳出
					return;
				}
				//判断原来是否已经存在图片了
				if(scope[key]) {
					initLength = scope[key].length;
				} else {
					//没有就清空数组
					scope[key] = [];
				}
				if(this.files.length + initLength > imglength) {
					var str = "你选择的图片总和超过了" + imglength + "张，请重新选择";
					toastr.error(str);
					return;
				} else {
					scope.isLoadingIco = true;
				}


                var fileObj = this.files[0];
                console.log("11111111",fileObj);
                var fileExt = fileObj.name.substring(fileObj.name.lastIndexOf("."),fileObj.name.length);//获得文件后缀名
                console.log(fileExt);

                if(scope.data.type==0&&fileExt!='.apk') {
                    toastr.error("请上传后缀名为apk的文件！");
                    scope.isLoadingIco = false;
                    return;
                }else if(scope.data.type==1&&fileExt!='.bin'){
                    toastr.error("请上传后缀名为bin的文件！");
                    scope.isLoadingIco = false;
                    return;
                } else{
                    var fd = new FormData();
                    console.log(fd,"fd:");
                    for(var i = this.files.length; i >= 0; i--) {
                        fd.append('file', this.files[i]);
                    }
                    for(var i = 0; i < this.files.length; i++) {
                        $http({
                            method: 'POST',
                            url: $rootScope.api.fileUpload,
                            data: fd,
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: angular.identity
                        })
                            .success(function(response) {
                                //上传成功的操作
                                $(".imgArr").remove();
                                console.log("上传成功返回的数据：", response.data);

                                scope[key].push(response.data);

                                console.log(scope[key]);
                                scope.isLoadingIco = false;
                            });
                }




						/*$http({
							method: 'POST',
							url: $rootScope.api.multiFileUpload,
							data: fd,
							headers: {
								'Content-Type': undefined
							},
							transformRequest: angular.identity
						})
							.success(function(response) {
								//上传成功的操作
								$(".imgArr").remove();
								console.log("上传成功返回的数据：", response);
								if(response.data.length){
									for(var i = 0; i < response.data.length; i++) {

										scope[key].push(response.data[i]);
									}
								}else{
									var imgObj = {
										url:response.data.url,
										imgId:response.data.id,
									}
									scope[key].push(imgObj);
								}
								console.log(scope[key]);
								scope.isLoadingIco = false;
							});*/

				}
			});
		}
	}
}]);

//输入金额限制最大为99999999.99
App.directive('money', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            //限制输入数字最大值 比如99999999.99
            var maxNumber = attr.maxNumber?Number(attr.maxNumber):99999999.99;
            element.on('afterpaste', function() {
                var value = element[0].value;
                if(value[0]=="-"||value[0]=="."){value=value.slice(0,0)}else if(value.split(".")[1]&&value.split(".")[1].length>2||value>maxNumber){value=value.slice(0,value.length-1)}
            });
            element.on('input', function() {
                var value = element[0].value;
                if(value[0]=="-"||value[0]=="."){
                    element[0].value=value.slice(0,0)
                }else if(value.split(".")[1]&&value.split(".")[1].length>2||value>maxNumber){
                    element[0].value=value.slice(0,value.length-1)
                };
            });
        }
    }
});
//输入数量限制最大为9999自然正整数
App.directive('count', function() {
    //input type为text
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            //限制输入最大值
            var maxNumber = attr.maxNumber?Number(attr.maxNumber):9999;
            element.on('afterpaste', function() {
                var value = element[0].value;
                if(value[0]=='-'){
                    element[0].value=''
                }else{
                    element[0].value=value.replace(/\D/g,'');
                    if(Number(value)>maxNumber){
                        element[0].value=value.slice(0,value.length-1);
                    }
                }
            });
            element.on('input', function() {
                var value = element[0].value;
                if(value[0]=='-'){
                    element[0].value=''
                }else{
                    element[0].value=value.replace(/\D/g,'');
                    if(Number(value)>maxNumber){
                        element[0].value=value.slice(0,value.length-1);
                    }
                }
            });
        }
    }
});


