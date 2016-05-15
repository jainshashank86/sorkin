var performAccel = angular.module('performAccel');

performAccel.controller('mpreviewCtrl', function ($scope, $location, $http, statusService) {
	$scope.activate = true;
	// to do stuff
	

	$scope.submitPreview = function() {
		$scope.mpCompleted = statusService.mpCompleted = true;
		console.log($scope.mpCompleted);
		$location.path("/home");

	}
});