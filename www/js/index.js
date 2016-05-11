angular.module('ngNovaEnter', [])


.controller('ngNovaindex', function($scope,$http) {
//alert('Inside controller index');


	console.log('Inside conytoller');

	$scope.submit = function(){

		console.log('Submit clicked');

		parameters = {'username' : $scope.userName, 'password' : $scope.password};

		var verifyUrl  = '/a/customer/' + $scope.userName + '/verify';

        $http.put(verifyUrl, parameters).success(function(data, status, headers, config) {
            window.location.assign("/");
        })
        .error(function(data, status, headers, config) {
            alert(data.message);
        })

	};


	$scope.create = function(){

		console.log('Submit clicked');

		parameters = {'username' : $scope.userName, 'password' : $scope.password , 'first_name' : 'pintu'};

		var verifyUrl  = '/a/customer/' + $scope.userName;

        $http.post(verifyUrl, parameters).success(function(data, status, headers, config) {
            window.location.assign("/");
        })
        .error(function(data, status, headers, config) {
            alert(data.message);
              /*  type: 'danger',
                 msg: 'Error in posting rule : ' + data.message,
                show: true*/

        })

	}

});