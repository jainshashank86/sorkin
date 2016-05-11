var novaSignatureApp = angular.module('novaSignatureApp', [
    'ngRoute',
    'novaSignatureControllers','autocomplete', 'textAngular', 'ngSanitize', 'googlechart',
    'ui.bootstrap',  'ngTagsInput'
]);

novaSignatureApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.
        when('/dashboard', {
            templateUrl: '/pages/dashboard.html',
            controller: 'DashboardCtrl'
        }).
        when('/images', {
            templateUrl: '/pages/images.html',
            controller: 'ImagesCtrl'
        }).
        when('/signatures', {
            templateUrl: '/pages/signatures.html',
            controller: 'SignaturesCtrl'
        }).
        when('/signatures/form/?', {
            templateUrl: '/pages/signature-form.html',
            controller: 'SignatureFormCtrl',
            reloadOnSearch: false
        }).
        when('/rules', {
            templateUrl: '/pages/rules.html',
            controller: 'RulesCtrl'
        }).
        when('/rules/form/?', {
            templateUrl: '/pages/rule-form.html',
            controller: 'RuleFormCtrl',
            reloadOnSearch: false
        }).
        when('/users', {
            templateUrl: '/pages/manage-users.html',
            controller: 'ManageUsersCtrl'
        }).
        when('/testing', {
            templateUrl: '/pages/testing.html',
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

novaSignatureApp.run(function($rootScope) {
    var dropMenuTemplate = '<div class="dropdown insert-var-container" style="padding:0px;">';
    dropMenuTemplate += '<button class="btn-sm  btn-default dropdown-toggle" data-toggle="dropdown" ng-mouseup="focusHack()">';
    dropMenuTemplate += '<span class = "glyphicon glyphicon-list">&nbsp;&nbsp;</span><span class="caret"></span>';
    dropMenuTemplate += '</button>';
    dropMenuTemplate += '<ul class="dropdown-menu">';
    dropMenuTemplate += '<li><a ng-click="AddName()">Name</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddFirstName()">Given Name</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddLastName()">Family Name</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddWorkPhone()">Work Phone</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddHomePhone()">Home Phone</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddMobilePhone()">Mobile</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddWorkAddress()">Work Address</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddHomeAddress()">Home Address</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddManager()">Manager</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddTitle()">Title</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddEmployeeId()">Employee Id</a></li>';
    dropMenuTemplate += '<li><a ng-click="AddPrimaryEmail()">Primary EmailId</a></li>';
    dropMenuTemplate += '</ul>';
    dropMenuTemplate += '</div>';
    $rootScope.textAngularTools = {};
    $rootScope.textAngularTools.dropDown = {
        display: dropMenuTemplate,

        AddPrimaryEmail: function() {
            this.$parent.wrapSelection('insertHTML', '{{ emails|provide("primary",true,"address") }}');
        },
        AddName: function() {
            this.$parent.wrapSelection('insertHTML', '{{name.fullName}}');
        },
        AddFirstName: function() {
            this.$parent.wrapSelection('insertHTML', '{{name.givenName}}');
        },
        AddLastName: function() {
            this.$parent.wrapSelection('insertHTML', '{{name.familyName}}');
        },
        AddWorkPhone: function() {
            this.$parent.wrapSelection('insertHTML', '{{ phones|provide("type","work","value") }}'); // This needs to be changed may be to lambda function
        }, //next((x for x in user.phones if x.type == "work	"), None)
        AddHomePhone: function() {
            this.$parent.wrapSelection('insertHTML', '{{ phones|provide("type","home","value") }}'); // This needs to be changed may be to lambda function
        },
        AddMobilePhone: function() {
            this.$parent.wrapSelection('insertHTML', '{% for entry in phones %}{% if entry.type == "mobile" %}{{entry.value}}{% endif %}{% endfor %}');
        },
        AddWorkAddress: function() {
            this.$parent.wrapSelection('insertHTML', '{{addresses[0].value}}'); // This needs to be changed may be to lambda function
        },
        AddHomeAddress: function() {
            this.$parent.wrapSelection('insertHTML', '{{addresses[1].value}}'); // This needs to be changed may be to lambda function
        },
        AddManager: function() {
            this.$parent.wrapSelection('insertHTML', '{{relations[0].value}}'); // This needs to be changed may be to lambda function
        },
        AddTitle: function() {
            this.$parent.wrapSelection('insertHTML', '{{organizations.title}}'); // This needs to be changed may be to lambda function
        },
        AddEmployeeId: function() {
            this.$parent.wrapSelection('insertHTML', '{{externalIds.value}}');
        },
        activeState: function() {
                return false;
            } //If this returns true then the ta-toolbar-button-active-class will be applied to the button.
    };
})

// Below directive will be used for uploading image file
novaSignatureApp.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


novaSignatureApp.service('SessionDetails', ['$http', '$q', function($http, $q) {
    this.getSession = function() {
        var deferred = $q.defer();
        $http.get('/a/session').success(function(data, status, headers, config) {
            if (data.authorized != true) {
                window.location.assign(data.logout_url);
            }

            sessDetails = {
                isAuthorizedUser: data.authorized,
                custid: data.customer_id,
                isDomainAdmin: data.domain_admin,
                logoutUrl: data.logout_url,
                userEmail: data.email,
                isAppEngineAdmin: data.appengine_admin,
                roles: data.roles,
                loginUrl: data.login_url,
                signature_admins: data.signature_admins
            };

            deferred.resolve(sessDetails);
        })
        return deferred.promise;
    }
}])


novaSignatureApp.service('fileUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .success(function() {
                window.location.assign("/panel/images");
            })
            .error(function() {});
    }
}]);

novaSignatureApp.service('RulesService', ['$http', '$q', function($http, $q) {
    this.getRulesData = function(custid) {
        var deferred = $q.defer();
        sigUrl = '/a/customer/' + custid + '/signature'
        $http.get(sigUrl).success(function(data, status, headers, config) {
            siglist = data;
            rulesUrl = '/a/customer/' + custid + '/rule';
            $http.get(rulesUrl).success(function(data2, status, headers, config) {
                ruleslist = data2;
                result = {
                    'siglist': siglist,
                    'rulesList': ruleslist
                }
                deferred.resolve(result)
            })
        })
        return deferred.promise;
    }
}])

var novaSignatureControllers = angular.module('novaSignatureControllers', []);
novaSignatureControllers.controller('PanelCtrl', ['$scope', '$http', 'SessionDetails',
    function($scope, $http, SessionDetails) {

        SessionDetails.getSession()
            .then(function(results) {
                $scope.domainAdmin = results.isDomainAdmin;
                $scope.loaded = true;
                $scope.val = results;
                $scope.logoutUrl = results.logoutUrl;
                $scope.nickname = results.nickname;
                $scope.userEmail = results.userEmail + ' | <u><a href="' + $scope.logoutUrl + '"> Sign out</a></u>  ';
            })
    }
]);

novaSignatureControllers.controller('SettingsCtrl', ['$scope', '$http',
    function($scope, $routeParams) {
        console.log('in settings ctrl');
    }
]);
novaSignatureControllers.controller('TestingCtrl', ['$scope', '$http',
    function($scope, $routeParams) {
        console.log('in testing ctrl');
    }
]);