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

function entityCtrl(apiService, chartService, $routeParams) {
  /* jshint validthis: true */
  var vm = this;

  vm.chartService = chartService;
  vm.changeMode = changeMode;
  vm.colorPalette = [];
  vm.getEntityIcon = getEntityIcon;
  vm.getAdministrationStyle = getAdministrationStyle;
  vm.getObligationStyle = getObligationStyle;
  vm.minimumSalaries = minimumSalaries;
  vm.load = load;
  vm.perCapitaRange = perCapitaRange;
  vm.query = {};

  vm.load();

  function changeMode(key){
    chartService.mode = key;
  }
  function getEntityIcon(entity) {
    if (entity) {
      var filename = entity.name.split(' ').join('_');
      return 'images/entities/' + filename + '.png';
    } else {
      return null;
    }
  }

  function getObligationStyle(obligation) {
    var key = 0;
    var index = 0;
    var admon = vm.administrations.find(function(admon) {
      //console.log(obligation);
      if (admon.id === obligation.administration) {
        index = key;
        return true;
      } else {
        key++;
        return false;
      }
    });
    var style = admon.length ? getAdministrationStyle(admon[0], index - 1) : {};
    delete style.width;
    //console.log(key);
    return style;

  }

  function getAdministrationStyle(admon, index) {
    var mode = chartService.getMode().alias;
    var style = {
      'background-color': vm.colorPalette[index * 2]
    };
    if (admon.stats.entityStats) {
      var max = new gauss.Collection(vm.administrations).map(function(adm) {
        return adm.stats.entityStats ? adm.stats.entityStats.delta[mode] : 0;
      }).toVector().max();
      var debtPct = Math.round(admon.stats.entityStats.delta[mode] / max * 50) + '%';
      style.width = debtPct;
    } else {
      style.width = '0';
    }
    return style;

  }

  function load() {
    vm.query = {
      filter: '',
      order: '-signDate',
      limit: 10,
      page: 1
    };
    vm.colorPalette = [
      '#407F7F', '#0D4D4D', '#003333', '#2D882D',
      '#88CC88', '#55AA55', '#116611', '#004400',
      '#B4653D', '#FFC5A8', '#D99572', '#91441C',
      '#652403', '#246C6C', '#6AA1A1', '#448282',
      '#115757', '#023D3D', '#2C824E', '#7CBD97',
      '#AA3939', '#FFAAAA', '#D46A6A', '#801515',
      '#550000', '#AA6C39', '#FFD1AA', '#D49A6A',
      '#552600', '#226666', '#669999',
      '#529C70', '#146936', '#804515',
    ];

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
    return collections;
  }

  function setEntity(entity) {
    vm.entity = entity;
    return vm.entity;
  }



}
