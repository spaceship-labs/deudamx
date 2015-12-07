angular
  .module('deudamxApp')
  .config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://deudamx-api.herokuapp.com/');
  });
