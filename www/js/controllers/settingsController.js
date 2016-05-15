var performAccel = angular.module('performAccel');

performAccel.controller('settingsCtrl', function ($scope, $location, $http, $anchorScroll) {
	$scope.activate = true;
	$scope.showProfile=false;
	$scope.showinviteRater=false;
	$scope.showManage=false;
	$scope.showAccept=false;
	$scope.showOption = false;
	// to do stuff
	$scope.collapse=function(option, newHash1) {
		//alert('show');
				
  //     	if (option == 0) {
		// 	$scope.showinviteRater=false;
		// 	$scope.showManage=false;
		// 	$scope.showAccept=false;
		// 	$scope.showProfile=!$scope.showProfile;
		// } else if (option == 1) {
		// 	$scope.showProfile=false;
		// 	$scope.showManage=false;
		// 	$scope.showAccept=false;
		// 	$scope.showinviteRater=!$scope.showinviteRater;
		// } else if (option == 2) {
		// 	$scope.showProfile=false;
		// 	$scope.showinviteRater=false;
		// 	$scope.showAccept=false;
		// 	$scope.showManage=!$scope.showManage;
		// } else if (option == 3) {
		// 	$scope.showProfile=false;
		// 	$scope.showinviteRater=false;
		// 	$scope.showManage=false;
		// 	$scope.showAccept=!$scope.showAccept;
		// }
		var newHash = newHash1;
		if ($location.hash() !== newHash) {
        
        	$location.hash(newHash);
      	} else {
        
        	$anchorScroll();
      	}
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