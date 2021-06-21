import { expect } from 'chai';
import { isIE, isBadBrowser } from '../';

describe('Utils core', () => {
  describe('isIE', () => {
    it('True for IE11', () => {
      const UA = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
      expect(isIE(UA)).to.be.true;
    });

    it('True for IE10', () => {
      const UA = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)';
      expect(isIE(UA)).to.be.true;
    });

    it('True for IE9', () => {
      const UA = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)';
      expect(isIE(UA)).to.be.true;
    });

    it('False for Edge', () => {
      const UA =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240';
      expect(isIE(UA)).to.be.false;
    });

    it('False for Chrome', () => {
      const UA =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36';
      expect(isIE(UA)).to.be.false;
    });
  });

  describe('isBadBrowser', () => {
    it('True for Chrome 30', () => {
      const UA =
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.3396.79 Mobile Safari/537.36';
      expect(isBadBrowser(UA)).to.be.true;
    });

    it('True for BB10', () => {
      const UA =
        'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.1+ (KHTML, like Gecko) Version/10.0.0.1337 Mobile Safari/537.1+';
      expect(isBadBrowser(UA)).to.be.true;
    });

    it('True for Android 4', () => {
      const UA =
        'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
      expect(isBadBrowser(UA)).to.be.true;
    });

    it('True for good Chrome', () => {
      const UA =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36';
      expect(isBadBrowser(UA)).to.be.false;
    });
  });
});
