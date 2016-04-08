'use strict';

describe('Directive: graphImages', function () {

  // load the directive's module
  beforeEach(module('deudamxApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<graph-images></graph-images>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the graphImages directive');
  }));
});
