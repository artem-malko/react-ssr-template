import { expect } from 'chai';

import { isIE } from '../';

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
});
