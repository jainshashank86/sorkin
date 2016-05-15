var performAccel = angular.module('performAccel');

performAccel.controller('sidebarCtrl', function ($scope, $location, $http, statusService, $window,getUserData) {

	getUserData.getData()
        .then(function(resp) {
        	console.log('Called sesion service');
        	console.log(resp);
        	$scope.userName = resp.first_name;



        });


});