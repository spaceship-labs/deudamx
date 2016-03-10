(function(){

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

  mainCtrl.$inject = ['$scope','apiService','chartService','$filter'];

  function mainCtrl($scope,apiService, chartService, $filter) {
    /* jshint validthis: true */
    var vm = this,
      chart;

    vm.api = {};
    vm.dataset = [];
    vm.chartCallback = chartCallback;
    vm.chartService = chartService;
    vm.changeMode = changeMode;
    vm.entities = [];
    vm.goToEntity = goToEntity;
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
    vm.viewOne = viewOne;

    vm.load();

    //Dummy data
    vm.governors = [
      {
        name: 'Carlos Lozano de la Torre',
        date: 'Nov 30, 2010 - ',
        debt: 624.98,
        percent: 4.2
      },
      {
        name: 'Luis Armando Reynoso Femat',
        date: 'Nov 30, 2004 - Nov 29, 2010',
        debt: 1993.35,
        percent: 4.2
      },
      {
        name: 'Juan José León Rubio',
        date: 'Aug 25, 2004 - Nov 29, 2004',
        debt: 23750136.99,
        percent: 4.2
      },
      {
        name: 'Felipe González González',
        date: 'Nov 30, 1998 - Aug 24, 2004',
        debt: 447.75,
        percent: 4.2
      },
      {
        name: 'Otto Granados Roldán',
        date: 'Nov 30, 1992 - Nov 29, 1998',
        debt: 152227671.23,
        percent: 4.2
      },
      {
        name: 'Miguel Angel Barberena Vega',
        date: 'Nov 30, 1986 - Nov 29, 1992',
        debt: 152227671.23,
        percent: 4.2
      }
    ];
    //


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

    function goToEntity(entity){
      console.log('goto');
    }

    function refreshData() {
      vm.selectedEntities = chartService.getSelectedEntities(vm.dataset);
      if(vm.api.update){
        vm.api.update();
      }
    }

    function setEntities(entities) {
      vm.entities = entities;
      vm.dataset = chartService.formatEntities(entities);
      vm.refreshData();
      //console.log();

    }

    function tableFigure(entity){
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

    function toggleSort(key){
      vm.tableSort = key;
      vm.tableSortOrder = vm.tableSortOrder === '' ? '-' : '';
    }

    function viewOne(entity){
      vm.dataset.map(function(e){
        e.selected = e.key === entity.key;
        return e;
      });
      vm.refreshData();
    }
  }

})();
