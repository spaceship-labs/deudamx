(function(){

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

  entityMultiChartService.$inject = ['$filter'];

  function entityMultiChartService($filter){
    /* jshint validthis: true */
    var service = this;


    service.formatEntityLineBar = formatEntityLineBar;
    service.formatEntityScatterLine = formatEntityScatterLine;
    service.formatEntityScatterLineBar = formatEntityScatterLineBar;
    service.multiChart = multiChart;

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
        key: 'Deuda Contratada',
        yAxis: 2,
        id: entity.id,
        values: res
      }];
    }

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

    function formatEntityScatterLineBar (entity, administrations, obligations) {
      entity.stats[entity.stats.length - 1].year = '2015';
      var scatter = processObligationsScatter(administrations, obligations, entity.stats),
        lineAndBar = formatEntityLineBar(entity, obligations);
      return scatter.concat(lineAndBar);

    }

    function getTypeOfShapeByDestination(types){
      var shapes = {
        'Inversión pública productiva': 'circle',
        'Refinanciamiento': 'square',
        'both': 'triangle-up'
      },
      count = 0,
      piv;

      Object.keys(types).forEach(function (i) {
        count++;
        piv = i;
      });

      if (count === 2) {
        piv = 'both';
      }

      return shapes[piv];
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
            rotateLabels: -90
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

    function processAdministration(administrations) {
      var adm = {};
      administrations.forEach(function(a) {
        adm[a.id] = a.governor;
      });
      return adm;
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
        var mdp = $filter('mdp')(sum[k], 2, true);
        return {x: parseInt(k), y: mdp};
      });
    }

    function processObligationsScatter(administrations, obligations, years) {
      var sum = {},
          adms = processAdministration(administrations);

      obligations.forEach(function(obl) {
        var year = new Date(obl.signDate).getFullYear(),
          governor = adms[obl.administration];
        sum[governor] = sum[governor] || {};
        sum[governor][year] = sum[governor][year] || {};
        sum[governor][year].value = sum[governor][year].value || 0;
        sum[governor][year].value += parseFloat(obl.ammount);
        sum[governor][year].types = sum[governor][year].types || {};
        sum[governor][year].types[obl.destination] = true;

      });

      return Object.keys(sum).map(function(k, l) {
        var obj = {key: k, type: 'scatter', yAxis: 1};
        obj.values = Object.keys(sum[k]).map(function(s) {

          var mdp = $filter('mdp')(sum[k][s].value, 2, true),
              shape = getTypeOfShapeByDestination(sum[k][s].types);

          return {x: parseInt(s), y: mdp, shape: shape};
        });
        return obj;
      });

    }


  }

})();
