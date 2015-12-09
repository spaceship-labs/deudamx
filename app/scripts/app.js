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
    'ngMaterial',
    'restangular',
    'nvd3',
    'ngMdIcons'
  ])
  .config(function($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/entidad/:entityId', {
        templateUrl: 'views/entity.html',
        controller: 'EntityCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
