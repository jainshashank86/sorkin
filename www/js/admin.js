var novaSignatureAdminApp = angular.module('novaSignatureAdminApp', [
    'ngRoute',
    'ngResource',
    'novaSignatureAdminControllers', 'ui.bootstrap'
]);


novaSignatureAdminApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.
        when('/dashboard', {
            templateUrl: '/pages/admin-dashboard.html',
            controller: 'DashboardCtrl'
        }).
        when('/settings', {
            templateUrl: '/pages/admin-settings.html',
            controller: 'SettingsCtrl'
        }).
        when('/customers', {
            templateUrl: '/pages/admin-customers.html',
            controller: 'CustomersCtrl'
        }).
        when('/customers/form/', {
            templateUrl: '/pages/admin-customer-form.html',
            controller: 'CustomerFormCtrl'
        }).
        when('/testing', {
            templateUrl: '/pages/admin-testing.html',
            controller: 'TestingCtrl'
        }).
        otherwise({
            redirectTo: '/dashboard'
        });

        $httpProvider.defaults.cache = true;

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

        $locationProvider.html5Mode(true);

    }
]);


var novaSignatureAdminControllers = angular.module('novaSignatureAdminControllers', []);

novaSignatureAdminApp.factory("Key", function($resource) {
    return $resource("/a/clientid");
});

novaSignatureAdminControllers.controller('DashboardCtrl', ['$scope', '$http',
    function($scope) {
        console.log('in admin dashboard ctrl y');

    }
]);


novaSignatureAdminControllers.controller('CustomersCtrl', ['$scope', '$http',
    function($scope, $http) {

        customerList = '/a/customer';
        $scope.selectedCust = {};

        $scope.editCust = function(id) {
            if (id == 'new') {
                window.location.assign("/admin/customers/form?id=" + "new");
            } else {
                window.location.assign("/admin/customers/form?id=" + id);
            }
        }

        $http.get(customerList).success(function(data, status, headers, config) {
            $scope.customers = data;
            $scope.loaded = true;
        });

        $scope.configureCust = function() {
            window.location.assign("/admin/customers/form/");
        }

        $scope.deleteCust = function(){

            angular.forEach($scope.selectedCust, function(value, key) {
                if (value == true) {
                	$scope.deleteUrl = '/a/customer/' + key;
                    $http.delete($scope.deleteUrl).success(function(data, status, headers, config) {
                        window.location.assign("/admin/customers");
                    })
                }
            })
        }
    }
]);


novaSignatureAdminControllers.controller('CustomerFormCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $scope.id = $routeParams.id;
        if ($scope.id == 'new') {
            $scope.edit = true;
            $scope.htmlcontent = ' ';
        } else {
            $scope.edit = false;
            if ($scope.id == null) {
                window.location.assign("/admin/customers");
            }
        }

        if ($scope.id != 'new') {
            $scope.custid = $scope.id;
            $scope.custUrl = '/a/customer/' + $scope.id;

            $http.get($scope.custUrl).success(function(data, status, headers, config) {
                $scope.custid = $scope.id;
                $scope.adminId = data.domain_admin;
            })
        }


        $scope.saveCustomer = function() {
            body = {
                'domain_admin': $scope.adminId
            };

            if($scope.custid == undefined){
                $scope.alert = {
                        type: 'danger',
                        msg: 'Please provide customer ID',
                        show: true
                    };
                return;
            }

            if($scope.adminId == undefined){
                $scope.alert = {
                        type: 'danger',
                        msg: 'Please provide Admin ID',
                        show: true
                    };
                return;
            }

            createCustUrl = '/a/customer/' + $scope.custid;

            if ($scope.id == 'new') {
            	// TODO: To cross check if customer is to be created by put method or CustomerAPI Post method.As of now, no Customer API POST method available so doing it other way
                $http.put(createCustUrl, body).success(function(data, status, headers, config) {
                        console.log('successfully created customer');
                        window.location.assign("/admin/customers")
                    })
                    .error(function(data, status, headers, config) {
                        $scope.alert = {
                            type: 'danger',
                            msg: 'Error in Creating Customer : ' + data.message,
                            show: true
                        };

                    });
            }
            else
            {
                createCustUrl = '/a/customer/' + $scope.custid;
                $http.put(createCustUrl, body).success(function(data, status, headers, config) {
                        console.log('successfully updated customer');
                        window.location.assign("/admin/customers")
                    })
                    .error(function(data, status, headers, config) {
                        $scope.alert = {
                            type: 'danger',
                            msg: 'Error : ' + data.message,
                            show: true
                        };
                    });
            }
        }

        $scope.backMain = function() {
            window.location.assign("/admin/customers");
        }

        $scope.closeAlert = function(index) {
            $scope.alert.show = false;
        }
    }
]);

novaSignatureAdminControllers.controller('SettingsCtrl', ['$scope', '$http', "Key",
    function($scope, $http, Key) {
        $scope.key = Key.get();

        $scope.upload_key = function() {
            var element = $('#keyfile')[0];
            var file = element.files[0];
            $http({
                method: 'PUT',
                url: '/a/clientid',
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                data: file
            }).success(function() {
                console.log('ok!');

                try {
                    element.value = null;
                } catch (err) {
                    element.parentNode.replaceChild(element.cloneNode(true), element);
                }

                window.location.assign("/admin/settings")

            });
        };

    }
]);

novaSignatureAdminControllers.controller('TestingCtrl', ['$scope', '$http',
    function($scope, $routeParams) {
        console.log('in admin testing ctrl');
    }
]);