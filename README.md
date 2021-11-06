# react-ssr-template

Simple template for a website with SSR and React 18 with a brand new API — https://github.com/reactwg/react-18/discussions

Just start with

```bash
npm i && make dev
```

If you want to see this project in action: http://158.101.223.0:5000/

Work In Progress

## Technologies

* [typescript](https://www.typescriptlang.org/) as the main language.
* [Express.js](https://expressjs.com/) as a server. I think about fastify as a replacement for Express.js.
* [React](https://reactjs.org/) as a view layer. Render to a stream is used for SSR.
* [Redux](https://redux.js.org/) as a state for the application context: current page, query string etc.
* [React-query](https://react-query.tanstack.com/) as a layer for working with external data.
* Own version of CSS-in-JS. Inspired by [aphrodite](https://github.com/Khan/aphrodite). You can find an implementation [here](https://github.com/artem-malko/react-ssr-template/tree/main/src/infrastructure/css). I need my own implementation, cause there is no any other ready solutions in CSS-in-JS, which will work with new React SSR API.
* My own router, which was created to work with redux. Find more info [here](https://github.com/artem-malko/react-ssr-template/tree/main/src/infrastructure/router). Checkout tests, you will find all cases there.
* [webpack](https://webpack.js.org/) + [esbuild](https://esbuild.github.io/) to build the project.
* [pino](https://github.com/pinojs/pino) as fast and light logger.
* [mocha](https://mochajs.org/) + [chai](https://www.chaijs.com/) + [sinon](https://sinonjs.org/) + [React testing library](https://testing-library.com/docs/react-testing-library/intro/) to work with tests.
* [eslint](https://eslint.org/) to find mistakes in the code.
* [prettier](https://prettier.io/) to forget about code style.

I've tried to add as many comments in the source code as I could. So, all interesting places have dozens of comments to describe, what's happening there. I do apologize for my english)

If you want to figure out, how it works, just start from:
* https://github.com/artem-malko/react-ssr-template/blob/main/src/applications/server/index.ts for a server-side part of the application.
* https://github.com/artem-malko/react-ssr-template/blob/main/src/applications/client/index.tsx for a client-side part of the application.

But I recommend you to start from https://github.com/reactwg/react-18/discussions cause, there a lot of useful information, which can help you to work with current repo.

Fell free to ask me anything in the [issues](https://github.com/artem-malko/react-ssr-template/issues/new).

