var performAccel = angular.module('performAccel');

performAccel.controller('settingsCtrl', function ($scope, $location, $http, $anchorScroll, $window) {
	$scope.activate = true;
	$scope.showProfile=false;
	$scope.showinviteRater=false;
	$scope.showManage=false;
	$scope.showAccept=false;
	$scope.showOption = false;
	// to do stuff

	$scope.collapse=function(option, newHash1) {
		//alert('show');

      	if (option == 0) {
		 	$scope.showinviteRater=false;
			$scope.showManage=false;
			$scope.showAccept=false;
		 	$scope.showProfile=!$scope.showProfile;
		} else if (option == 1) {
		 	$scope.showProfile=false;
		 	$scope.showManage=false;
			$scope.showAccept=false;
			$scope.showinviteRater=!$scope.showinviteRater;
			angular.element($window).scrollTop(300);

		} else if (option == 2) {
		 	$scope.showProfile=false;
		 	$scope.showinviteRater=false;
		 	$scope.showAccept=false;
		 	$scope.showManage=!$scope.showManage;
		 	angular.element($window).scrollTop(425);
		 } else if (option == 3) {
		 	$scope.showProfile=false;
		 	$scope.showinviteRater=false;
		 	$scope.showManage=false;
			$scope.showAccept=!$scope.showAccept;
			angular.element($window).scrollTop(640);
		 }
		// var newHash = newHash1;
		// if ($location.hash() !== newHash) {

        	// $location.hash(newHash1);
      	// } else {

        	// $anchorScroll();
      	// }
	}
	$scope.optionCollapse = function() {
		$scope.showOption = !$scope.showOption;
	}

	$scope.setPosition = function(newHash1) {
		//angular.element("#inviteBlock")[0].scrollTop = 0;
		// $location.hash('inviteBlock');
		// var newHash = newHash1;
		// if ($location.hash() !== newHash) {

  //       	$location.hash(newHash);
  //     	} else {

  //       	$anchorScroll();
  //     	}

	}
});