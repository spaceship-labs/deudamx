'use strict';

describe('Controller: EntityCtrl', function () {

  // load the controller's module
  beforeEach(module('deudamxApp'));

  var EntityCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntityCtrl = $controller('EntityCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(EntityCtrl.awesomeThings.length).toBe(3);
  });
});
