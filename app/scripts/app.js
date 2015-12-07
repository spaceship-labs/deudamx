'use strict';

/**
 * @ngdoc overview
 * @name deudamxApp
 * @description
 * # deudamxApp
 *
 * Main module of the application.
 */
angular
  .module('deudamxApp', [
    'ngAnimate',
    'ngAria',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
