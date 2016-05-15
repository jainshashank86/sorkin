var performAccel = angular.module('performAccel');

performAccel.controller('sidebarCtrl', function ($scope, $location, $http, statusService, $window) {

        	$scope.logout = function(){
        		$.jStorage.deleteKey("Sorkin_Session");
        		window.location.assign('/#login');
        	};

});