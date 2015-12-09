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

function apiService(Restangular, $q) {
  /* jshint validthis: true */
  var service = this;

  service.entities = [];
  service.getEntities = getEntities;
  service.getEntity = getEntity;

  function getEntities() {
    var deferred = $q.defer();
    if (service.entities.length) {
      deferred.resolve(service.entities);
    } else {
      Restangular.all('entity').getList({sort:'balance DESC'}).then(function(entities) {
        service.entities = entities;
        deferred.resolve(entities);
      }, deferred.reject);
    }
    return deferred.promise;
  }

  function getEntity(name) {
    var deferred = $q.defer();

    if(service.entities.length){
      deferred.resolve(service.entities.find(findEntity));
    }else{
      service.getEntities().then(function(){
        deferred.resolve(service.entities.find(findEntity));
      },deferred.reject);
    }

    return deferred.promise;

    function findEntity(entity){
      return entity.name === name;
    }
  }

}
