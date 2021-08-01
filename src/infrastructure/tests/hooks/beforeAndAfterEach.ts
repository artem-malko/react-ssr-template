/* eslint-disable no-console, functional/immutable-data */

import { resetHistory } from 'sinon';
import { cleanup, configure } from '@testing-library/react';
import { colorize } from 'lib/console';
import { DATA_T_ATTRIBUTE_NAME } from '../dom/dt';

let cleanupJSDOM: (() => any) | undefined;
let currentTestTitle: string | undefined;
let currentTestFileName: string | undefined;

exports.mochaHooks = {
  /**
   * Before every test we will do:
   * — Configure testIdAttribute for testing-library
   * — Enable DOM-env for dom-tests
   */
  beforeEach() {
    configure({ testIdAttribute: DATA_T_ATTRIBUTE_NAME });
    currentTestFileName = this.currentTest && this.currentTest.file;
    currentTestTitle = this.currentTest && this.currentTest.title;

    if ((currentTestFileName || 'dom.spec.tsx').endsWith('.tsx')) {
      cleanupJSDOM = require('infrastructure/tests/dom/env')();
    }
  },

  /**
   * After every test we will do:
   * — cleanup after dom-test
   * — Reset Sinon env
   */
  afterEach() {
    currentTestFileName = (this.currentTest && this.currentTest.file) || 'dom.spec.tsx';

    if (currentTestFileName!.endsWith('.tsx')) {
      cleanup();

      if (typeof cleanupJSDOM === 'function') {
        cleanupJSDOM();
        cleanupJSDOM = undefined;
      }
    }

    currentTestTitle = undefined;
    resetHistory();
  },
};

process.on('unhandledRejection', (e) => {
  console.log('\n');
  console.log(colorize('unhandledRejection is occurred during tests run!', 'red'));
  console.log('Test file: ', colorize(currentTestFileName || '', 'cyan'));
  console.log('Test title: ', colorize(currentTestTitle || '', 'cyan'));
  console.log('\n');

  console.log('Original error:');
  console.error(e);
});

process.on('uncaughtException', (e) => {
  console.log('\n');
  console.log(colorize('uncaughtException is occurred during tests run!', 'red'));
  console.log('Test file: ', colorize(currentTestFileName || '', 'cyan'));
  console.log('Test title: ', colorize(currentTestTitle || '', 'cyan'));
  console.log('\n');

  console.log('Original error:');
  console.error(e);
});
