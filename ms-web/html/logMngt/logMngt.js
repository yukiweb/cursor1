var mysupport = angular.module("mysupport");
mysupport.controller("logMngt", ["$rootScope","$scope", "$http" ,'ngDialog',function ($rootScope,$scope, $http,ngDialog) {
    //获取当前时间：$filter('date')(new Date().getTime(),'yyyy-MM-dd')
    //初始化，右边区域的高度固定
    $scope.init = function () {
        $scope.draw();
    };
    $scope.draw = function () {
        var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
        // $('[ui-view=right]').css('max-height', mainHeight - 15);
    };
    $scope.changeMoveClass = function (item) {
        item.isMoveDown = !item.isMoveDown;
        item.isMoveRight = !item.isMoveRight;
        item.isShowDetail = !item.isShowDetail;
    }

    // 点击所属业务模块
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
            $scope.items.forEach(val => {
                val.resourceType = $scope.map[0][val.resourceType];
            });
            $scope.page.total = resp.data.total;
            $scope.page.pages = resp.data.pages;
        });
        return $scope.items;
    };
    //选择业务模块
    $scope.selectApps = function() {
        $scope.isShow = true;
        // 选择业务模块分页
        $scope.getApps = function() {
            $http.get('mysupport/app/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize+'&includeSystem=true').then(resp => {
                $scope.resourceApp = resp.data.data;
                $scope.page.total = resp.data.total;
                $scope.page.pages = resp.data.pages;
            });
            return $scope.resourceApp
        }
        $scope.getApps();
        $scope.arrs = $scope.getApps();
        $scope.$on('select', function(e, newName) {
            $scope.appIdss = newName;
        })
        angular.element('.modalTip').css('display', 'block');
    }
    $scope.fun = '功能';
    //日历框失去焦点
    $scope.isShowStart = false;
    $scope.isShowEnd = false;
    $scope.changeStartShow = function(){
        $scope.isShowStart = !$scope.isShowStart;
    }
    $scope.changeEndShow = function(){
        $scope.isShowEnd = !$scope.isShowEnd;
    }
    //滚动加载
    $scope.logMngtList = function($valid) {
        if(!$scope.appIdss || !$rootScope.start || !$rootScope.end){
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
        if($valid) {
            if($scope.form.value){
                $scope.userId = $scope.form.value;
            }else{
                $scope.userId = '';
            }
            if($scope.appIdss && $rootScope.start && $rootScope.start){
                $scope.queryLogList(true);
            }
        }
    };
    $scope.logDatas = [];
    $scope.busy = false;
    $scope.cursor = null;
    $scope.queryLogList = function () {
        $scope.dateRangeStart = $rootScope.start + ' 00:00:01';
        $scope.dateRangeEnd = $rootScope.end + ' 23:59:59';
        //一开始不要传参数cursor，默认加载第一页
        var params = {
            userId: '',
            appId: $scope.appIdss,
            start: $scope.dateRangeStart,
            end: $scope.dateRangeEnd,
        };
        if ($scope.userId){
            params.userId = $scope.userId;
        }else{
            params.userId  = "";
        }
        if($scope.cursor){//如果存在cursor，说明hasmore一定为真，说明不是第一次请求
            params.cursor = $scope.cursor;
        }
        if($scope.busy){
            return ;
        }
        $scope.busy = true;
        if($scope.appIdss && $rootScope.start && $rootScope.end ){
            $http({
                method:'get',
                url:'mysupport/sds/findLoggerInfo',
                params:params
            }).then(function (resp) {
                var logData = resp.data.data;
                console.log(resp.data);
                console.log(resp.data.cursor);
                for(var i = 0;i<logData.length;i++){
                    $scope.logDatas.push(logData[i]);
                }
                $scope.cursor = resp.data.cursor;
                $scope.busy = false;
            })
        }
    }
}
]);


mysupport.controller('dateStart', ["$rootScope","$scope", "$http", function ($rootScope,$scope, $http) {
    $scope.$on('selectDate', function (e, newName) {
        var html = ''
        for (var i = 0; i < newName.length; i++) {
            if (i < 2) {
                html += newName[i] + "-";
            } else {
                html += newName[i];
            }
        }
        $scope.starts = html;
        $rootScope.start = html;
        if(newName.length == 3){
            $scope.isShowStart = !$scope.isShowStart;
        }
        $rootScope.isShowStart = $scope.isShowStart;
    })
}]);
mysupport.controller('dateEnd', ["$rootScope","$scope", "$http", function ($rootScope,$scope, $http) {
    $scope.$on('selectDate', function (e, newName) {
        var html = ''
        for (var i = 0; i < newName.length; i++) {
            if (i < 2) {
                html += newName[i] + "-";
            } else {
                html += newName[i];
            }
        }
        $scope.ends = html;
        $rootScope.end = html;
        if(newName.length == 3){
            $scope.isShowEnd = !$scope.isShowEnd
        }
        $rootScope.isShowEnd = $scope.isShowEnd;
    })
}]);
