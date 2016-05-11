novaSignatureControllers.controller('RulesCtrl', ['$scope', '$modal', '$http', 'SessionDetails', 'RulesService',
    function($scope, $modal, $http, SessionDetails, RulesService, $routeParams) {
        $scope.edit = true;
        $scope.loaded = false;
        $scope.selectedRules = {};
        SessionDetails.getSession()
            .then(function(results) {
                $scope.val = results;
                $scope.custid = results.custid;
                $scope.email = results.email;

                $scope.rulesurl = '/a/customer/' + $scope.custid + '/rule';
                $http.get($scope.rulesurl).success(function(data, status, headers, config) {
                    $scope.loaded = true;
                    $scope.ruleslist = data;
                })

                $scope.editRule = function(id) {
                    if (id == 'new') {
                        window.location.assign("/panel/rules/form/?id=" + "new");
                    } else {
                        window.location.assign("/panel/rules/form/?id=" + id);
                    }
                }

                $scope.selectAll = function() {

                    for (i = 0; i < $scope.ruleslist.length; i++) {
                        $scope.selectedRules[$scope.ruleslist[i]._id] = true;
                    }
                }

                $scope.unSelectAll = function() {

                    for (i = 0; i < $scope.ruleslist.length; i++) {
                        $scope.selectedRules[$scope.ruleslist[i]._id] = false;
                    }
                }

                $scope.apply = function(id) {
                    $scope.loaded = false;
                    $scope.applyUrl = '/a/customer/' + $scope.custid + '/rule/' + id + '/apply'
                    $http.post($scope.applyUrl).success(function(data, status, headers, config) {
                            $scope.loaded = true;
                            $scope.result = data;
                            var modalInstance = $modal.open({
                                templateUrl: 'RulesSubmitted.html',
                                controller: 'RuleModalCtrl',
                                windowClass: "center-modal",
                                size: 'sm',
                            });
                        })
                        .error(function(data, status, headers, config) {
                            $scope.loaded = true;
                            $scope.alert = {
                                type: 'danger',
                                msg: data.message,
                                show: true
                            };
                        })
                }

                $scope.applyAll = function() {
                    $scope.applyAll = '/a/customer/' + $scope.custid + '/apply'
                    $http.post($scope.applyAll).success(function(data, status, headers, config) {
                        var modalInstance = $modal.open({
                            templateUrl: 'RulesSubmitted.html',
                            controller: 'RuleModalCtrl',
                            windowClass: "center-modal",
                            size: 'sm',
                        });
                    })
                    .error(function(data, status, headers, config) {
                        $scope.loaded = true;
                        $scope.alert = {
                            type: 'danger',
                            msg: data.message,
                            show: true
                        };
                    })
                }

                $scope.backRule = function() {
                    window.location.assign("/panel/rules");
                }

                $scope.closeAlert = function(index) {
                    $scope.alert.show = false;
                }

                $scope.deleteRules = function() {
                    angular.forEach($scope.selectedRules, function(value, key) {
                        if (value == true) {
                            $scope.deleteUrl = '/a/customer/' + $scope.custid + '/rule/' + key;
                            $http.delete($scope.deleteUrl).success(function(data, status, headers, config) {
                                window.location.assign("/panel/rules");
                            })
                        }
                    })

                }

            })
    }
]);

