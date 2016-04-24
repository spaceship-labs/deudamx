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
    service = this,
    greens = [],
    oranges = [],
    blues = [],
    browns = [],
    reds = [],
    purples = [];


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
    ylabel : 'Millones de Pesos'
  }, {
    name: 'Deuda per cápita',
    icon: 'perm_identity',
    y: 'perCapita',
    sort: 'balancePerCapita',
    label: 'Deuda per cápita',
    filter: 'currency',
    alias : 'debtPerCapita',
    ylabel : 'Millones de Pesos'
  }, {
    name: 'Deuda como % del PIB Estatal',
    icon: 'business',
    y: 'gdpdebt',
    sort: 'balancegdp',
    label: '% del PIBE',
    filter: 'percentage',
    alias : 'gdpdebt',
    ylabel : '%'
  }];
  service.states = [{
    name: 'Gráfica de área apilada',
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

  greens = [
    '#00E086', '#00EC50', '#63FF92', '#00AC39', '#00CE3E'
  ];
  oranges = [
    '#FFDEBC', '#FFB977', '#FF9524', '#EA7800', '#BE6500'
  ];
  blues = [
    '#A1E9F0', '#53B9C3', '#3CA7B2', '#347D86', '#00D9EF', '#3556BE'
  ];
  browns = [
    '#FEE8BE', '#FEC96B', '#FEC96B', '#D58D00', '#AD7000', '#E34E00'
  ];
  reds = [
    '#E34E00', '#FF7B6D', '#FD2E20', '#DC1E00', '#B31B0F'
  ];
  purples = [
    '#F95CFF', '#F300FD', '#EE00FF', '#BB00CF', '#770085'
  ];
  colorPalette =  colorPalette.concat(
    reds,
    blues,
    greens,
    oranges,
    browns,
    purples
  );

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
          rotateLabels: -90
        },

        showYAxis: true,
        yAxis: {
          showMaxMin: false,
          axisLabel: service.modes[service.mode].ylabel,
          axisLabelDistance: 10,
          tickFormat: function(d) {
            return $filter('number')(d, 2);
          }

        }
      }
    };
  }

}
