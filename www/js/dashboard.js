novaSignatureControllers.controller('DashboardCtrl', ['$scope', '$http', 'SessionDetails',
    function($scope, $http, SessionDetails) {
		console.log('Inside dashboard ctrl')
        SessionDetails.getSession().then(function(results) {
            $scope.val = results;
            $scope.custid = $scope.val.custid;
            reportUrl = '/a/customer/' + $scope.custid + '/report';

            $http.get(reportUrl).success(function(data, status, headers, config) {
            	$scope.loaded = true;

            	for (i = 0; i < data.length ; i++) {
            		var dt = new Date(data[i].start_time * 1000)
            		data[i].start_time =  dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear();
            		}
            	$scope.summaries = data.reverse();
            })
        })
    }
]);