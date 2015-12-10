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
  var vm = this, query;

  vm.load = load;
  vm.getEntityIcon = getEntityIcon;
  vm.minimumSalaries = minimumSalaries;
  vm.perCapitaRange = perCapitaRange;
  vm.query = query;

  vm.load();

  function load() {
    apiService
      .getEntity($routeParams.entityName)
      .then(setEntity)
      .then(apiService.getEntityObligations)
      .then(setObligations);
  }

  function setEntity(entity) {
    vm.entity = entity;
    return vm.entity;
  }

  function setObligations(obligations){
    vm.obligations = obligations;
    return vm.obligations;
  }

  function getEntityIcon(entity) {
    if (entity) {
      var filename = entity.name.split(' ').join('_');
      return 'images/entities/' + filename + '.png';
    } else {
      return null;
    }
  }

  function minimumSalaries(){
    if(vm.entity){
      return parseFloat(vm.entity.balancePerCapita) / 70.10;
    }else{
      return 0;
    }
  }

  function perCapitaRange() {
    return new Array(Math.round(vm.minimumSalaries()));
  }

  query = {
    filter: '',
    order: 'signDate',
    limit: 10,
    page: 1
  };


}
