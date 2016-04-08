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
        var dots = [];

        scope.data = scope.data || [];
        scope.windowWidth = scope.windowWidth || 0;


        //watchers
        $(window).resize(function(){
          scope.$apply(function(){
            scope.windowWidth = window.innerWidth;
          });
        });

        //window width
        scope.$watch(
          function(){
            return scope.windowWidth;
          },
          function(width){
            render();
          }
        );

        //politics data
        scope.$watch(
          function(){
            return scope.data;
          },
          function(data){
          }
        );


        //graphic rendered
        scope.$watch(
          function(){
            var ndot = d3.selectAll(".lines1Wrap.nvd3-svg .nv-group.nv-series-0 path.nv-point")[0];
            return ndot.length > 0;
          },
          function(exists){
            console.log(exists);
            calcDots();
          }
        );


        function calcDots(){
          dots = d3.selectAll(".lines1Wrap.nvd3-svg .nv-group.nv-series-0 path.nv-point")[0];
          dots = dots.map(function(d){
            var a = pattern.exec(d.getAttribute("transform"));
            return [Number(a[1]), Number(a[2])];
          });
        }

        function render(){
          if (dots.length == 0 ){
            return;
          }
          d3.selectAll(".politic-image").remove();
          console.log(dots[0]);
          d3.select(".nv-line>g[clip-path]>g.nv-groups")
            .selectAll("circle")
            .data(scope.data)
            .enter()
            .append("circle")
            .attr("class", "politic-image")
            .attr("cx", function(d){
              var i = d.x - 1993;
              return dots[i][0];
            })
            .attr("cy", function(d){
              var i = d.x - 1993;
              return dots[i][1];
            })
            .attr("r", 15)
            .style("fill", "transparent")
            .style("stroke", "black")
            .style("stroke-width", 0.25)
            .style("fill", function(d){
              return  "url(#" + d.id + ")";
            });
        }
      }
    };
  });
