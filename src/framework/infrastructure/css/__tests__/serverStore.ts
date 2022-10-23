import { expect } from 'chai';

import { CSSServerProviderStore } from '../provider/serverStore';

describe('generator / generateCss', () => {
  it('Return hash and used mods in addStyles. Return style properites in hash key in style descriptor', () => {
    const store = new CSSServerProviderStore();
    const style = {
      selector: {
        width: '300px',
        height: '200px',

        _mod: {
          color: 'red',
        },
      },
    };
    const addStyleResult = store.addStyles('selector', style['selector'], ['_mod']);

    expect(addStyleResult).to.deep.eq({
      hash: '_mc8cmb',
      usedModifiers: ['_mod'],
    });
    expect(store.getStyles()).to.deep.eq({
      _mc8cmb: { width: '300px', height: '200px', _mod: { color: 'red' } },
    });
  });

  it('Return hash in addStyles. Return style properites in hash key in style descriptor', () => {
    const store = new CSSServerProviderStore();
    const style = {
      selector: {
        width: '300px',
        height: '200px',

        ':hover': {
          color: 'red',
        },
      },
    };
    const addStyleResult = store.addStyles('selector', style['selector']);

    expect(addStyleResult).to.deep.eq({
      hash: '_zowm8f',
      usedModifiers: undefined,
    });
    expect(store.getStyles()).to.deep.eq({
      _zowm8f: { width: '300px', height: '200px', ':hover': { color: 'red' } },
    });
  });
});
