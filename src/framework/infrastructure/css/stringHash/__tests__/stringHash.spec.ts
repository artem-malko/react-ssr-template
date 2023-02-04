import { expect } from 'chai';

import { murmurhash2 } from '..';

describe('getStringHash', () => {
  it('Return correct string hash for a string in murmurhash2', () => {
    expect(murmurhash2('1234567890qwertyuiopasdfghjklzxcvbnm[];')).be.eq('3eesko');
  });
});
