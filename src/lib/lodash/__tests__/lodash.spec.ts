import { assert, expect } from 'chai';
import { isObject, get, keysOf, debounce } from '..';
import { SinonFakeTimers, useFakeTimers } from 'sinon';

describe('lodash', () => {
  describe('isObject', () => {
    it('return true for object', () => {
      assert.isTrue(isObject({}));
    });

    it('return false for array', () => {
      assert.isFalse(isObject([1, 2]));
    });

    it('return false for string', () => {
      assert.isFalse(isObject('String'));
    });

    it('return false for null', () => {
      assert.isFalse(isObject(null));
    });
  });

  describe('get', () => {
    it('Deep nesting', () => {
      const testData = {
        a: {
          b: {
            c: 'abc',
            d: 'abd',
          },
          c: 'ac',
        },
      };
      assert.equal(get(testData, 'a.b.c'), 'abc');
    });

    it('Return default value', () => {
      const testData = {
        a: {
          b: {
            c: 'abc',
            d: 'abd',
          },
          c: 'ac',
        },
      };
      assert.equal(get(testData, 'a.b.e.c', 'def'), 'def');
    });

    it('Return default value if it is passed as undefined', () => {
      const testData = {
        a: {
          b: {
            c: 'abc',
            d: 'abd',
          },
          c: 'ac',
        },
      };
      assert.equal(get(testData, 'a.b.e.c', undefined), undefined);
    });

    it('Works with nested arrays', () => {
      const testData = {
        a: {
          b: ['ab0', 'ab1', 'ab2'],
        },
      };
      assert.equal(get(testData, 'a.b.2'), 'ab2');
    });
  });

  describe('keysOf', () => {
    const noop = () => {
      /** */
    };
    it('Returns typed Array of keys of received object', () =>
      expect(
        keysOf({ u: undefined, n: 1, s: 'string', bool: true, null: null, f: noop, obj: { x: 'y' } }),
      ).to.deep.eq(['u', 'n', 's', 'bool', 'null', 'f', 'obj']));

    [1, noop, true, 'string', {}].forEach((x) =>
      it('Empty array for not object or empty object', () => {
        expect(keysOf(x)).to.deep.eq([]);
      }),
    );
  });

  describe('debounce', () => {
    let clock: SinonFakeTimers;

    it('Run function after timeout', () => {
      clock = useFakeTimers({
        now: 1483228800000,
        toFake: ['setTimeout', 'clearTimeout'],
      });
      const outer = {
        name: 'first',
      };

      function changeName(name: string) {
        outer.name = name;
      }

      const debouncedChangeName = debounce(changeName, 1000);

      debouncedChangeName('second');

      // Check, that name is not changed synchronously
      expect(outer.name).to.eq('first');

      clock.tick(500);

      // Check, that name is not changed after an half of timeout
      expect(outer.name).to.eq('first');

      debouncedChangeName('third');

      // Name is not changed after second call
      expect(outer.name).to.eq('first');

      clock.tick(500);

      // Check, that name is not changed after an half of timeout after second call
      expect(outer.name).to.eq('first');

      clock.tick(500);

      // Wait for the last value
      expect(outer.name).to.eq('third');

      clock.restore();
    });
  });
});
