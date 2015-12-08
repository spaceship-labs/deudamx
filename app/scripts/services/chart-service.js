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

  service.nvdApi = {};
  service.formatEntities = formatEntities;
  service.mode = 0;
  service.state = 0;
  service.stackedArea = stackedArea;
  //service.modes = modes;
  service.modes = [
    {name:'Deuda por monto',icon:'attach_money',y:'debt'},
    {name:'Deuda como % del PIB Estatal',icon:'business',y:'debtpib'},
    {name:'Deuda per capita',icon:'perm_identity',y:'debtPerCapita'},
  ];
  service.states = [
    {name:'Grafica de area apilada',icon:'signal_cellular_4_bar',style:'stack'},
    {name:'Grafica de flujo',icon:'multitrack_audio',style:'stream'},
    {name:'Grafica expandida',icon:'view_stream',style:'expand'},
  ];
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



  function formatEntities(entities) {
    return entities.map(function(entity, key) {

      entity.stats[entity.stats.length - 1].year = '2015';
      return {
        key: entity.name,
        values: entity.stats,
        selected: true,
        color: colorPalette[key],
        balance: entity.balance
      };
    });
  }

  function stackedArea() {
    return {
      chart: {
        type: 'stackedAreaChart',
        useInteractiveGuideline: true,
        useVoronoi: false,
        height: 550,
        color: colorPalette,
        showLegend: false,
        noData : 'Cargando Datos',
        showControls : false,
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
          var val =parseFloat(d[service.modes[service.mode].y]);
          val = val ? val : 0;
          return val;
        },
        showValues: true,
        valueFormat: function(d) {
          console.log(d);
          return $filter('number')(d,0);
        },
        duration: 500,
        xAxis: {
          axisLabel: 'Año',
          rotateLabels: -45
        },

        showYAxis : true,
        yAxis: {
          showMaxMin: false,
          axisLabel: 'Millones de pesos',
          axisLabelDistance: 10,
          tickFormat: function(d) {
            return $filter('number')(d,2);
          }

        }
      }
    };
  }

}
