/* eslint-disable no-console, functional/immutable-data */

const jsdom = require('jsdom');
const KEYS = ['window', 'document'];
const defaultHtml = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';

module.exports = function initJSDOMEnv(html, options) {
  if (html === undefined) {
    html = defaultHtml;
  }

  if (options === undefined) {
    options = {
      pretendToBeVisual: true,
    };
  }

  if (
    global.navigator &&
    global.navigator.userAgent &&
    global.navigator.userAgent.indexOf('Node.js') > -1 &&
    global.document &&
    typeof global.document.destroy === 'function'
  ) {
    return global.document.destroy;
  }

  const { window } = new jsdom.JSDOM(html, options);

  KEYS.forEach((key) => {
    global[key] = window[key];
  });

  global.document = window.document;
  global.window = window;
  window.console = global.console;
  document.destroy = cleanup;

  function cleanup() {
    KEYS.forEach((key) => {
      delete global[key];
    });
  }

  return cleanup;
};