novaSignatureControllers.controller('RuleModalCtrl', function($scope, $http, $modalInstance) {
    $scope.ok = function() {
        $modalInstance.dismiss('ok');
    };
});
novaSignatureControllers.controller('RuleFormCtrl', ['$scope', '$http', '$modal', '$location', '$routeParams', 'SessionDetails', 'RulesService',
    function($scope, $http, $modal, $location, $routeParams, SessionDetails, RulesService) {

        $scope.availableOrgs = [];
        $scope.ounames = ['/'];
        counter = 1; // This is for preventing Auto complete list to appear during page load of editing Rule page
        $scope.loaded = false;
        eligibleForRoot = true;
        $scope.id = $routeParams.id;
        $location.search('id', null);
        if ($scope.id == 'new') {
            $scope.edit = true;
            $scope.deleteClass = "col-md-offset-8" // This is to maintain alignment. As for Edit rule, Delete option also appear.
        } else {
            $scope.deleteClass = "col-md-offset-4"
            $scope.edit = false;
            $scope.ruleid = $scope.id;
            if ($scope.id == null) {
                window.location.assign("/panel/rules")
            }
        }
        SessionDetails.getSession()
            .then(function(results) {
                $scope.val = results;
                $scope.custid = $scope.val.custid;
                orgUnitsApi = '/a/customer/' + $scope.custid + '/orgunits'
                $http.get(orgUnitsApi).success(function(data, status, headers, config) {

                        RulesService.getRulesData($scope.custid)
                            .then(function(results) {
                                $scope.siglist = results.siglist;

                                for (i = 0; i < data.organizationUnits.length; i++) {

                                    $scope.ounames.push(data.organizationUnits[i].orgUnitPath); // prepearing list of all Org units in a domain

                                    if (data.organizationUnits[i].rule == undefined) {
                                        $scope.availableOrgs.push(data.organizationUnits[i].orgUnitPath)
                                    } else if (data.organizationUnits[i].rule == $scope.id) {
                                        $scope.availableOrgs.push(data.organizationUnits[i].orgUnitPath)
                                    } else {
                                        eligibleForRoot = false;
                                    }
                                }

                                copyOfAllOrgs = $scope.ounames;
                                $scope.loaded = true;

                                if (eligibleForRoot) {
                                    $scope.availableOrgs.push('/')
                                }

                                if ($scope.id != 'new') {
                                    $scope.ruleUrl = '/a/customer/' + $scope.custid + '/rule/' + $scope.ruleid;
                                    $http.get($scope.ruleUrl).success(function(data, status, headers, config) {
                                        counter = 0;
                                        $scope.selection = data.org_unit
                                        document.getElementById('sigid').value = data.signature_id;
                                        $scope.title = data.title;
                                        $scope.ounames = [];
                                    })
                                }

                                $scope.valueTyped = function() // This logic is required because of bug in auto-complete . that if ngModel already possess a data value then dropdown autocomplete option appears on page load also , which looks very ugly.(https://github.com/JustGoscha/allmighty-autocomplete/issues/47)
                                    {
                                        if (counter >= 1) {
                                            $scope.ounames = copyOfAllOrgs;
                                        }
                                        counter = counter + 1;
                                    }

                                $scope.saveRule = function() {
                                    if ($scope.selection == '' || $scope.selection == undefined) {
                                        $scope.alert = {
                                            type: 'danger',
                                            msg: 'Please select Org Units',
                                            show: true
                                        };
                                        return;
                                    }

                                    if (copyOfAllOrgs.indexOf($scope.selection) == -1) {
                                        $scope.alert = {
                                            type: 'danger',
                                            msg: 'Invalid Org Unit',
                                            show: true
                                        };
                                        return;
                                    }

                                    if ($scope.availableOrgs.indexOf($scope.selection) == -1) {
                                        if ($scope.selection == '/') {
                                            message = 'Child organizations already present in other rule';
                                        } else {
                                            message = 'Selected Org Unit is already present in some other rule';
                                        }
                                        $scope.alert = {
                                            type: 'danger',
                                            msg: message,
                                            show: true
                                        };
                                        return;
                                    }

                                    if (document.getElementById('sigid').value == '?' || document.getElementById('sigid').value == '') {
                                        $scope.alert = {
                                            type: 'danger',
                                            msg: 'Please select Signature Template',
                                            show: true
                                        };
                                        return;
                                    }
                                    if ($scope.title == undefined) {
                                        $scope.alert = {
                                            type: 'danger',
                                            msg: 'Please provide Rule title',
                                            show: true
                                        };
                                        return;
                                    }

                                    body = {
                                        'title': $scope.title,
                                        'org_unit': $scope.selection,
                                        'signature_id': document.getElementById('sigid').value
                                    };

                                    if ($scope.edit == true) {
                                        $scope.createurl = '/a/customer/' + $scope.custid + '/rule';
                                        $http.post($scope.createurl, body).success(function(data, status, headers, config) {
                                                window.location.assign("/panel/rules");
                                            })
                                            .error(function(data, status, headers, config) {
                                                $scope.loaded = true;
                                                $scope.alert = {
                                                    type: 'danger',
                                                    msg: 'Error in posting rule : ' + data.message,
                                                    show: true
                                                };
                                            })
                                    } else {
                                        $scope.updateRule = '/a/customer/' + $scope.custid + '/rule/' + $scope.id
                                        $http.put($scope.updateRule, body).success(function(data, status, headers, config) {
                                                window.location.assign("/panel/rules");
                                            })
                                            .error(function(data, status, headers, config) {
                                                $scope.loaded = true;
                                                $scope.alert = {
                                                    type: 'danger',
                                                    msg: 'Error in updating rule : ' + data.message,
                                                    show: true
                                                };
                                            })
                                    }
                                }

                                $scope.backRule = function() {
                                    window.location.assign("/panel/rules");
                                }
                                $scope.deleteRule = function() {
                                    $scope.ruleUrl = '/a/customer/' + $scope.custid + '/rule/' + $scope.ruleid;
                                    $http.delete($scope.ruleUrl).success(function(data, status, headers, config) {
                                        window.location.assign("/panel/rules");
                                    })
                                }
                                $scope.closeAlert = function(index) {
                                    $scope.alert.show = false;
                                }
                            })
                    })
                    .error(function(data, status, headers, config) {
                        $scope.loaded = true;
                        $scope.alert = {
                            type: 'danger',
                            msg: 'Oops .. Some error has occured : ' + data.message,
                            show: true
                        };
                    })
            })
    }
]);