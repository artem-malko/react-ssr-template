import { expect } from 'chai';

import { patchUrlProtocol } from '../utils/patchUrlProtocol';

describe('patchUrlProtocol', () => {
  it('add http for protocol-less url', () => {
    const url = '//domain.com';
    const result = 'http://domain.com';

    expect(patchUrlProtocol(url)).to.be.eq(result);
  });

  it('nothing to change in url with protocol', () => {
    const url = 'https://domain.com';
    const result = 'https://domain.com';

    expect(patchUrlProtocol(url)).to.be.eq(result);
  });
});
