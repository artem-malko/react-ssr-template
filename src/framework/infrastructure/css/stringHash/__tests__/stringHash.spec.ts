import { expect } from 'chai';
import { djb2a, murmurhash2 } from '..';

describe('getStringHash', () => {
  it('Return correct number hash for a string in djb2a', () => {
    expect(djb2a('string')).be.eq(177604197);
  });

  it('Return correct string hash for a string in murmurhash2', () => {
    expect(murmurhash2('1234567890qwertyuiopasdfghjklzxcvbnm[];')).be.eq('3eesko');
  });
});
