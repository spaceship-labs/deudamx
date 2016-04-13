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

  mainCtrl.$inject = ['$scope', 'apiService', 'chartService', 'device', '$filter','$location'];

  function mainCtrl($scope, apiService, chartService, device, $filter, $location) {
    /* jshint validthis: true */
    var vm = this,
      chart;

    vm.api = {};
    vm.committed = {};
    vm.admonSort = '-deltaDebtPerCapita';
    vm.admonSortDisabled = admonSortDisabled;
    vm.dataset = [];
    vm.chartCallback = chartCallback;
    vm.chartService = chartService;
    vm.changeMode = changeMode;
    vm.entities = [];
    vm.findEntity = findEntity;
    vm.filterAdmon = filterAdmon;
    vm.goToEntity = goToEntity;
    vm.getLevelClass = getLevelClass;
    vm.getPartyClass = getPartyClass;
    vm.load = load;
    vm.loadCommited = loadCommited;
    vm.refreshData = refreshData;
    vm.setChartState = setChartState;
    vm.setEntities = setEntities;
    vm.setAdministrations = setAdministrations;
    vm.stackedArea = chartService.stackedArea(!device.isMobileUserAgent());
    vm.stackedSelected = true;
    vm.sortByFilter = sortByFilter;
    vm.selectedEntities = [];
    vm.tableFigure = tableFigure;
    vm.tableSort = 'key';
    vm.tableSortOrder = '';
    vm.toggleAll = toggleAll;
    vm.toggleOne = toggleOne;
    vm.toggleSort = toggleSort;
    vm.viewOne = viewOne;
    vm.admonLimit = 10;

    vm.currentUrl = $location.absUrl();

    vm.dummyDetailedList = {
      acreditado: 'Aguascalientes',
      gobernador:'Carlos Lozano de la Torre(PRI)',
      destino:'Inversion Publica Productiva',
      fecha: 'Jun 19, 2015',
      monto: '$30.00 MDP',
      saldo: '$30.00 MDP'
    };
    vm.detailedListData = [];
    for(var i=0;i<20;i++) {
      vm.detailedListData.push(vm.dummyDetailedList);
    }

    vm.load();
    vm.loadCommited();

    vm.shareIn = function(socialNetwork){
      console.log(vm.currentUrl);
      if(socialNetwork === 'twitter'){
        window.open('https://twitter.com/home?status=' + vm.currentUrl, 'name','width=600,height=400');
      }
      else if(socialNetwork === 'facebook'){
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + vm.currentUrl, 'name','width=600,height=400');
      }
      else if(socialNetwork === 'gplus'){
        window.open('https://plus.google.com/share?url=' + vm.currentUrl, 'name','width=600,height=400');
      }
    };

    vm.scrollTo = function(target, $event){
      $event.preventDefault();
      var toY  = $('#' + target).offset().top;
      setTimeout(
          function(){
            $('html, body').animate({
              scrollTop: toY
            }, 600);
          },
          300
      );
    };

    function filterAdmon(admon){
      var entity = findEntity(admon.entity);
      return entity.selected;
    }
    function admonSortDisabled(order) {
      console.log(order);
      return vm.admonSort === order;
    }

    function getPartyClass(party) {
      return 'party-' + party;
    }

    function getLevelClass(value) {
      //returns the class according to percent gdp value
      var classes = [
        [3.5, 'percent-circle-lv4'],
        [2, 'percent-circle-lv3'],
        [0, 'percent-circle-lv2'],
        [-50, 'percent-circle-lv1']
      ];
      var result = classes.find(function(cl) {
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
        .then(apiService.resolvePictures)
        .then(vm.setAdministrations);
    }

    function loadCommited(){
      apiService.getCommited()
        .then(setCommitted);
    }

    function setCommitted(commited){
      vm.committed = commited;
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

    function findEntity(id) {
      return vm.dataset.find(function(entity) {
        return entity.id === id;
      });
    }

    function setEntities(entities) {
      vm.entities = entities;
      vm.dataset = chartService.formatEntities(entities);
      vm.refreshData();
      //console.log();

    }

    function sortByFilter() {
      var current = vm.admonSort;
      if (current[0] === '-') {
        current = current.replace('-', '');
      } else {
        current = '-' + current;
      }
      vm.admonSort = current;
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
