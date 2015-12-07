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
  vm.chartService = chartService;
  vm.entities = [];
  vm.getEntityIcon = getEntityIcon;
  vm.load = load;
  vm.refreshData = refreshData;
  vm.setEntities = setEntities;
  vm.stackedArea = chartService.stackedArea();
  vm.stackedSelected = true;
  vm.selectedEntities = [];
  vm.toggleAll = toggleAll;
  vm.toggleOne = toggleOne;
  vm.load();

  function load() {
    apiService.getEntities().then(vm.setEntities);
  }

  function getEntityIcon(entity) {
    var filename = entity.key.split(' ').join('_');
    return 'images/entities/' + filename + '.png';
  }

  function refreshData() {
    vm.selectedEntities = [];
    vm.dataset.forEach(function(entity) {
      if(entity.selected){
        vm.selectedEntities.push(entity);
      }
    });
    vm.api.update();
  }

  function setEntities(entities) {
    vm.entities = entities;
    vm.dataset = chartService.formatEntities(entities);
    vm.refreshData();

  }

  function toggleAll() {
    vm.stackedSelected = !vm.stackedSelected;
    vm.dataset.map(function(entity) {
      entity.selected = vm.stackedSelected;
      return entity;
    });
    vm.refreshData();
  }

  function toggleOne(entity) {
    entity.selected = !entity.selected;
    vm.refreshData();
  }
}
