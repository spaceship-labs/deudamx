'use strict';

/**
 * @ngdoc service
 * @name deudamxApp.chartService
 * @description
 * # chartService
 * Service in the deudamxApp.
 */
angular.module('deudamxApp')
  .service('chartService', chartService);

function chartService($filter) {
  /* jshint validthis: true */
  var colorPalette = [],
    modes = {},
    service = this;

  service.getMode = getMode;
  service.getSelectedEntities = getSelectedEntities;
  service.nvdApi = {};
  service.formatEntities = formatEntities;
  service.mode = 0;
  service.state = 0;
  service.stackedArea = stackedArea;
  //service.modes = modes;
  service.modes = [{
    name: 'Deuda por monto',
    icon: 'attach_money',
    y: 'debt',
    sort: 'balance',
    label: 'Deuda MDP',
    filter: 'currency',
    alias: 'debt',
  }, {
    name: 'Deuda per capita',
    icon: 'perm_identity',
    y: 'perCapita',
    sort: 'balancePerCapita',
    label: 'Deuda per capita',
    filter: 'currency',
    alias : 'debtPerCapita'
  }, {
    name: 'Deuda como % del PIB Estatal',
    icon: 'business',
    y: 'gdpdebt',
    sort: 'balancegdp',
    label: '% del PIBE',
    filter: 'percentage',
    alias : 'gdpdebt'
  }];
  service.states = [{
    name: 'Grafica de area apilada',
    icon: 'signal_cellular_4_bar',
    style: 'stack'
  }, {
    name: 'Grafica de flujo',
    icon: 'multitrack_audio',
    style: 'stream'
  }, {
    name: 'Grafica expandida',
    icon: 'view_stream',
    style: 'expand'
  }];
  colorPalette = [
    '#AA3939', '#FFAAAA', '#D46A6A', '#801515',
    '#550000', '#AA6C39', '#FFD1AA', '#D49A6A',
    '#804515', '#552600', '#226666', '#669999',
    '#407F7F', '#0D4D4D', '#003333', '#2D882D',
    '#88CC88', '#55AA55', '#116611', '#004400',
    '#B4653D', '#FFC5A8', '#D99572', '#91441C',
    '#652403', '#246C6C', '#6AA1A1', '#448282',
    '#115757', '#023D3D', '#2C824E', '#7CBD97',
    '#529C70', '#146936'
  ];

  function getMode() {
    return service.modes[service.mode];
  }

  function getSelectedEntities(dataset) {
    var selected = [];
    dataset.forEach(function(entity) {
      if (entity.selected) {
        selected.push(entity);
      }
    });
    selected.sort(function(a, b) {
      var field = service.modes[service.mode];
      var aVal = parseFloat(a[field.sort]);
      var bVal = parseFloat(b[field.sort]);
      return bVal - aVal;
    });
    return selected;
  }

  function formatEntities(entities) {
    return entities.map(function(entity, key) {

      entity.stats[entity.stats.length - 1].year = '2015';
      return {
        id: entity.id,
        key: entity.name,
        values: entity.stats,
        selected: true,
        color: colorPalette[key],
        balance: entity.balance,
        balancegdp: entity.balancegdp,
        balancePerCapita: entity.balancePerCapita,
        population: entity.population
      };
    });
  }

  function stackedArea(noUseInteractive) {
    return {
      chart: {
        type: 'stackedAreaChart',
        useInteractiveGuideline: noUseInteractive === false ? false : true,
        useVoronoi: false,
        height: 540,
        color: colorPalette,
        showLegend: false,
        noData: 'No hay datos',
        showControls: false,
        interpolate : 'linear',
        margin: {
          top: 0,
          right: 20,
          bottom: 60,
          left: 73
        },
        x: function(d) {
          return parseInt(d.year);
        },
        y: function(d) {
          var val = parseFloat(d[service.modes[service.mode].y]);
          val = val ? val : 0;
          return val;
        },
        showValues: true,
        valueFormat: function(d) {
          return $filter('number')(d, 0);
        },
        duration: 500,
        xAxis: {
          axisLabel: 'Año',
          rotateLabels: -45
        },

        showYAxis: true,
        yAxis: {
          showMaxMin: false,
          axisLabel: 'Millones de pesos',
          axisLabelDistance: 10,
          tickFormat: function(d) {
            return $filter('number')(d, 2);
          }

        }
      }
    };
  }

}
