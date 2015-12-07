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

function chartService() {
  /* jshint validthis: true */
  var service = this;

  service.formatEntities = formatEntities;
  service.stackedArea = stackedArea;

  function formatEntities(entities){
    return entities.map(function(entity){
      entity.stats[entity.stats.length-1].year = '2015';
      return {
        key : entity.name,
        values : entity.stats
      };
    });
  }
  function stackedArea() {
    return {
      chart: {
        type: 'stackedAreaChart',
        useInteractiveGuideline: true,
        useVoronoi: false,
        height: 650,
        margin: {
          top: 20,
          right: 50,
          bottom: 60,
          left: 60
        },
        x: function(d) {
          return parseInt(d.year);
        },
        y: function(d) {
          return parseFloat(d.debt);
        },
        showValues: true,
        valueFormat: function(d) {
          return d;
        },
        transitionDuration: 1000,
        xAxis: {
          axisLabel: 'Año'
        },
        yAxis: {
          showMaxMin: false,
          axisLabel: 'Millones de pesos',
          axisLabelDistance: 0
        }
      }
    };
  }

}
