import express from 'express';
import { Html } from '../render/html';
import { getAssets } from '../utils/assets';
import { getAllPolyfillsSourceCode } from '../utils/getPolyfills';
// @TODO_AFTER_REACT_18_RELEASE move to correct import
// All code is based on https://github.com/facebook/react/blob/master/packages/react-dom/src/server/ReactDOMFizzServerNode.js
// And https://github.com/reactwg/react-18/discussions/37
const { pipeToNodeWritable } = require('react-dom/server');

const assetsPromise = getAssets();

export const createApplicationRouter: () => express.Handler = () => (req, res) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-XSS-Protection', '1');
  res.set('X-Frame-Options', 'deny');

  const polyfillsSourceCode = getAllPolyfillsSourceCode(req);

  let didError = false;

  /**
   * For SEO specifically, where the correct status code is extra important,
   * you can use onCompleteAll instead of onReadyToStream as the place
   * where you flush the stream. By that point, you'll definitely know if it errored or not.
   * However, that also delays when you start giving content to the bot,
   * and giving it earlier may give you better rankings due to perf.
   */
  const methodName = req.isSearchBot ? 'onCompleteAll' : 'onReadyToStream';

  assetsPromise.then((assets) => {
    const { startWriting, abort } = pipeToNodeWritable(
      <Html polyfillsSourceCode={polyfillsSourceCode} assets={assets} />,
      res,
      {
        [methodName]() {
          // If something errored before we started streaming, we set the error code appropriately.
          res.status(didError ? 500 : 200);
          res.setHeader('Content-type', 'text/html');
          res.write('<!DOCTYPE html>');

          startWriting();
        },
        // @TODO looks quite silly, need to refactor it
        onError(x: any) {
          didError = true;
          console.error(x);
        },
      },
    );

    // Abandon and switch to client rendering if enough time passes.
    setTimeout(abort, 5000);
  });
};
