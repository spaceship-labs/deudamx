'use strict';

/**
 * @ngdoc service
 * @name deudamxApp.apiService
 * @description
 * # apiService
 * Service in the deudamxApp.
 */
angular.module('deudamxApp')
  .service('apiService', apiService);

function apiService(Restangular) {
  /* jshint validthis: true */
  var service = this;

  service.getEntities = getEntities;

  function getEntities() {
    return Restangular.all('entity').getList({
      sort: 'balance DESC',
    });
  }

}
