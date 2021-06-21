import { assert } from 'chai';
import { setNameSpace } from 'shared/lib/infrastructure/logger/utils';

describe('Logger', () => {
  describe('setNameSpace', () => {
    it('return log params with namespacee', () => {
      const rawErrorParams = {
        message: 'Message',
      } as Error;
      const result = {
        message: 'Message',
        'error.stack': undefined,
      };

      assert.deepEqual(setNameSpace(rawErrorParams, 'error'), result);
    });
  });
});
