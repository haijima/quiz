'use strict';

describe('Service: events', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var events;
  beforeEach(inject(function (_events_) {
    events = _events_;
  }));

  it('should do something', function () {
    expect(!!events).toBe(true);
  });

});
