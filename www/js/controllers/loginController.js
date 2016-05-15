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

		subData = {'email' : $scope.email  , 'password' : $scope.password ,  'role' : $scope.role,'company' : $scope.company, 'first_name' : $scope.fname , 'last_name' : $scope.lname}

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
		console.log('login')
		$scope.showsignup = false;
		$scope.validateUser();
	}

	$scope.validateUser = function() {

		console.log('Validating ...')

		if($scope.username != "" || $scope.password != null) {

			console.log('Inside');

			var subData = {
			"username":$scope.username,
			"password":$scope.password
			};

			console.log('Calling URL');
			$http.put('/a/customer/' + $scope.username + '/verify', subData).success(function(data) {
				$scope.response = data;
				console.log('After verifying user pass');

				 console.log('Success');
				 $.jStorage.set("Sorkin_Session", data);
                 $.jStorage.setTTL("Sorkin_Session", 24 * 60 * 60 * 1000);

				window.location.assign('/');

			})
			.error(function(data){

				console.log(data);
				alert(data.message);
				console.log('Ohh error in calling URL');
			})

		}
	}

});