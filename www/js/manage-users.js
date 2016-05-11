novaSignatureControllers.controller('ManageUsersCtrl', ['$scope', '$http', 'SessionDetails',
    function($scope, $http, SessionDetails) {
        $scope.loaded = false;
        $scope.domainAdmin = false;
        $scope.tags = [];
        $scope.newUsers = []
        SessionDetails.getSession()
            .then(function(results) {
                $scope.val = results;
                $scope.custid = $scope.val.custid;
                $scope.domainAdmin = results.isDomainAdmin;
                custid = results.custid;
                if (!results.isDomainAdmin) {
                    window.location.assign("/panel/dashboard");
                } else {
                    $scope.loaded = true;
                    $scope.userList = results.signature_admins;
                }
                $scope.removeUser = function(user) {
                    index = $scope.userList.indexOf(user);
                    if (index > -1) {
                        $scope.userList.splice(index, 1);
                    }
                    $scope.ok()
                }
                users = [];
                $scope.loadUsers = function($query) {
                    searchUser = '/a/customer/' + results.custid + '/users?q=' + $query;
                    $http.get(searchUser).success(function(data, status, headers, config) {
                        users = data.users;
                    });
                    return users.filter(function(user) {
                        return user.primaryEmail.toLowerCase().indexOf($query.toLowerCase()) != -1;
                    });
                };

                $scope.ok = function() {
                    $scope.updateCust = '/a/customer/' + $scope.custid;
                    for (i = 0; i < $scope.tags.length; i++) {
                        $scope.newUsers.push($scope.tags[i].primaryEmail)
                    }

                    if ($scope.newUsers.length > 0) {
                        var uniqueNames = [];
                        uniqueNames.push($scope.userList, $scope.newUsers)
                        uniqueNames = uniqueNames.reduce(function(a, b) { // This is to flatten the array
                            return a.concat(b);
                        });

                        uniqueNames = uniqueNames.join(',').toLowerCase().split(',');
                        uniqueNames = uniqueNames.filter(function(item, i, ar) {
                            return ar.indexOf(item) === i;
                        }); // This is for removing duplicate entries

                        body = {
                            'signature_admins': uniqueNames,
                            'domain_admin': results.userEmail
                        }
                    } else {
                        body = {
                            'signature_admins': $scope.userList,
                            'domain_admin': results.userEmail
                        }
                    }
                    $http.put($scope.updateCust, body).success(function(data, status, headers, config) {
                            window.location.assign("/panel/users");
                        })
                        .error(function(data, status, headers, config) {
                            $scope.alert = {
                                type: 'danger',
                                msg: data.message,
                                show: true
                            };
                        })
                };

                $scope.cancel = function() {
                    window.location.assign("/panel/users");
                }


                $scope.closeAlert = function(index) {
                    $scope.alert.show = false;
                }

            })
    }
]);