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

function mainCtrl(apiService, chartService, $filter) {
  /* jshint validthis: true */
  var vm = this,
    chart;

  vm.dataset = [];
  vm.chartCallback = chartCallback;
  vm.chartService = chartService;
  vm.changeMode = changeMode;
  vm.entities = [];
  vm.getEntityIcon = getEntityIcon;
  vm.load = load;
  vm.refreshData = refreshData;
  vm.setChartState = setChartState;
  vm.setEntities = setEntities;
  vm.stackedArea = chartService.stackedArea();
  vm.stackedSelected = true;
  vm.selectedEntities = [];
  vm.tableFigure = tableFigure;
  vm.tableSort = 'key';
  vm.tableSortOrder = '';
  vm.toggleAll = toggleAll;
  vm.toggleOne = toggleOne;
  vm.toggleSort = toggleSort;
  vm.load();

  function setChartState(style) {
    chart.dispatch.changeState({style:style});
  }

  function chartCallback(scope) {
    chart = scope.chart;
  }

  function changeMode(key){
    chartService.mode = key;
    if(vm.tableSort !== 'key'){
      vm.tableSort = chartService.getMode().sort;
    }
    vm.refreshData();
  }
  function load() {
    apiService.getEntities().then(vm.setEntities);
  }

  function getEntityIcon(entity) {
    var filename = entity.key.split(' ').join('_');
    return 'images/entities/' + filename + '.png';
  }

  function refreshData() {
    vm.selectedEntities = chartService.getSelectedEntities(vm.dataset);
    vm.api.update();
  }

  function setEntities(entities) {
    vm.entities = entities;
    vm.dataset = chartService.formatEntities(entities);
    vm.refreshData();
    //console.log();

  }

  function tableFigure(entity){
    var mode = chartService.getMode();
    console.log(entity[mode.sort]);
    var value = $filter(mode.filter)(entity[mode.sort]);
    return value;
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

  function toggleSort(key){
    vm.tableSort = key;
    vm.tableSortOrder = vm.tableSortOrder === '' ? '-' : '';

  }
}
