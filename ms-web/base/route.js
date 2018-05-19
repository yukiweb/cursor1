//路由控制
mysupport.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('/', '/home').otherwise('/home');
    $stateProvider.state('index', {
        url: '/',
        views: {
            'header': {
                templateUrl: 'html/common/header.html'
            },
            'content': {
                templateUrl: 'html/common/content.html'
            },
            'footer': {
                templateUrl: 'html/common/footer.html'
            }
        }
    }).state('index.home', {
        url: 'home',
        views: {
            'home': {
                templateUrl: 'html/home/home.html'
            }
        }
    }).state('index.setting', {
        url: 'setting',
        views: {
            'left': {
                templateUrl: 'html/setting/setting.html'
            }
        }
    }).state('index.setting.app', {
        url: '/appMngt',
        views: {
            'right@index': {
                templateUrl: 'html/appMngt/appList.html'
            }
        }
    }).state('index.setting.system', {
        url: '/resoMngt',
        views: {
            'right@index': {
                templateUrl: 'html/setting/settingRight.html'
            }
        },
        permission:'setting.resource.list'
    }).state('index.setting.createresource', {
        url: '/resoMngtAdd/:type/:resourceId/:resourceType/:parentIds',
        views: {
            'right@index': {
                templateUrl: 'html/setting/settingAdd.html'
            }
        },
        // permission: 'setting.createresource'
    }).state('index.setting.role', {
        url: '/roleMngt',
        views: {
            'right@index': {
                templateUrl: 'html/roleMngt/roleList.html'
            }
        },
        permission: 'setting.role.list'
    }).state('index.setting.addrole', {
        url: '/addRole',
        views: {
            'right@index': {
                templateUrl: 'html/roleMngt/roleAdd.html'
            }
        },
        permission: 'setting.role.create'
    }).state('index.setting.viewrole', {
        url: '/viewRole/:roleId',
        views: {
            'right@index': {
                templateUrl: 'html/roleMngt/roleView.html'
            }
        },
        permission: 'setting.role.byId'
    }).state('index.setting.modifyrole', {
        url: '/modifyRole/:roleId',
        views: {
            'right@index': {
                templateUrl: 'html/roleMngt/roleModify.html'
            }
        },
        permission: 'setting.role.update'
    }).state('index.setting.successrole', {
        url: '/successRole/:roleId',
        views: {
            'right@index': {
                templateUrl: 'html/roleMngt/roleSuccess.html'
            }
        }
    }).state('index.customerservice', {
        url: 'customerservice',
        views: {
            'left': {
                templateUrl: 'html/customerservice/customerserviceLeft.html'
            }
        }
    }).state('index.customerservice.service', {
        url: '/:url',
        views: {
            'right@index': {
                templateUrl: 'html/customerservice/customerserviceRight.html'
            }
        }
    }).state('index.setting.readapp', {
        url: '/appDetails/:type/:businessId',
        views: {
            'right@index': {
                templateUrl: 'html/appMngt/appDetails.html'
            }
        },
        permission: 'setting.app.byId'
    }).state('index.setting.createapp', {
        url: '/appAdd',
        views: {
            'right@index': {
                templateUrl: 'html/appMngt/appAdd.html'
            }
        },

        permission: 'setting.app.create'
    }).state('index.setting.logMngt', {
        url: '/logMngt',
        views: {
            'right@index': {
                templateUrl: 'html/logMngt/logMngt.html'
            }
        }
    }).state('login', {
        url: '/login/:url',
        views: {
            'login': {
                templateUrl: 'html/login/login.html'
            }
        }
    }).state('noauth', {
        url: '/noAuth',
        views: {
            'error': {
                templateUrl: 'html/error/403.html'
            }
        }
    });
}]);