var performAccelIndex = angular.module('performAccelIndex',[]);

performAccelIndex.controller('indexCtrl', function ($scope, $location) {
	$scope.check = 'checked';
    $scope.showWa = true;

	angular.element('#optHome').click(function(){
    	$("#optHome").addClass("active-menu");
    	$("#optReport").removeClass("active-menu");
    	$("#optSettings").removeClass("active-menu");
	});

	angular.element('#optReport').click(function(){
    	$("#optReport").addClass("active-menu");
    	$("#optHome").removeClass("active-menu");
    	$("#optSettings").removeClass("active-menu");
	});

	angular.element('#optSettings').click(function(){
    	$("#optSettings").addClass("active-menu");
    	$("#optHome").removeClass("active-menu");
    	$("#optReport").removeClass("active-menu");
	});


});

