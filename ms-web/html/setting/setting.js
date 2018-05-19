var mysupport = angular.module("mysupport");
mysupport.controller("setting", ['$scope', '$state', 'msUser', function($scope, $state, msUser) {

    $scope.id = 'setting';
    $scope.menu = msUser.getLeftNameAndUrl($scope.id);
    $scope.changeNav = function(href) {
        if (!href) {
            for (var i = 0; i < $scope.menu.length; i++) {
                $scope.menu[i].active = false;
            }
            return;
        }
        for (var i = 0; i < $scope.menu.length; i++) {
            if (href.indexOf($scope.menu[i].url) === 0) {
                $scope.menu[i].active = true;
            } else {
                $scope.menu[i].active = false;
            }
        }
    };
    $scope.$on('navChange', function(event, id) {
        if (id == $scope.id) {
            $scope.changeNav(null);
        }
    });
    $scope.closeActive = false;
    $scope.toggleNav = function() {
        $scope.closeActive = !$scope.closeActive;
        $('[ui-view=left]').toggleClass('close');
        $('[ui-view=right]').toggleClass('close');
    };
    $scope.init = function() {
        $scope.changeNav(location.href.substring(location.href.indexOf('#/')));
        $scope.draw();
    };
    $scope.$on('resize', function() {
        $scope.draw();
    });
    $scope.draw = function() {
        var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
        $('[ng-controller=setting]').css('min-height', mainHeight);
    };
}]);
mysupport.controller('settingRight', ['$scope', '$state', 'msLang', '$http', '$interval', 'ngDialog', '$window', function($scope, $state, msLang, $http, $interval, ngDialog, $window) {

    $scope.isShowMenu = false;
    $scope.searchTree = true;
    //todo   待优化呢

    $scope.map = [{
        '1': "菜单",
        '2': "页面",
        '3': "功能"
    }]

    $scope.map1 = {
        "菜单": 1,
        "页面": 2,
        "功能": 3
    }
    $scope.page = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizeArray: [10, 20, 50, 100, 500]
    };
    $scope.list = [];
    // 渲染列表，以及分页
    $scope.query = function() {
        $http({
            url: 'mysupport/resource/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize,
            method: 'GET'
        }).then(function(resp) {
            $scope.items = resp.data.data;
            $scope.items.forEach(function(val) {
                val.resourceType = $scope.map[0][val.resourceType];

            });

            $scope.page.total = resp.data.total;
            $scope.page.pages = resp.data.pages;
        });
        return $scope.items;
    };
    $scope.query();

    // 查询
    $scope.reGetResoList = function() {
        var _resourceType = $('.resourceType').text();
        var _appId = $('.currentVal').val();
        var _resourceId = $('.resoId').val();
        for (item in $scope.map[0]) {

            if ($scope.map[0][item] == _resourceType) {
                var _resourceType = item;
            }
        }

        if (_resourceType != '' || _appId != '' || _resourceId != '') {
            $http.get('mysupport/resource/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize + '&resourceType=' + _resourceType + '&appId=' + _appId + '&resourceId=' + _resourceId).then(function(resp) {
                $scope.items = resp.data.data;
                // alert($scope.items.length)
                if ($scope.items.length == 0) {

                } else {
                    $scope.items.forEach(function(val) {
                        val.resourceType = $scope.map[0][val.resourceType];
                    });
                    $scope.page.total = resp.data.total;
                    $scope.page.pages = resp.data.pages;
                }

            })
        } else {
            ngDialog.open({
                template: '../../directive/popModal/popModal.html',
                controller: function($scope) {
                    $scope.titles = '提示',
                        $scope.msgInfo = '请输入一个查询条件！',
                        $scope.cancleBtnIsTure = false;
                         $scope.sureBtns = function(){
                             $('.ngdialog').css('display', 'none');
                         }
                },
                className: 'ngdialog-theme-default',
            })
        }

    }

    // 点击所属业务模块
    $scope.selectApps = function() {

        $scope.isShow = true;
        // 选择业务模块分页
        $scope.getApps = function() {
            $http.get('mysupport/app/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize).then(function(resp) {
                $scope.resourceApp = resp.data.data;
                $scope.page.total = resp.data.total;
                $scope.page.pages = resp.data.pages;
            });
            return $scope.resourceApp
        }
        $scope.getApps();
        $scope.arrs = $scope.getApps();
        $scope.$on('select', function(e, newName) {
            $scope.businessId = newName;
        })
        angular.element('.modalTip').css('display', 'block');
    }
    $scope.fun = '功能';
    $scope.showSon = function(id) {

        // $scope.showChild =true;
        $http.get('mysupport/resource/querySubResource?parentId=' + id).then(function(resp) {
            $scope.childLists = resp.data;
            $scope.childLists.forEach(function(val) {
                val.resourceType = $scope.map[0][val.resourceType];

            });
        })
    }
    $scope.delResource = function(id) {
        ngDialog.open({
            template: '../../directive/popModal/popModal.html',
            controller: function($scope) {
                $scope.titles = '提示',
                    $scope.msgInfo = '是否确认删除！',
                    $scope.cancleBtnIsTure = true;
                $scope.sureBtns = function() {
                    $http.post('mysupport/resource/delete?resourceId=' + id).then(function(resp) {
                        var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
                        $('[ng-controller=setting]').css('min-height', mainHeight);
                        $('.ngdialog').css('display', 'none');
                        $window.location.reload();

                    })
                }
            }
        })

    }


}]);


