var mysupport = angular.module("mysupport");
mysupport.controller("appList", ["$scope", "$http", "$state", "$rootScope", 'msLang', 'msPop', function($scope, $http, $state, $rootScope, msLang, msPop) {
    $scope.page = {
        total: 0,
        pageNum: 1,
        pageSize: 8,
        pageSizeArray: [8, 16, 32, 64, 128]
    };


    var reGetAppList = function() {
        $scope.resource = $scope.resource || {}

        $http.get('mysupport/app/list', {
                params: {
                    "pageNum": $scope.page.pageNum,
                    "pageSize": $scope.page.pageSize,
                    "appName": $scope.resource.value
                }
            })
            .then(function(resp, status, headers, config) {

                if (resp && resp.data.data && resp.data.data instanceof Array) {

                    $scope.page.total = resp.data.total;
                    $scope.page.pages = resp.data.pages;
                    $scope.items = resp.data.data;
                   
                }
            }, function(resp) {

            })
    }

    $scope.query = function() {
        reGetAppList();
    }

    $rootScope.reGetAppList = reGetAppList;
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.reGetAppList);


    $scope.cancel = function(item) {
        var option = {
            title: msLang.get("role.delete.hint"),
            content: "确认删除业务" + item.appName,
            fn: 'deleteApp(\'' + item.appId + '\')'
        }
        msPop.confirm($scope, option);
    }

    $scope.deleteApp = function(appId) {
        if (appId) {
            $http({
                url: 'mysupport/app/delete?appId=' + appId,
                method: 'post',

            }).then(function(resp) {

                if (resp.data && resp.data != "") {
                   

                    var option = {
                        title: msLang.get("role.delete.hint"),
                        content: resp.data.message
                    }

                    msPop.hint($scope, option);
                } else {

                    reGetAppList();
                }

            }, function(resp) {

            });

        }
    }

    $scope.init = function() {
        $scope.draw();
    };
    $scope.$on('resize', function() {
        $scope.draw();
    });
    $scope.draw = function() {
        var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
        $('[ui-view=right]').css('max-height', mainHeight - 15);
    };

}]);


mysupport.controller("appDetailsCtrl", ['$state', '$stateParams', '$http', '$scope', 'msLang',
    function($state, $stateParams, $http, $scope, msLang) {
        $scope.type = $stateParams.type;
        //根据id查询业务信息
        $http.get('mysupport/app/byId', {
                params: {

                    "appId": $stateParams.businessId
                }
            })
            .then(function(resp, status, headers, config) {

                if (resp && resp.data) {
                    $scope.app = resp.data;

                }
            }, function(resp) {

            })

        $scope.appGetUpdate = function($valid) {

            $scope.appAdd_form.submitted = true;
            if (!$valid || $scope.appAdd_form.wait) {
                return;
            }
            $http({
                url: 'mysupport/app/update?appId=' + $scope.app.appId + '&appName=' + $scope.app.appName + '&appDesc=' + $scope.app.appDesc + '&rootUrl=' + $scope.app.rootUrl,
                method: 'post',

            }).then(function(resp) {

                $state.go("index.setting.app");

            }, function(resp) {

            });

        }


        $scope.volidChart = function() {


            var reg = RegExp("[\\s<>&]")
            if (reg.test($scope.app.appName)) {
                $scope.inputChart = true;
            } else {
                $scope.inputChart = false;
            }

            $scope.chart = $scope.inputChart;

        }



        $scope.init = function() {
            $scope.draw();
        };
        $scope.$on('resize', function() {
            $scope.draw();
        });
        $scope.draw = function() {
            var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
            $('[ui-view=right]').css('max-height', mainHeight - 15);
        };



    }
]);


mysupport.controller("appAddCtrl", ['$state', '$stateParams', '$http', '$scope', '$rootScope', 'msLang', 'msPop',
    function($state, $stateParams, $http, $scope, $rootScope, msLang, msPop) {




        $scope.addApp = function($valid) {

            $scope.appAdd_form.submitted = true;
            $scope.appName.check = true;
            $scope.rootUrl.check = true;
            $scope.appDesc.check = true;

            if (!$valid) {
                return;
            }
            //新建业务
            $http({
                url: 'mysupport/app/create?appName=' + $scope.appName.value + '&appDesc=' + $scope.appDesc.value + '&rootUrl=' + $scope.rootUrl.value,
                method: 'post',

            }).then(function(resp) {


                if (resp.data && resp.data.errorCode == "invalid_param") {

                    var option = {
                        title: "提示",
                        content: resp.data.message
                    }

                    msPop.hint($scope, option);
                } else {

                    $state.go("index.setting.app");
                }




            }, function(resp) {


                var option = {
                    title: "提示",
                    content: "新增业务" + $scope.app.appName + "失败"
                }

                msPop.hint($scope, option);
            });
        }

        $scope.init = function() {
            $scope.draw();
        };
        $scope.$on('resize', function() {
            $scope.draw();
        });

        $scope.draw = function() {
            var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
            $('[ui-view=right]').css('max-height', mainHeight - 15);
        };



        var placeholder = msLang.get('ms.appMngt.appName.placeholder');
        $(document).on('keyup', "input[placeholder=" + placeholder + "]", function() {
            console.log("123456");

            var reg = RegExp("[\\s<>&]")
            if (reg.test($scope.appName.value)) {

                var str = "<span id='chartvolid' class='ms-hint' ><i></i><em >业务名称不能包含空字符，<,>,&特殊字符</em></span>";
                var div = $("#chartvolid");
                if (div.length == 0) {
                    $(this).parent().append(str);
                }
            } else {
                $("#chartvolid").remove();
            }

        })
    }
]);