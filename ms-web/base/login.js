//登录逻辑
mysupport.run(['$rootScope', '$state', 'msUser', function($rootScope, $state, msUser) {
    $rootScope.$on('$stateChangeStart', function(event, tostate) {
        if (tostate.name != 'login' && typeof(MS.user) == 'undefined') {
            event.preventDefault();
            $state.go('login', {
                url: window.location.href
            });
            $("#page-loading").show();
        } else if (!msUser.hasPermission(tostate.permission)) {
            event.preventDefault();
            $state.go('noauth');
        }
    });
}]);