// 增删改controller
mysupport.controller('resoAddCtrl', ['$scope', '$state', 'msLang', '$http', '$stateParams', 'ngDialog', '$window', function($scope, $state, msLang, $http, $stateParams, ngDialog, $window) {
    //判断跳转后展示的页面
    $scope.type = $stateParams.type;
    // alert($stateParams.parentId)
    $scope.parentIds = $stateParams.parentIds
    $scope.resourceType = $stateParams.resourceType;
    if($scope.parentIds){
        $scope._parentId = $scope.parentIds;
    }
    // alert( $scope.resourceType )
    $scope.typeToggle = function() {
        $scope.type = 'update'
    }
    $scope.selectResourceTypes = function(type){
        $scope.funs = !$scope.funs
    }
    //资源类型选择
    $scope.selectResourceType = function(type) {

        if (type == 1) {
            $scope.menu = true;
            $scope.page1 = false;
            $scope.fun = false;
            $scope.resourceType = type;
        } else if (type == 2) {
            $scope.menu = false;
            $scope.page1 = true;
            $scope.fun = false;
            $scope.resourceType = type
            // $scope.resource.isLook = 2;  
            // $scope.resource.isExcRes = false;
        } else if (type == 3) {
            $scope.menu = false;
            $scope.page1 = false;
            $scope.fun = true;
            $scope.resourceType = type
            // $scope.resource.isLook = 2;
        }
        // $scope.resource.resourceType = type;
    }

    $scope.resource = {
        appResUrl: null,
        fatherResId: '',
        isFatherRes: false,
        type: $stateParams.type,
        resoModuleList: [],
        resoRank: null,
        resourceDes: null,
        resourceId: null,
        resourceCode: null,
        resourceName: null,
        appId: null,
        resourceType: null,
        resourceUrl: null,

    }

    // 资源新增
    if ($scope.type == 'add') {
        //页面数据初始化

        $scope.page = {
            total: 0,
            pageNum: 1,
            pageSize: 10,
            pageSizeArray: [10, 20, 50, 100, 500]
        };
        $scope.list = [];
        // 点击所属业务模块
        $scope.selectApps = function() {

            $scope.isShow = true;
            $scope.isFatherShow = false;
            // 选择业务模块分页
            $scope.getApps = function() {
                $http.get('mysupport/app/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize).then(function(resp) {
                    $scope.resourceApp = resp.data.data;
                    $scope.page.total = resp.data.total;
                    $scope.page.pages = resp.data.pages;
                });
                return $scope.resourceApp
            }
            // $scope.getApps();
            $scope.arrs = $scope.getApps();
            $scope.$on('select', function(e, newName) {
                $scope.appId = newName;
            })
            angular.element('.modalTip').css('display', 'block');

        }
        
        // 是否有子资源
        $scope.isChild = false;
        $scope.parentId = false;

        $scope.isSon = function(){
            $scope.isChild=!$scope.isChild
        }
        // 是否有父资源
        $scope.resourceFather = function() {

            if ($scope.resource._isFatherRes) {
                
            }else{
                 $scope.parentId ='';
            }
            $scope.resource._isFatherRes = !$scope.resource._isFatherRes;
        }

        // 父资源选择
        $scope.selectFather = function() {
            $scope.isFatherShow = true;
            $scope.isShow = false;

            // 选择业务模块分页
            $scope.getIds = function() {
                $http.get('mysupport/resource/tree?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize).then(function(resp) {
                    $scope.resourceFatherIds = resp.data;
                    $scope.page.total = resp.data.total;
                    $scope.page.pages = resp.data.pages;
                    console.log(resp.data)
                });
                return $scope.resourceFatherIds;
            }
            // $scope.getIds();
            $scope.arrs = $scope.getIds();

            $scope.$on('selectFatherId', function(e, newName) {
                $scope.parentId = newName;
            })
            angular.element('.modalTip').css('display', 'block');
        }
        // todo


        $scope.createResource = function(resoMngtAdd_form) {
            console.log(resoMngtAdd_form)
            if (resoMngtAdd_form.$invalid) {
                ngDialog.open({
                    template: '../../directive/popModal/popModal.html',
                    controller:function($scope){
                        $scope.titles = '提示',
                        $scope.msgInfo = '请检查所填写的数据！',
                        $scope.sureBtns = function() {
                           
                            $('.ngdialog').css('display', 'none');

                        }
                    }
                })
            } else {
                $scope.myData = {
                    resourceType:$scope.resourceType,
                    resourceName:$scope.resourceName,
                    appId:$scope.appId,
                    resourceUrl:$scope.resourceUrl,
                    resourceDesc:$scope.resourceDesc,
                    hasChild:$scope.isChild,
                    parentId:$scope.parentId
                }
               for(item in $scope.myData){
                if($scope.myData[item]==""){
                    delete $scope.myData[item];
                }
               }
                $http({
                    url: "mysupport/resource/create",
                    method: 'post',
                    data:$scope.myData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var s in obj) {
                            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
                        }
                        return str.join("&");
                    }
                }).then(function(resp) {
                    
                    if (resp.data.errorCode == 'invalid_param') {
                        ngDialog.open({
                            template: '../../directive/popModal/popModal.html',
                            controller: function($scope) {
                                $scope.titles = '提示',
                                $scope.msgInfo = resp.data.message,
                                 $scope.cancleBtnIsTure = false;
                                 $scope.sureBtns = function() {
                                    $('.ngdialog').css('display', 'none');
                                }
                            }
                        })
                    } else {
                        ngDialog.open({
                            template: '../../directive/popModal/popModal.html',
                            controller: function($scope) {
                                $scope.titles = '提示',
                                    $scope.msgInfo = '新增成功！',
                                    $scope.cancleBtnIsTure = false;
                                $scope.sureBtns = function() {
                                    history.go(-1);
                                    $('.ngdialog').css('display', 'none');
                                }
                            }
                        })
                    }
                })
            }

        }
    }




    // 资源查看详情
    if ($scope.type == 'view') {
        $http.get("mysupport/resource/byId?resourceId=" + $stateParams.resourceId).then(function(resp) {

            $scope.resourceName = resp.data.resourceName;
            $scope.appId = resp.data.appId;
            $scope.resourceUrl = resp.data.resourceUrl;
            // $scope._isFatherRes = resp.data.parentId;
            $scope.resourceDesc = resp.data.resourceDesc
            // $scope.tt= resp.data.resourceType;
            // console.log(resp.data.parentId)
        })
    }
    $scope.confirmUpdate = function() {
        $http.post('mysupport/resource/update?resourceId=' + $stateParams.resourceId + '&resourceUrl=' + $scope.resourceUrl + '&resourceDesc=' + $scope.resourceDesc).then(function(resp) {
            if (resp.data.errorCode == 'no_permission') {
                alert(resp.data.message)
            } else {
                ngDialog.open({
                    template: '../../directive/popModal/popModal.html',
                    controller: function($scope) {
                        $scope.titles = '提示',
                            $scope.msgInfo = '修改成功！',
                           $scope.sureBtns = function() {
                                    history.go(-1); 
                                    $('.ngdialog').css('display', 'none');

                                }
                    },
                })
            }
        })
    }
    // 资源更新
    if ($scope.type == 'update') {
        $http.get("mysupport/resource/byId?resourceId=" + $stateParams.resourceId).then(function(resp) {
            console.log(resp)
            $scope.resourceName = resp.data.resourceName;
            $scope.appId = resp.data.appId;
            $scope.resourceUrl = resp.data.resourceUrl;
            $scope.resourceDesc = resp.data.resourceDesc

        })



    }
}])