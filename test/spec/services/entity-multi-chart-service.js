'use strict';

describe('Service: entityMultiChartService', function () {

  // load the service's module
  beforeEach(module('deudamxApp'));

  // instantiate service
  var entityMultiChartService,
    entity, obligations;
  beforeEach(inject(function (_entityMultiChartService_) {
    entityMultiChartService = _entityMultiChartService_;
    entity = {
      name: 'State',
      stats: [{
        debt: 283.6,
        perCapita: 352.08120214128934,
        population: 805496,
        year: "1993"
      },{
        debt: "364",
        debtpib: "2.74636289881018",
        perCapita: 436.3943278328466,
        population: 834108,
        year: "2010"
      },{
        debt: "307.5",
        perCapita: 356.4308234421365,
        population: 862720,
        year: "2015"
      }]
    };

    obligations = [{
      acredited: 'group 1',
      ammount: '292000000',
      signDate: '2011-10-13T04:00:00.000Z',
    }, {
      acredited: 'group 1',
      ammount: '21212',
      signDate: '2011-10-13T04:00:00.000Z',
    }, {
      acredited: 'group 2',
      ammount: '2100',
      signDate: '2011-10-13T04:00:00.000Z',
    }];
  }));

  it('should defined options for chart', function () {
    expect(entityMultiChartService.multiChart().chart.type).to.equal('multiChart');
  });

  it('should format data for chart line-bar', function() {
    var format = entityMultiChartService.formatEntityLineBar(entity, obligations),
      line = format[0],
      bar = format[1];
    expect(format.length).to.equal(2);
    expect(line.type).to.equal('line');
    expect(line.values).to.eql([{x: 1993, y: 283.6}, {x: 2010, y: 364}, {x: 2015, y: 307.5}]);
    expect(bar.type).to.equal('bar');
    expect(bar.values).to.eql([{x: 2011, y: 292023312}, {x: 1993, y: 0}, {x: 2010, y: 0},{x: 2015, y: 0}]);
  });

  it.skip('should format data for chat scatter-line', function () {
    var format = entityMultiChartService.formatEntityScatterLine(entity, obligations),
      line = format[2],
      scatter1 = format[0],
      scatter2 = format[1];
      expect(line.type).to.equal('line');
      expect(line.values).to.eql([{x: 1993, y: 283.6}, {x: 2010, y: 364}, {x: 2015, y: 307.5}]);
      expect(scatter1.key).to.equal('group 1');
      expect(scatter1.type).to.equal('scatter');
      expect(scatter1.values).to.eql([{x: 2011, y: 292021212, shape: 'circle'}]);
      expect(scatter2.key).to.equal('group 2');
      expect(scatter2.type).to.equal('scatter');
      expect(scatter2.values).to.eql([{x: 2011, y: 2100, shape: 'circle'}]);

  });
});
