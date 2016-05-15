var performAccel = angular.module('performAccel');

performAccel.controller('ereviewCtrl', function ($scope, $location, $http, statusService,getUserData) {



	getUserData.getData()
    .then(function(resp) {
    	console.log('Called sesion service');
    	console.log(resp);
    	$scope.userName = resp.first_name;


	$scope.activate = true;
	// to do stuff

	$scope.submitReview = function() {
		$scope.erCompleted = statusService.erCompleted = true;
		console.log($scope.erCompleted);
		$location.path("/home");

	}

    });
});