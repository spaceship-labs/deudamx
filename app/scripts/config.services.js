angular
  .module('deudamxApp')
  .config(function(RestangularProvider) {
    /* Delete this when the api is used*/
    RestangularProvider.setBaseUrl('resources/');
    /* end of delete */
    //RestangularProvider.setBaseUrl('http://deudamx-api.herokuapp.com/');
    //RestangularProvider.setBaseUrl('http://localhost:1337/');
  });
