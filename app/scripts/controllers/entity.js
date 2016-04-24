(function(){

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

  entityCtrl.$inject =
    ['$scope','apiService','chartService','entityMultiChartService','$routeParams','$location','device'];


  function entityCtrl($scope,apiService, chartService, entityMultiChartService, $routeParams, $location, device) {
    /* jshint validthis: true */
    var vm = this;

    vm.chartService = chartService;
    vm.committed = {};
    vm.changeMode = changeMode;
    vm.colorPalette = [];
    vm.getEntityIcon = getEntityIcon;
    vm.getAdministrationStyle = getAdministrationStyle;
    vm.getObligationStyle = getObligationStyle;
    vm.minimumSalaries = minimumSalaries;
    vm.load = load;
    vm.perCapitaRange = perCapitaRange;
    vm.query = {};
    vm.multyChartServiceOptions = entityMultiChartService.multiChart();
    vm.currentUrl = $location.absUrl();
    vm.graphImages = [];

    vm.load();

    vm.shareIn = function(socialNetwork){
      var url = encodeURIComponent(vm.currentUrl);
      var shareUrl = '';
      var text = 'Conoce el ranking de los gobernadores que más han endeudado a sus estados.';
      text += 'El @Univ_Data y @Spaceshiplabs presentan #Conocetudeuda';
      text = encodeURIComponent(text);
      if(socialNetwork === 'twitter'){
        shareUrl = 'https://www.twitter.com/intent/tweet?url=' + url + '&text=' + text;
        console.log(shareUrl);
        window.open(shareUrl, 'name','width=600,height=400');
      }
      else if(socialNetwork === 'facebook'){
        shareUrl = 'https://www.facebook.com/sharer.php?u=' + url + '&p[summary]=' + text;
        window.open(shareUrl, 'name','width=600,height=400');
      }

    };

    function changeMode(key){
      chartService.mode = key;
    }

    function refreshData() {
      if(vm.api.update){
        vm.api.update();
      }
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
      return style;

    }

    function getAdministrationStyle(admon, index) {
      var mode = chartService.getMode().alias;
      var style = {
        'background-color': vm.colorPalette[8]
      };
      if (admon.stats.entityStats) {
        var max = new gauss.Collection(vm.administrations).map(function(adm) {
          return adm.stats.entityStats ? adm.stats.entityStats.delta[mode] : 0;
        }).toVector().max();
        var debtPct = Math.round(admon.stats.entityStats.delta[mode] / max * 80) + '%';
        style.width = debtPct;
      } else {
        style.width = '0';
      }
      return style;

    }

    function setCommitted(commited){
      vm.commited = commited;
    }

    function load() {
      vm.query = {
        filter: '',
        order: '-signDate',
        limit: 10,
        page: 1
      };
      vm.greens = [
        '#00E086', '#00EC50', '#63FF92', '#00AC39', '#00CE3E'
      ];
      vm.oranges = [
        '#FFDEBC', '#FFB977', '#FF9524', '#EA7800', '#BE6500'
      ];
      vm.blues = [
        '#A1E9F0', '#53B9C3', '#3CA7B2', '#347D86', '#00D9EF', '#3556BE'
      ];
      vm.browns = [
        '#FEE8BE', '#FEC96B', '#FEC96B', '#D58D00', '#AD7000', '#E34E00'
      ];
      vm.reds = [
        '#E34E00', '#FF7B6D', '#FD2E20', '#DC1E00', '#B31B0F'
      ];
      vm.purples = [
        '#F95CFF', '#F300FD', '#EE00FF', '#BB00CF', '#770085'
      ];
      vm.colorPalette =  vm.colorPalette.concat(
        vm.reds,
        vm.blues,
        vm.greens,
        vm.oranges,
        vm.browns,
        vm.purples
      );

      apiService
        .getEntity($routeParams.entityName)
        .then(setEntity)
        .then(apiService.getEntityCollections)
        .then(setCollections)
        .then(setGraphImages)
        .then(apiService.getCommited)
        .then(setCommitted);

    }

    function setGraphImages(collections){
      vm.graphImages = collections[0].map(function(item){
        var start = new Date(item.start).getFullYear();
        return {
          id: 'gob' + start,
          image: item.local_picture,
          x: start,
        };
      });
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
      vm.formatEntity =
        entityMultiChartService.formatEntityLineBar(vm.entity, vm.obligations);
      refreshData();

      //TODO CHECK IF CORRECT FUNCTION CALL
      vm.administrations = apiService.resolvePictures(vm.administrations);

      return collections;
    }

    function setEntity(entity) {
      vm.entity = entity;
      return vm.entity;
    }

  }

})();
