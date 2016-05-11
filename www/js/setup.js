

var steps = {
	login: {
		message: "Looks like App Engine wasn't able to determine who you are.  Please click the Log In button below!",
		login_button: true
	},
	authorize: {
		message: "Looks like we couldn't access your domain.  Please verify that novaSignature is turned on for you and that you are a domain admin.",
		marketplace_button: true,
	},
	activate: {
		message: "Looks like you're all set to get started.  Just click to the 'Activate' button below and you'll be on your way!",
		setup_button: true
	},
	complete: {
		message: "Looks like you've done this before!  You're all set.",
		panel_button: true
	},
	error: {
		message: "Uh oh.  Looks like we couldn't determine your activation status.  Please contact Tempus Nova for help!",
		tech_support: true
	}
};

$(document).ready(function() {

	console.log('ready');

	$.getJSON('/a/setup', function(data) {
		console.log('got status');
		console.log(data);

		step = steps[data.step];
		if (step === undefined) {
			step = steps['error']
		}

		$('#message').html(step.message);

		if (step.login_button) {
			$('#login_button').show();
			$("#login_button").attr("href", data.login_url)
		}
		else
			$('#login_button').hide();

		if (step.panel_button)
			$('#panel_button').show();
		else
			$('#panel_button').hide();

		if (step.setup_button)
			$('#activate_button').show();
		else
			$('#activate_button').hide();

	});

});




/*
var novaSignatureSetupApp = angular.module('novaSignatureSetupApp', [
    'ngRoute',
    'novaSignatureSetupControllers', 'ui.bootstrap', 'ngSanitize'
]);
novaSignatureSetupApp.service('SessionDetails', ['$http', '$q', function($http, $q)
{
    this.getSession = function()
    {
        var deferred = $q.defer();
        setupUrl = '/a/setup';
        $http.get(setupUrl).success(function(data, status, headers, config)
            {
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config)
            {
                alert(data.message);
                if (data.message == 'Please log in' || data.message == 'Only domain Admin can access')
                {
                    window.location.assign(data.login_url);
                }
                else
                {
                    window.location.assign(data.logout_url);
                }
            })
        return deferred.promise;
    }
}])
var novaSignatureSetupControllers = angular.module('novaSignatureSetupControllers', []);
novaSignatureSetupControllers.controller('SetupFormCtrl', ['$scope', '$http', 'SessionDetails', '$modal',
    function($scope, $http, SessionDetails, $modal)
    {
        SessionDetails.getSession()
            .then(function(results)
            {
                $scope.custName = results.domain
                $scope.custid = results.custid;
                $scope.adminId = results.email;
                $scope.domain = results.domain;
                $scope.users = results.email + ',';
                $scope.id = results.id;
                userList = results.userList;
                if (userList != "")
                {
                    userList = userList.filter(function(n)
                    {
                        return n != ""
                    });
                }
                $scope.users = userList.toString();
            })
        $scope.saveCustomer = function()
        {
            validateAdmin = '/a/setup/' + $scope.custid + '/validate/' + $scope.adminId;
            if ($scope.adminId == '')
            {
                var modalInstance = $modal.open(
                {
                    templateUrl: 'SetupErrorTmpl.html',
                    controller: 'SetupErrorCtrl',
                    windowClass: "modal fade in",
                    size: 'sm',
                    resolve:
                    {
                        message: function()
                        {
                            return 'Please provide Admin ID'
                        },
                        header: function()
                        {
                            return 'Error in Configuration'
                        }
                    }
                });
                return;
            }
            $http.get(validateAdmin).success(function(data, status, headers, config)
                {
                    isLicensed = data.state;
                    isEnabled = data.enabled;
                    isAdmin = data.isAdmin;
                    if (!((isLicensed == 'ACTIVE') && isEnabled && isAdmin))
                    {
                        message = '<ul>Please ensure <br><br><li><small>Admin ID belongs to the same domain</small></li><li><small>Application is <mark>Turned ON</mark> for the organization unit of which Admin is a part</small></li></ul>'
                        var modalInstance = $modal.open(
                        {
                            templateUrl: 'SetupErrorTmpl.html',
                            controller: 'SetupErrorCtrl',
                            windowClass: "modal fade in",
                            resolve:
                            {
                                message: function()
                                {
                                    return message
                                },
                                header: function()
                                {
                                    return 'Not a Valid Admin ID'
                                }
                            }
                        });
                        $scope.adminId = ' ';
                        return;
                    }
                    body = {
                        'name': $scope.custName,
                        'custid': $scope.custid,
                        'admin': $scope.adminId,
                        'users': $scope.users,
                        'domain': $scope.domain,
                        'billing': 'Done'
                    };
                    createCustUrl = '/a/customer';
                    if ($scope.id == 'new')
                    {
                        $http.post(createCustUrl, body).success(function(data, status, headers, config)
                            {
                                window.location.assign("/panel/dashboard")
                            })
                            .error(function(data, status, headers, config)
                            {
                                var modalInstance = $modal.open(
                                {
                                    templateUrl: 'SetupErrorTmpl.html',
                                    controller: 'SetupErrorCtrl',
                                    windowClass: "modal fade in",
                                    size: 'sm',
                                    resolve:
                                    {
                                        message: function()
                                        {
                                            return data.message
                                        },
                                        header: function()
                                        {
                                            return 'Error'
                                        }
                                    }
                                });
                                window.location.assign("/index.html")
                            });
                    }
                    else
                    {
                        updateCustUrl = '/a/customer/' + $scope.id;
                        $http.put(updateCustUrl, body).success(function(data, status, headers, config)
                            {
                                window.location.assign("/panel/dashboard")
                            })
                            .error(function(data, status, headers, config)
                            {
                                //alert(data.message);
                                var modalInstance = $modal.open(
                                {
                                    templateUrl: 'SetupErrorTmpl.html',
                                    controller: 'SetupErrorCtrl',
                                    windowClass: "modal fade in",
                                    size: 'sm',
                                    resolve:
                                    {
                                        message: function()
                                        {
                                            return data.message
                                        },
                                        header: function()
                                        {
                                            return 'Error'
                                        }
                                    }
                                });
                                window.location.assign("/index.html")
                            });
                    }
                })
                .error(function(data, status, headers, config)
                {
                    var modalInstance = $modal.open(
                    {
                        templateUrl: 'SetupErrorTmpl.html',
                        controller: 'SetupErrorCtrl',
                        windowClass: "modal fade in",
                        size: 'sm',
                        resolve:
                        {
                            message: function()
                            {
                                return 'Please check the details'
                            },
                            header: function()
                            {
                                return 'Error'
                            }
                        }
                    });
                    return;
                });
        }
    }
]);
novaSignatureSetupControllers.controller('SetupErrorCtrl', function($scope, $http, $modalInstance, message, header)
{
    //console.log(message)
    $scope.message = message;
    $scope.header = header;
    $scope.ok = function()
    {
        $modalInstance.dismiss('ok');
    };
});
*/
