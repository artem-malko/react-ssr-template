import { expect } from 'chai';
import { normalizePath } from '../utils';

describe('router utils', () => {
  describe('normalizePath', () => {
    it('normalizePath correctly normalize an original path', () => {
      const series: Array<[string, string]> = [
        ['/', '/'],
        ['/user', '/user'],
        ['/user/:id', '/user/:p'],
        ['/user/:name', '/user/:p'],
        ['/user/:name/:id?', '/user/:p'],
        ['/user/:name?', '/user'],
        ['/user/:name?/:id?', '/user'],
        ['/user/:id/:name', '/user/:p/:p'],
      ];

      series.forEach((testCase) => {
        expect(normalizePath(testCase[0])).be.eq(testCase[1]);
      });
    });
  });
});
