import { expect } from 'chai';

import { colorize } from '../colorize';

describe('colorize lib', () => {
  it('Return blue text, if passed blue color', () => {
    expect(colorize('text', 'blue')).to.eq('\x1b[1m\x1b[34mtext\x1b[0m');
  });

  it('Return cyan text, if passed cyan color', () => {
    expect(colorize('text', 'cyan')).to.eq('\x1b[1m\x1b[36mtext\x1b[0m');
  });

  it('Return green text, if passed green color', () => {
    expect(colorize('text', 'green')).to.eq('\x1b[1m\x1b[32mtext\x1b[0m');
  });

  it('Return red text, if passed red color', () => {
    expect(colorize('text', 'red')).to.eq('\x1b[1m\x1b[31mtext\x1b[0m');
  });

  it('Return white text, if color is not passed or passed white color', () => {
    expect(colorize('text')).to.eq('\x1b[1m\x1b[37mtext\x1b[0m');
    expect(colorize('text', 'white')).to.eq('\x1b[1m\x1b[37mtext\x1b[0m');
  });

  it('Return yellow text, if passed yellow color', () => {
    expect(colorize('text', 'yellow')).to.eq('\x1b[1m\x1b[33mtext\x1b[0m');
  });
});
