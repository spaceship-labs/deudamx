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

  service.administration = {};
  service.entities = [];
  service.getAdministrations = getAdministrations;
  service.getEntities = getEntities;
  service.getEntity = getEntity;
  service.getEntityCollections = getEntityCollections;
  service.debtObligation = {};
  service.resolvePictures = resolvePictures;
  service.getCommited = getCommited;

  function getAdministrations() {
    return Restangular.all('administration').getList({
      sort : 'deltaDebtgdp DESC',
      limit : 200,
      where : {
        deltaDebt : {
          '!' : 0
        }
      }
    });
  }

  function getEntities() {
    var deferred = $q.defer();
    if (service.entities.length) {
      deferred.resolve(service.entities);
    } else {
      Restangular.all('entity').getList({
        sort: 'balance DESC'
      }).then(function(entities) {
        service.entities = entities;
        deferred.resolve(entities);
      }, deferred.reject);
    }
    return deferred.promise;
  }

  function getEntity(name) {
    var deferred = $q.defer();

    if (service.entities.length) {
      deferred.resolve(service.entities.find(findEntity));
    } else {
      service.getEntities().then(function() {
        deferred.resolve(service.entities.find(findEntity));
      }, deferred.reject);
    }

    return deferred.promise;

    function findEntity(entity) {
      return entity.name === name;
    }
  }


  //works with the api
  /*function getEntityCollection(entity, collection) {
    var deferred = $q.defer();
    if (service[collection][entity.id]) {
      deferred.resolve(service[collection][entity.id]);
    } else {
      Restangular.all(collection).getList({
        entity: entity.id
      }).then(function(results) {
        service[collection][entity.id] = results;
        deferred.resolve(results);
      });
    }
    return deferred.promise;
  }*/

  //works without the api, with the files in resources
  function getEntityCollection(entity, collection) {
    var deferred = $q.defer();
    if (service[collection][entity.id]) {
      deferred.resolve(service[collection][entity.id]);
    } else {
      Restangular
        .all(collection + entity.id)
        .getList()
        .then(function(results) {
          service[collection][entity.id] = results;
          deferred.resolve(results);
        });
    }
    return deferred.promise;
  }


  function getEntityCollections(entity) {
    var deferred = $q.defer();
    $q.all([getEntityCollection(entity, 'administration'), getEntityCollection(entity, 'debtObligation')])
      .then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }

  var nameFileReplace = /(:\/\/|\/)/g;
  function nameFile(name) {
    return name.replace(nameFileReplace, '_').split('?')[0];
  }

  function resolvePictures(entity) {
    return entity.map(function(ent) {
      ent.nameLower = (ent.governor || '').toLowerCase().replace(/á/g, 'a');
      if (!ent.picture) {
        return ent;
      }
      var picture = encodeURI(ent.picture || '');
      ent.local_picture = 'pictures/' + nameFile(picture);
      return ent;
    });
  }

  function getCommited(){
    var deferred = $q.defer();
    var collection = 'committed';
    if (service[collection]) {
      deferred.resolve(service[collection]);
    } else {
      Restangular
        .one(collection)
        .get()
        .then(function(results) {
          service[collection] = results;
          deferred.resolve(results);
        });
    }
    return deferred.promise;
  }

}
