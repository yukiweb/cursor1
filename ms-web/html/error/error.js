var mysupport = angular.module("mysupport");
mysupport.controller("noAuth", ['$scope', '$state', function($scope, $state) {
    $scope.goPrev = function() {
    	history.back()
    };
    $scope.goHome = function() {
        $state.go("index.home");
    };
    $scope.refresh = function() {
    	location.replace(document.referrer);
    };
}]);