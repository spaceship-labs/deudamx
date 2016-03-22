angular
  .module('deudamxApp')
  .config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('http://deudamx-api.herokuapp.com/');
    //RestangularProvider.setBaseUrl('http://localhost:1337/');
  });
