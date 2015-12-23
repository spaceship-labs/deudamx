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

  service.formatEntity = formatEntity;
  service.multiChart = multiChart;

  function formatEntity(entity, obligations) {
    entity.stats[entity.stats.length - 1].year = '2015';
    var res =  processObligations(obligations, entity.stats);
    console.log('..................................!');
    console.log('res', res);
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

  function processObligations(obligations, years) {
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
      return {x: k, y: parseFloat(sum[k])};
    });
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
