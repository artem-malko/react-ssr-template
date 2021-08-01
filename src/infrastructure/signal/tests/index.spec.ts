import { expect } from 'chai';
import { sequence, parallel, commonWithSelectors, noop, createSignal } from '..';

describe('Signal', () => {
  describe('createSignal', () => {
    it('return INTERNAL/ACTION_SIGNAL action with one action in payload and param', () => {
      const action = {
        type: 'TYPE',
        payload: 'payload',
      };
      const expected = {
        type: 'INTERNAL/ACTION_SIGNAL',
        payload: action,
        name: 'signalName',
        params: {
          param: 'param',
        },
      };

      expect(
        createSignal('signalName', (_params: { param: 'param' }) => action)({ param: 'param' }),
      ).deep.eq(expected);
    });

    it('return INTERNAL/ACTION_SIGNAL action with one action in payload and no params', () => {
      const action = {
        type: 'TYPE',
        payload: 'payload',
      };
      const expected = {
        type: 'INTERNAL/ACTION_SIGNAL',
        payload: action,
        name: 'signalName',
        params: undefined,
      };

      expect(createSignal('signalName', () => action)()).deep.eq(expected);
    });
  });

  describe('sequence', () => {
    it('return INTERNAL/ACTION_SEQUENCE action with empty array in payload in case of no actions in sequence', () => {
      const expected = {
        type: 'INTERNAL/ACTION_SEQUENCE',
        payload: [],
      };

      expect(sequence()).deep.eq(expected);
    });

    it('return INTERNAL/ACTION_SEQUENCE action with one action in payload', () => {
      const action = {
        type: 'TYPE',
        payload: 'payload',
      };
      const expected = {
        type: 'INTERNAL/ACTION_SEQUENCE',
        payload: [action],
      };

      expect(sequence(action)).deep.eq(expected);
    });

    it('return INTERNAL/ACTION_SEQUENCE action with two actions in payload', () => {
      const action1 = {
        type: 'TYPE1',
        payload: 'payload1',
      };
      const action2 = {
        type: 'TYPE2',
        payload: 'payload2',
      };
      const expected = {
        type: 'INTERNAL/ACTION_SEQUENCE',
        payload: [action1, action2],
      };

      expect(sequence(action1, action2)).deep.eq(expected);
    });
  });

  describe('parallel', () => {
    it('return INTERNAL/ACTION_PARALLEL action with empty array in payload in case of no actions in parallel', () => {
      const expected = {
        type: 'INTERNAL/ACTION_PARALLEL',
        payload: [],
      };

      expect(parallel()).deep.eq(expected);
    });

    it('return INTERNAL/ACTION_PARALLEL action with one action in payload', () => {
      const action = {
        type: 'TYPE',
        payload: 'payload',
      };
      const expected = {
        type: 'INTERNAL/ACTION_PARALLEL',
        payload: [action],
      };

      expect(parallel(action)).deep.eq(expected);
    });
  });

  describe('withSelectors', () => {
    it('return INTERNAL/ACTION_WITH_SELECTORS', () => {
      const actionCreator = ({ param }: any) => ({
        type: 'WITH_SELECTORS_TYPE',
        payload: `PAYLOAD_FOR_WITH_SELECTORS_WITH_VALUE_${param}`,
      });
      const selectors = { param: (_state: Record<string, unknown>) => 'value' };
      const actual = commonWithSelectors(selectors, actionCreator);
      const expected = {
        type: 'INTERNAL/ACTION_WITH_SELECTORS',
        payload: ({ param }: any) => ({
          type: 'WITH_SELECTORS_TYPE',
          payload: `PAYLOAD_FOR_WITH_SELECTORS_WITH_VALUE_${param}`,
        }),
        selectors: { param: (_state: Record<string, unknown>) => 'value' },
      };

      function getSelectorsString(obj: { [key: string]: (state: any) => any }) {
        return Object.keys(obj).reduce((s, sLabel) => {
          s = s + (sLabel as string) + '_' + obj[sLabel]!.toString();
          return s;
        }, '');
      }

      expect(actual.type).eq('INTERNAL/ACTION_WITH_SELECTORS');
      expect(getSelectorsString(actual.selectors)).eq(getSelectorsString(expected.selectors));

      expect(actual.payload({ param: 'q' })).deep.eq(expected.payload({ param: 'q' }));
    });
  });

  describe('noop', () => {
    it('return INTERNAL/ACTION_NOOP action with empty payload', () => {
      const expected = {
        type: 'INTERNAL/ACTION_NOOP',
      };

      expect(noop()).deep.eq(expected);
    });
  });
});
