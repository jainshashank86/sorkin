var performAccel = angular.module('performAccel');

performAccel.controller('homeCtrl', function ($scope, $location, $http, statusService, $window,getUserData) {

	getUserData.getData()
        .then(function(resp) {
        	console.log('Called sesion service');
        	console.log(resp);


        	$scope.userName = resp.first_name;



	$scope.activate = true;
	angular.element($window).scrollTop(0);
	$scope.mpCompleted = statusService.mpCompleted;
	$scope.erCompleted = statusService.erCompleted;
	// console.error($scope.mpCompleted);
	// console.error($scope.erCompleted);
	// to do stuff

	$scope.newPage = function(pageType) {
		if (pageType === 1) {
			$location.path("/mpreview");
		} else if (pageType === 2) {
			$location.path("/ereview");
		}

	}

        });


});