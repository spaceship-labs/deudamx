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

  vm.load = load;
  vm.getEntityIcon = getEntityIcon;
  vm.minimumSalaries = minimumSalaries;
  vm.perCapitaRange = perCapitaRange;

  vm.load();

  function load() {
    apiService.getEntity($routeParams.entityName).then(setEntity);
  }

  function setEntity(entity) {
    vm.entity = entity;
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

}
