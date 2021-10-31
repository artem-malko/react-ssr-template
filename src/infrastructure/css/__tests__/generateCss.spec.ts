import { expect } from 'chai';
import { generateCss } from '../generator';
import { createStyles } from '../hook';

describe('generator / generateCss', () => {
  it('Generate correct styles for simple styles object: no prefixes, no rtlify, one className', () => {
    const styles = createStyles({
      hash1: {
        width: '300px',
        height: '200px',
      },
    });

    expect(generateCss(styles)).be.eq('.hash1{width:300px;height:200px}');
  });

  it(`Generate correct styles for simple styles object: no prefixes, no rtlify, one className
      Used cached value! We add more styles to the same hash to check, that result the same`, () => {
    const styles = createStyles({
      hash1: {
        width: '300px',
        height: '300px',
      },
    });

    expect(generateCss(styles)).be.eq('.hash1{width:300px;height:200px}');
  });

  it(`Generate correct styles for simple styles object: no prefixes, no rtlify, one className
      Replace value 100 in number to 100px and 0 to just 0, without px`, () => {
    const styles = createStyles({
      hash1_1: {
        width: 100,
        height: 0,
      },
    });

    expect(generateCss(styles)).be.eq('.hash1_1{width:100px;height:0}');
  });

  it(`Generate correct styles for styles object with className, pseudoelement
      and pseudoelement with mod`, () => {
    const styles = createStyles({
      hash1_3: {
        width: '300px',
        height: '300px',

        ':after': {
          color: 'green',
        },

        _mod: {
          ':after': {
            color: 'red',
          },
        },
      },
    });

    expect(generateCss(styles)).be.eq(
      '.hash1_3{width:300px;height:300px}.hash1_3:after{color:green}.hash1_3._mod:after{color:red}',
    );
  });

  it(`Generate correct styles for complex styles object:
      one className with pseudo elements and child elements.
      Check that one property value does not have ; in the end`, () => {
    const styles = createStyles({
      hash2: {
        width: '300px',
        height: '200px',

        ':hover': {
          color: 'red',
        },

        '[data-el] > &': {
          color: 'green',
        },
      },
    });

    expect(generateCss(styles)).be.eq(
      '.hash2{width:300px;height:200px}.hash2:hover{color:red}[data-el]>.hash2{color:green}',
    );
  });

  it(`Generate correct styles for complex styles object: prefixes for style property value,
      Check media queries and modificator.`, () => {
    const styles = createStyles({
      hash3: {
        display: 'flex',

        '@media screen and (max-width: 500px)': {
          color: 'blue',
        },

        _red: {
          transform: 'translateX(10px)',
        },
      },
    });

    expect(generateCss(styles)).be.eq(
      '.hash3{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex}@media screen and (max-width:500px){.hash3{color:blue}}.hash3._red{transform:translateX(10px)}',
    );
  });

  it(`Generate correct styles for complex styles object: rtlify to ltr,
      Check media queries with hover selector inside`, () => {
    const styles = createStyles({
      hash4: {
        display: 'block',
        paddingInlineStart: '10px',

        '@media screen and (max-width: 500px) and (max-height: 200px)': {
          color: 'blue',
          paddingInlineStart: '20px',

          ':hover': {
            color: 'red',
          },
        },
      },
    });

    expect(generateCss(styles, 'ltr')).be.eq(
      '.hash4{display:block;padding-left:10px}@media screen and (max-width:500px) and (max-height:200px){.hash4{color:blue;padding-left:20px}.hash4:hover{color:red}}',
    );
  });

  it(`Generate correct styles for complex styles object: rtlify to rtl,
      Check media queries with modificators with :hover and :focus and
      simple modificator with :hover and :focus`, () => {
    const styles = createStyles({
      hash5: {
        display: 'block',
        paddingInlineStart: '10px',

        _mod: {
          color: 'blue',

          ':hover': {
            color: 'red',
          },

          ':focus': {
            color: 'green',
          },
        },

        '@media screen and (max-width: 1024px)': {
          _mod: {
            color: 'yellow',

            ':hover': {
              color: 'black',
            },

            ':focus': {
              color: 'white',
            },
          },
        },
      },
    });

    expect(generateCss(styles, 'rtl')).be.eq(
      '.hash5{display:block;padding-right:10px}.hash5._mod{color:blue}.hash5._mod:hover{color:red}.hash5._mod:focus{color:green}@media screen and (max-width:1024px){.hash5._mod{color:yellow}.hash5._mod:hover{color:black}.hash5._mod:focus{color:white}}',
    );
  });

  it(`Generate correct styles for complex styles object: rtlify to rtl,
      Check two media queries with mods inside`, () => {
    const styles = createStyles({
      hash6: {
        display: 'block',
        paddingInlineStart: '10px',

        '@media screen and (max-width: 1024px)': {
          _tablet: {
            display: 'inline',
          },
        },

        '@media screen and (max-width: 480px)': {
          _mobile: {
            display: 'inline-block',
          },
        },
      },
    });

    expect(generateCss(styles, 'rtl')).be.eq(
      '.hash6{display:block;padding-right:10px}@media screen and (max-width:1024px){.hash6._tablet{display:inline}}@media screen and (max-width:480px){.hash6._mobile{display:inline-block}}',
    );
  });

  it(`Generate correct styles for complex styles object: rtlify to rtl,
      Check animations`, () => {
    const keyframeNames = {
      translate: 'translate',
      opacity: 'opacity',
    };
    const styles = createStyles({
      hash7: {
        // @TODO fix types
        animationName: [keyframeNames.translate, keyframeNames.opacity] as any,
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    expect(generateCss(styles as any)).be.eq(
      '.hash7{animation-name:translate,opacity;animation-duration:3s, 1200ms;animation-iteration-count:infinite}',
    );
  });

  it('Generate keyframes in global namespace', () => {
    const keyframeNames = {
      translate: 'translate',
      opacity: 'opacity',
    };
    const styles = createStyles({
      ':global': {
        [`@keyframes ${keyframeNames.translate}`]: {
          '0%': {
            transform: 'translateX(0)',
          },

          '50%': {
            transform: 'translateX(100px)',
          },

          '100%': {
            transform: 'translateX(0)',
          },
        },

        [`@keyframes ${keyframeNames.opacity}`]: {
          from: {
            opacity: 0,
          },

          to: {
            opacity: 1,
          },
        },
      },
    });

    expect(generateCss(styles as any)).be.eq(
      '@keyframes translate{0%{transform:translateX(0)}50%{transform:translateX(100px)}100%{transform:translateX(0)}}@keyframes opacity{from{opacity:0}to{opacity:1}}',
    );
  });

  it('Generate correct styles for simple styles object with ms style property', () => {
    const styles = createStyles({
      hash8: {
        msOverflowY: 'visible',
      },
    });

    expect(generateCss(styles as any)).be.eq('.hash8{-ms-overflow-y:visible}');
  });

  it(`Generate correct styles for simple styles object with prefixed style property.
      All prefixes are floated to top`, () => {
    const styles = createStyles({
      hash9: {
        display: 'block',
        transition: '200ms all linear',
      },
    });

    expect(generateCss(styles)).be.eq(
      '.hash9{-webkit-transition:200ms all linear;-moz-transition:200ms all linear;display:block;transition:200ms all linear}',
    );
  });

  it(`Generate correct styles for styles object with @supports.
      All prefixes are floated to top, check ltr`, () => {
    const styles = createStyles({
      hash10: {
        paddingInlineStart: '20px',

        '@supports (-webkit-touch-callout: none)': {
          transition: '200ms all linear',
          paddingInlineEnd: '10px',
        },
      },
    });

    expect(generateCss(styles)).be.eq(
      '.hash10{padding-left:20px}@supports (-webkit-touch-callout:none){.hash10{-webkit-transition:200ms all linear;-moz-transition:200ms all linear;transition:200ms all linear;padding-right:10px}}',
    );
  });

  it(`Generate correct styles for styles object with @supports.
      All prefixes are floated to top, check rtl`, () => {
    const styles = createStyles({
      hash11: {
        paddingInlineStart: '20px',

        '@supports (-webkit-touch-callout: none)': {
          transition: '200ms all linear',
          paddingInlineEnd: '10px',
        },
      },
    });

    expect(generateCss(styles, 'rtl')).be.eq(
      '.hash11{padding-right:20px}@supports (-webkit-touch-callout:none){.hash11{-webkit-transition:200ms all linear;-moz-transition:200ms all linear;transition:200ms all linear;padding-left:10px}}',
    );
  });
});
