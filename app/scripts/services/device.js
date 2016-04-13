'use strict';

/**
 * @ngdoc service
 * @name deudamxApp.device
 * @description
 * # device
 * Service in the deudamxApp.
 */

;(function() {


  function device() {
    /* jshint validthis: true */
    var service = this;
    service.isMobile = detectedMobile;
    service.isMobileUserAgent = function() {
      return detectedMobile(window.navigator && navigator.userAgent);
    };
  }

  function detectedMobile(userAgent) {
    return !!userAgent.match(/(android|blackberry|blazer|mobi|ipad|ipod|iphone|iemobile)/ig);
  }

angular.module('deudamxApp')
  .service('device', device);

})();

