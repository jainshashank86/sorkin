novaSignatureControllers.controller('SignaturesCtrl', ['$scope', '$modal', '$http', 'SessionDetails',
    function($scope, $modal, $http, SessionDetails, $routeParams) {
        $scope.edit = true;
        $scope.loaded = false;
        $scope.selectedSigs = {};
        SessionDetails.getSession()
            .then(function(results) {
                $scope.val = results;
                $scope.custid = $scope.val.custid;
                $scope.url = '/a/customer/' + $scope.custid + '/signature';
                $http.get($scope.url).success(function(data, status, headers, config) {
                    $scope.siglist = data;
                    $scope.loaded = true;
                })
                $scope.editSig = function(id) {
                    if (id == 'new') {
                        window.location.assign("/panel/signatures/form/?id=" + "new");
                    } else {
                        window.location.assign("/panel/signatures/form/?id=" + id);
                    }
                }

                $scope.selectAll = function(){

                	for (i=0;i<$scope.siglist.length;i++){
                		$scope.selectedSigs[$scope.siglist[i]._id] = true;
                	}
                }

                $scope.unSelectAll = function(){

                	for (i=0;i<$scope.siglist.length;i++){
                		$scope.selectedSigs[$scope.siglist[i]._id] = false;
                	}
                }

                $scope.previewSig = function(id, body) {
                    previewUrl = '/a/customer/' + $scope.custid + '/preview/' + results.userEmail;
                    template = {
                        'body': body
                    };

                    $http.post(previewUrl, template).success(function(data, status, headers, config) {
                        var modalInstance = $modal.open({
                            templateUrl: 'SignaturePreview.html',
                            controller: 'ModalInstanceCtrl',
                            windowClass: "modal fade in",
                            resolve: {
                                previewData: function() {
                                    return data.body;
                                }
                            }
                        })
                    })
                }

                $scope.deleteSigs = function() {
                    angular.forEach($scope.selectedSigs, function(value, key) {
                        if (value == true) {
                            $scope.deleteUrl = '/a/customer/' + $scope.custid + '/signature/' + key;
                            $http.delete($scope.deleteUrl).success(function(data, status, headers, config) {
                                window.location.assign("/panel/signatures");
                            })
                        }
                    })
                }

                $scope.backSig = function() {
                    window.location.assign("/panel/signatures");
                }
            })
    }
]);

novaSignatureControllers.controller('ModalInstanceCtrl', function($scope, $http, $modalInstance, previewData) {
    $scope.previewData = previewData;
    $scope.ok = function() {
        $modalInstance.dismiss('ok');
    };
});


novaSignatureControllers.controller('SignatureFormCtrl', ['$scope', '$timeout', '$modal', '$rootScope', '$http', '$location', '$routeParams', 'SessionDetails',
    function($scope, $timeout, $modal, $rootScope, $http, $location, $routeParams, SessionDetails) {
        $scope.loaded = false;
        $scope.id = $routeParams.id;
        $scope.backClass = 'col-md-offset-4';
        $location.search('id', null);
        if ($scope.id == 'new') {
            $scope.edit = true;
            $scope.htmlcontent = ' ';
            $scope.backClass ='col-md-offset-6';
        } else {
            $scope.edit = false;
            $scope.sigid = $scope.id;
            if ($scope.id == null) {
                window.location.assign("/panel/signature")
            }
        }
        ($rootScope.textAngularTools != null) ? $rootScope.textAngularTools: {}
        SessionDetails.getSession()
            .then(function(results) {
                $scope.val = results;
                $scope.custid = results.custid;
                $scope.email = results.userEmail;
                $scope.loaded = true;
                if ($scope.id != 'new') {
                    $scope.sigid = $scope.id;
                    $scope.sigUrl = '/a/customer/' + $scope.custid + '/signature/' + $scope.sigid;
                    $http.get($scope.sigUrl).success(function(data, status, headers, config) {
                        $scope.htmlcontent = data.body;
                        $scope.title = data.title;
                    })
                }
                $scope.saveSig = function() {
                    title = document.getElementById('title').value;
                    body = $scope.htmlcontent;
                    if (title == "") {
                        $scope.alert = {
                            type: 'danger',
                            msg: 'Please enter Signature title',
                            show: true
                        };
                        return;
                    }
                    urlBody = {
                        'title': title,
                        'body': body,
                        //'created_by': $scope.email
                    };
                    if ($scope.edit == true) {
                        $scope.url = '/a/customer/' + $scope.custid + '/signature';
                        $http.post($scope.url, urlBody).success(function(data, status, headers, config) {
                                window.location.assign("/panel/signatures");
                            })
                            .error(function(data, status, headers, config) {
                                $scope.loaded = true;
                                $scope.alert = {
                                    type: 'danger',
                                    msg: data.message,
                                    show: true
                                };
                            })
                    } else {
                        $scope.updateSig = '/a/customer/' + $scope.custid + '/signature/' + $scope.id
                        $http.put($scope.updateSig, urlBody).success(function(data, status, headers, config) {
                                window.location.assign("/panel/signatures");
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
                };

                $scope.previewNow = function() {
                    $scope.sigUrl = '/a/customer/' + $scope.custid + '/preview/' + $scope.email;
                    bodyContent = {
                        'body': $scope.htmlcontent
                    };
                    $http.post($scope.sigUrl, bodyContent).success(function(data, status, headers, config) {
                            var modalInstance = $modal.open({
                                templateUrl: 'PreviewNow.html',
                                controller: 'PreviewNowCtrl',
                                windowClass: "modal fade in",
                                resolve: {
                                    previewData: function() {
                                        return data.body;
                                    }
                                }
                            });
                        })
                        .error(function(data, status, headers, config) {
                            $scope.loaded = true;
                            $scope.alert = {
                                type: 'danger',
                                msg: data.message,
                                show: true
                            };
                        });
                }

                $scope.backSig = function() {
                    window.location.assign("/panel/signatures");
                }
                $scope.deleteSig = function() {
                    $scope.sigUrl = '/a/customer/' + $scope.custid + '/signature/' + $scope.sigid;
                    $http.delete($scope.sigUrl).success(function(data, status, headers, config) {
                        window.location.assign("/panel/signatures");
                    })
                }

                $scope.closeAlert = function(index) {
                    $scope.alert.show = false;
                }

            })
    }
]);

novaSignatureControllers.controller('PreviewNowCtrl', function($scope, $http, $modalInstance, previewData) {
    $scope.previewData = previewData;
    $scope.ok = function() {
        $modalInstance.dismiss('ok');
    };
});