'use strict';

/**
 * @ngdoc function
 * @name deudamxApp.controller:EntityCtrl
 * @description
 * # EntityCtrl
 * Controller of the deudamxApp
 */
angular.module('deudamxApp')
  .controller('EntityCtrl', entityCtrl);

function entityCtrl(apiService, $routeParams) {
  /* jshint validthis: true */
  var vm = this;

  vm.getEntityIcon = getEntityIcon;
  vm.minimumSalaries = minimumSalaries;
  vm.load = load;
  vm.perCapitaRange = perCapitaRange;
  vm.query = {};

  vm.load();

  function getEntityIcon(entity) {
    if (entity) {
      var filename = entity.name.split(' ').join('_');
      return 'images/entities/' + filename + '.png';
    } else {
      return null;
    }
  }

  function load() {
    vm.query = {
      filter: '',
      order: '-signDate',
      limit: 10,
      page: 1
    };
    apiService
      .getEntity($routeParams.entityName)
      .then(setEntity)
      .then(apiService.getEntityCollections)
      .then(setCollections);
  }

  function minimumSalaries() {
    if (vm.entity) {
      return parseFloat(vm.entity.balancePerCapita) / 70.10;
    } else {
      return 0;
    }
  }

  function perCapitaRange() {
    return new Array(Math.round(vm.minimumSalaries()));
  }

  function setCollections(collections) {
    vm.administrations = collections[0];
    vm.obligations = collections[1];
    setObligationAdministration();
    return collections;
  }

  function setObligationAdministration(){
    vm.obligations = vm.obligations.map(function(ob){
      var obDate = new Date(ob.signDate);
      ob.administration = vm.administrations.find(function(admin){
        var start = new Date(admin.start);
        if(admin.end){
          var end = new Date(admin.end);
          return obDate > start && obDate < end;
        }else{
          return obDate > start;
        }
      });
      return ob;
    });
    //console.log(vm.obligations);
    return vm.obligations;
  }

  function setEntity(entity) {
    vm.entity = entity;
    return vm.entity;
  }



}
