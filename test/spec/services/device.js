'use strict';

describe('Service: device', function () {

  // load the service's module
  beforeEach(module('deudamxApp'));

  // instantiate service
  var device;
  beforeEach(inject(function (_device_) {
    device = _device_;
  }));

  it('should do something', function () {
    expect(!!device).to.equal(true);
  });

  var desktopsUserAgents = {
    firefoxWindows: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
    firefoxLinux: 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0',
    ie: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
    safariX: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A',
    safariWindows: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; tr-TR) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27',
    chromeWindows: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    chromeLinux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
    chromeX: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36'
  };

  var mobileUserAgents = {
    android: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30' ,
    blackberry: 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+',
    blazer: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows 95; PalmSource; Blazer 3.0) 16; 160x160',
    operaMobile: 'Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02',
    operaMini: 'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54',
    ipad: 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25',
    iphone: 'Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
    ipod: 'Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_1 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8G4 Safari/6533.18.5'
  };

  it('should return false when detected if a user agent is Desktop', function(){
    expect(device.isMobile(desktopsUserAgents.firefoxWindows)).to.equal(false);
    expect(device.isMobile(desktopsUserAgents.firefoxLinux)).to.equal(false);
    expect(device.isMobile(desktopsUserAgents.ie)).to.equal(false);
    expect(device.isMobile(desktopsUserAgents.safariX)).to.equal(false);
    expect(device.isMobile(desktopsUserAgents.safariWindows)).to.equal(false);
    expect(device.isMobile(desktopsUserAgents.chromeWindows)).to.equal(false);
    expect(device.isMobile(desktopsUserAgents.chromeLinux)).to.equal(false);
    expect(device.isMobile(desktopsUserAgents.chromeX)).to.equal(false);
  });

  it('should return true when detected if a user agent is mobile', function() {
    expect(device.isMobile(mobileUserAgents.android)).to.equal(true);
    expect(device.isMobile(mobileUserAgents.blackberry)).to.equal(true);
    expect(device.isMobile(mobileUserAgents.blazer)).to.equal(true);
    expect(device.isMobile(mobileUserAgents.operaMobile)).to.equal(true);
    expect(device.isMobile(mobileUserAgents.operaMini)).to.equal(true);
    expect(device.isMobile(mobileUserAgents.ipad)).to.equal(true);
    expect(device.isMobile(mobileUserAgents.iphone)).to.equal(true);
    expect(device.isMobile(mobileUserAgents.ipod)).to.equal(true);
  });

});
