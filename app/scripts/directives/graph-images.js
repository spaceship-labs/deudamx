'use strict';

/**
 * @ngdoc directive
 * @name deudamxApp.directive:graphImages
 * @description
 * # graphImages
 */
angular.module('deudamxApp')
  .directive('graphImages', function () {
    return {
      templateUrl: 'views/directives/graph-images.html',
      restrict: 'E',
      scope:{
        data: '='
      },
      link: function postLink(scope, element, attrs) {
        var pattern = /translate\((-?[\d|.]+),(-?[\d|.]+)\)/;
        var dots  = [];
        var data  = [];
        var width = 0;

        //watchers
        $(window).resize(function(){
          scope.$apply(function(){
            scope.windowWidth = window.innerWidth;
          });
        });

        //window width
        //
        var time;
        scope.$watch(
          function(){
            return scope.windowWidth;
          },
          function(width){
            if (time) {
              clearTimeout(time);
            }
            time = setTimeout(function(){
              calcDots();
              render();
            }, 250);
          }
        );

        //politics data
        scope.$watch(
          function(){
            return scope.data;
          },
          function(){
            render();
          }
        );


        //graphic rendered
        scope.$watch(
          function(){
            var ndot = d3.selectAll('.lines1Wrap.nvd3-svg .nv-group.nv-series-0 path.nv-point')[0];
            return ndot.length > 0;
          },
          function(exists){
            calcDots();
            render();
          }
        );


        function calcDots(){
          dots = d3.selectAll('.lines1Wrap.nvd3-svg .nv-group.nv-series-0 path.nv-point')[0];
          dots = dots.map(function(d){
            var a = pattern.exec(d.getAttribute('transform'));
            return [Number(a[1]), Number(a[2])];
          });
        }

        function render(){
          d3.selectAll('.politic-image').remove();
          d3.select('.nv-line>g[clip-path]>g.nv-groups')
            .selectAll('circle')
            .data(scope.data)
            .enter()
            .append('circle')
            .attr('class', 'politic-image')
            .attr('cx', function(d){
              var i = d.x - 1993;
              return dots[i][0];
            })
            .attr('cy', function(d){
              var i = d.x - 1993;
              return dots[i][1];
            })
            .attr('r', 15)
            .style('fill', 'transparent')
            .style('stroke', 'black')
            .style('stroke-width', 0.25)
            .style('fill', function(d){
              return  'url(#' + d.id + ')';
            });
        }
      }
    };
  });
