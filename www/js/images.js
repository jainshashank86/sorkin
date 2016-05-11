novaSignatureControllers.controller('ImagesCtrl', ['$scope', '$http', 'SessionDetails', 'fileUpload',
    function($scope, $http, SessionDetails, fileUpload, $routeParams) {

        $scope.loaded = false;
        SessionDetails.getSession()
            .then(function(results) {
                $scope.val = results;
                $scope.url = '/a/customer/' + $scope.val.custid + '/image'

                $scope.upload = function() {
                    var file = $scope.ImageFile;
                    var uploadUrl = $scope.url;
                    fileUpload.uploadFileToUrl(file, uploadUrl);
                }

                $http.get($scope.url).success(function(data, status, headers, config) {
                    $scope.imgList = data.images;
                    $scope.loaded = true;
                    $scope.deleteImage = function(imageId) {
                        deleteImgUrl = '/a/customer/' + $scope.val.custid + '/image/' + imageId;
                        $http.delete(deleteImgUrl).success(function(data, status, headers, config) {
                            window.location.assign("/panel/images");
                        })
                    }
                })
            })
    }
]);