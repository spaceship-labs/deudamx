'use strict';

/**
 * @ngdoc directive
 * @name spaceshiplabsApp.directive:fullScreenWrapper
 * @description
 * # fullScreenWrapper
 */
 angular.module('deudamxApp')
 .directive('fullScreenWrapper', function($window){


  return function (scope, element) {// jshint ignore:line
    var w = angular.element($window);

    scope.getWindowDimensions = function () {

      return { 'h': w.height(), 'w': w.width() };
    };

    scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {// jshint ignore:line

      scope.style = function (screenType) {
        var header = $('.section-title');// jshint ignore:line
        var customHeight;
        screenType = typeof screenType !== 'undefined' ? screenType : 'normal';

        if(screenType === 'firstScreen'){
          customHeight = newValue.h - header.outerHeight();
        }else{
          customHeight = newValue.h;
        }

        //Aplicando una altura minima

        if(customHeight < 490){
          customHeight = 490;
        }

        return {
          'height': (customHeight) + 'px',
          'width': (newValue.w) + 'px'
        };
      };

    }, true);

    w.bind('resize', function () {
      scope.$digest();
    });
  };

 });
