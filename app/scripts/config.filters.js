angular
  .module('deudamxApp')
  .filter('urlEncode', function() {
    return window.encodeURIComponent;
  })
  .filter('percentage', ['$filter', function($filter) {
    return function(input, decimals) {
      return $filter('number')(input, decimals) + '%';
    };
  }])
  .filter('mdp', ['$filter', function($filter) {
    return function(input, decimals) {
      var mdp = input > 100000 ? input / 1000000 : false;
      if(mdp){
        return $filter('currency')(mdp, decimals) + ' MDP';
      }else{
        return $filter('currency')(input, decimals);
      }
    };
  }]);
