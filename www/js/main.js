var performAccel = angular.module('performAccel', [
'ngRoute', 'performAccelIndex'
]);


performAccel.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl'
      }).
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl'
      }).
      when('/mpreview', {
        templateUrl: 'partials/mpreview.html',
        controller: 'mpreviewCtrl'
      }).
      when('/ereview', {
        templateUrl: 'partials/ereview.html',
        controller: 'ereviewCtrl'
      }).
      when('/settings', {
        templateUrl: 'partials/settings.html',
        controller: 'settingsCtrl'
      }).
      when('/reports', {
        templateUrl: 'partials/reports.html',
        controller: 'reportsCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);

// var performAccel = angular.module('performAccel', [
// 'ngRoute'
// ]);


// performAccel.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/login', {
//         templateUrl: 'partials/login.html',
//         controller: 'loginCtrl'
//       }).
//       when('/home', {
//         templateUrl: 'partials/home.html',
//         controller: 'homeCtrl'
//       }).
//       when('/mpreview', {
//         templateUrl: 'partials/mpreview.html',
//         controller: 'mpreviewCtrl'
//       }).
//       when('/ereview', {
//         templateUrl: 'partials/ereview.html',
//         controller: 'ereviewCtrl'
//       }).
//       when('/settings', {
//         templateUrl: 'partials/settings.html',
//         controller: 'settingsCtrl'
//       }).
//       when('/reports', {
//         templateUrl: 'partials/reports.html',
//         controller: 'reportsCtrl'
//       }).
//       otherwise({
//         redirectTo: '/home'
//       });
//   }]);