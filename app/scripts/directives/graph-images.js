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

        scope.circleRad = 15;

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
          if (dots.length === 0) {
            return;
          }
          d3.selectAll('.politic-image').remove();
          d3.select('.nvd3.nv-wrap.nv-multibar g.nv-groups')
            .selectAll('circle')
            .data(scope.data)
            .enter()
            .append('circle')
            .attr('class', 'politic-image')
            .attr('cx', function(d){
              if (d.x < 1993) {
                d.x = 1993;
              } else if (d.x > 2015){
                d.x = 2015;
              }
              var i = d.x - 1993;
              var center = dots[i][0];
              if (d.x === 1993){
                center += 15 ;
              } else if (d.x === 2015) {
                center -= 15;
              }
              return center;
            })
            .attr('cy', function(d){
              var i = d.x - 1993;
              var center = dots[i][1];
              if ( (center - 15) <= 0 ) {
                center = 15;
              }
              if ( (center + scope.circleRad) >= 460) {
                center = 460 - 15;
              }
              return center;
            })
            .attr('r', scope.circleRad)
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
