(function() {

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

  mainCtrl.$inject = ['$scope', 'apiService', 'chartService', '$filter'];

  function mainCtrl($scope, apiService, chartService, $filter) {
    /* jshint validthis: true */
    var vm = this,
      chart;

    vm.api = {};
    vm.admonSort = '-deltaDebt';
    vm.dataset = [];
    vm.chartCallback = chartCallback;
    vm.chartService = chartService;
    vm.changeMode = changeMode;
    vm.entities = [];
    vm.findEntity = findEntity;
    vm.goToEntity = goToEntity;
    vm.getLevelClass = getLevelClass;
    vm.getPartyClass = getPartyClass;
    vm.load = load;
    vm.refreshData = refreshData;
    vm.setChartState = setChartState;
    vm.setEntities = setEntities;
    vm.setAdministrations = setAdministrations;
    vm.stackedArea = chartService.stackedArea();
    vm.stackedSelected = true;
    vm.selectedEntities = [];
    vm.tableFigure = tableFigure;
    vm.tableSort = 'key';
    vm.tableSortOrder = '';
    vm.toggleAll = toggleAll;
    vm.toggleOne = toggleOne;
    vm.toggleSort = toggleSort;
    vm.viewOne = viewOne;


    vm.load();

    function getPartyClass(party){
      return 'party-'+party;
    }

    function getLevelClass(value){
      //returns the class according to percent gdp value
      var classes = [
        [3.5,'percent-circle-lv4'],
        [2,'percent-circle-lv3'],
        [0,'percent-circle-lv2'],
        [-50,'percent-circle-lv1']
      ];
      var result = classes.find(function(cl){
        return value >= cl[0];
      });
      return result[1];

    }

    function setChartState(style) {
      chart.dispatch.changeState({ style: style });
    }

    function chartCallback(scope) {
      chart = scope.chart;
    }

    function changeMode(key) {
      chartService.mode = key;
      if (vm.tableSort !== 'key') {
        vm.tableSort = chartService.getMode().sort;
      }
      vm.refreshData();
    }

    function load() {
      apiService.getEntities()
        .then(vm.setEntities)
        .then(apiService.getAdministrations)
        .then(vm.setAdministrations);
    }

    function goToEntity(entity) {
      console.log('goto');
    }

    function refreshData() {
      vm.selectedEntities = chartService.getSelectedEntities(vm.dataset);
      if (vm.api.update) {
        vm.api.update();
      }
    }

    function setAdministrations(admons) {
      vm.admons = admons;
    }

    function findEntity(id){
      return vm.entities.find(function(entity){
        return entity.id === id;
      });
    }

    function setEntities(entities) {
      vm.entities = entities;
      vm.dataset = chartService.formatEntities(entities);
      vm.refreshData();
      //console.log();

    }

    function tableFigure(entity) {
      var mode = chartService.getMode();
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

    function toggleSort(key) {
      vm.tableSort = key;
      vm.tableSortOrder = vm.tableSortOrder === '' ? '-' : '';
    }

    function viewOne(entity) {
      vm.dataset.map(function(e) {
        e.selected = e.key === entity.key;
        return e;
      });
      vm.refreshData();
    }
  }

})();
