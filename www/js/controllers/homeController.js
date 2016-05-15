var performAccel = angular.module('performAccel');

performAccel.controller('homeCtrl', function ($scope, $location, $http, statusService) {
	$scope.activate = true;
	$scope.mpCompleted = statusService.mpCompleted;
	$scope.erCompleted = statusService.erCompleted;
	console.error($scope.mpCompleted);
	console.error($scope.erCompleted);
	// to do stuff

	$scope.newPage = function(pageType) {
		if (pageType === 1) {
			$location.path("/mpreview");
		} else if (pageType === 2) {
			$location.path("/ereview");
		}

	}
});