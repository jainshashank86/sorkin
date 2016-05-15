var performAccel = angular.module('performAccel');

performAccel.controller('ereviewCtrl', function ($scope, $location, $http, statusService) {
	$scope.activate = true;
	// to do stuff

	$scope.submitReview = function() {
		$scope.erCompleted = statusService.erCompleted = true;
		console.log($scope.erCompleted);
		$location.path("/home");

	}
});