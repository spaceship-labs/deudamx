angular
  .module('deudamxApp')
  .filter('urlEncode', function() {
    return window.encodeURIComponent;
  })
  .filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input, decimals) + '%';
  };
}]);
