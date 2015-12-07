'use strict';

/**
 * @ngdoc function
 * @name ctbookApp.controller:ContratoCtrl
 * @description
 * # ContratoCtrl
 * Controller of the ctbookApp
 */
angular.module('deudamxApp')
  .controller('MainCtrl', mainCtrl);

function mainCtrl(apiService, chartService) {
  /* jshint validthis: true */
  var vm = this;

  vm.dataset = [];
  vm.entities = [];
  vm.load = load;
  vm.setEntities = setEntities;
  vm.stackedArea = chartService.stackedArea();

  vm.load();

  function load() {
    apiService.getEntities().then(vm.setEntities);
  }

  function setEntities(entities) {
    vm.entities = entities;
    vm.dataset = chartService.formatEntities(entities);
    console.log(vm.dataset);
  }

}
