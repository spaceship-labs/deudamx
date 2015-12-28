'use strict';

/**
 * @ngdoc service
 * @name deudamxApp.entityMultiChartService
 * @description
 * # entityMultiChartService
 * Service in the deudamxApp.
 */
angular.module('deudamxApp')
  .service('entityMultiChartService', entityMultiChartService);

function entityMultiChartService($filter){
  /* jshint validthis: true */
  var service = this;

  service.formatEntityLineBar = formatEntityLineBar;
  service.formatEntityScatterLine = formatEntityScatterLine;
  service.multiChart = multiChart;

  function formatEntityScatterLine(entity, administrations, obligations) {
    entity.stats[entity.stats.length - 1].year = '2015';
    var res = processObligationsScatter(administrations, obligations, entity.stats);
    res.push({
      type: 'line',
      yAxis: 1,
      key: 'Deuda',
      values: entity.stats.map(getValue('debt'))
    });
    return res;

  }

  function formatEntityLineBar(entity, obligations) {
    entity.stats[entity.stats.length - 1].year = '2015';
    var res = processObligationsBar(obligations, entity.stats);
    return [{
      type: 'line',
      yAxis: 1,
      key: 'Deuda',
      values: entity.stats.map(getValue('debt')),
    }, {
      type: 'bar',
      key: 'Monto',
      yAxis: 2,
      id: entity.id,
      values: res
    }];

  }

  function processObligationsBar(obligations, years) {
    var sum = {};
    obligations.forEach(function(obl) {
      var year = new Date(obl.signDate).getFullYear();
      sum[year] = sum[year] || 0;
      sum[year] += parseFloat(obl.ammount);
    });

    years.forEach(function(y){
      sum[y.year] = sum[y.year] || 0;
    });

    return Object.keys(sum).map(function(k, l){
      return {x: parseInt(k), y: parseFloat(sum[k])};
    });
  }

  function processObligationsScatter(administrations, obligations, years) {
    var sum = {},
        adms = processAdministration(administrations);

    obligations.forEach(function(obl) {
      var year = new Date(obl.signDate).getFullYear(),
        governor = adms[obl.administration];
      sum[governor] = sum[governor] || {};
      sum[governor][year] = sum[governor][year] || 0;
      sum[governor][year] += parseFloat(obl.ammount);
    });

    return Object.keys(sum).map(function(k, l) {
      var obj = {key: k, type: 'scatter', yAxis: 2};
      obj.values = Object.keys(sum[k]).map(function(s) {
        return {x: parseInt(s), y: sum[k][s], size: sum[k][s] * 1000, shape: 'circle'};
      });
      console.log(obj);
      return obj;
    });

  }

  function processAdministration(administrations) {
    var adm = {};
    administrations.forEach(function(a) {
      adm[a.id] = a.governor;
    });
    return adm;
  }

  function getValue(field) {
    return function(d) {
      var val = parseFloat(d[field]);
      val = val ? val : 0;
      return {x:  parseInt(d.year), y: val};
    };
  }


  function multiChart() {
    return {
      chart: {
        type: 'multiChart',
        useInteractiveGuideline: true,
        useVoronoi: false,
        height: 550,
        showLegend: true,
        noData: 'No hay datos',
        showControls: false,
         sizeDomain: [1,10], //any interval
             sizeRange: [16,256],
        margin: {
          top: 0,
          right: 83,
          bottom: 60,
          left: 83
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
        yAxis1: {
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
