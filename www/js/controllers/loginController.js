var performAccel = angular.module('performAccel');

performAccel.controller('loginCtrl', function ($scope, $location, $http) {
	$scope.activate = true;
	$scope.showsignup = false;
	// to do stuff
	$('.message a').click(function(){
	   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
	});

	$scope.saveUser = function(){

		signupUrl = '/a/customer/' + $scope.email;

		subData = {'username' : $scope.userName  , 'password' : $scope.password , 'first_name' : 'Sachin' , 'email': $scope.email}

        $http.post(signupUrl, subData).success(function(data, status, headers, config) {
        	console.log('Success');
        	console.log('Please check ur mail for confirmation');
        })
        .error(function(data, status, headers, config) {
        	console.log('Errored')
        });

	};

	$scope.signup = function() {
		$scope.showsignup = true;
		console.log('Signup page')




	}
	$scope.signin = function() {
		$scope.showsignup = false;
	}

	$scope.validateUser = function() {
		if($scope.id != "" || $scope.pass != null){

			var subData = {
			"id":$scope.id,
			"pass":$scope.pass
			};

			$http.post('/authenticate', subData).success(function(data) {
				$scope.response = data;
				console.log($scope.response.status);
				if ($scope.response.status) {
					$scope.activate = false;
					$location.path("/home");
					//$scope.user = $scope.id;
					//mySessionService.user=$scope.reponse.user;

			    	//$rootScope.$broadcast('logInUser');
				} else {
					alert('incorrect id or password');
				}
			});
		}
	}

});