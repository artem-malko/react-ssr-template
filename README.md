# React application with Streaming Server Side Rendering

A simple template for a website with SSR (with streams) and React 18 with a brand new API — https://github.com/reactwg/react-18/discussions 🔥🔥🔥

🚀 Just start with

```bash
npm i && make dev
```
If you want to see this project in action: http://158.101.223.0:5000/

🚧 🛠️ Work In Progress 🛠️ 🚧

## Base commands

First off, I'm using make) It's not necessary, but as I think it is much powerful than npm from the box.

So, let's talk about base commands.

* `make dev` — starts a dev-server with a file-watcher + tsc in a watch mode.
* `make prod` — builds a production version of your application.
* `make start-prod` — starts built application. Quite useful after `make prod`.
* `make test` — starts eslint, prettier, tsc and unit-tests

## Technologies

* [typescript](https://www.typescriptlang.org/) as the main language.
* [Express.js](https://expressjs.com/) as a server. I think about fastify as a replacement for Express.js.
* [React](https://reactjs.org/) as a view layer. Render to a stream is used for SSR.
* [React-query](https://react-query.tanstack.com/) as a layer for working with external data.
* Own version of CSS-in-JS. Inspired by [aphrodite](https://github.com/Khan/aphrodite). You can find an implementation [here](https://github.com/artem-malko/react-ssr-template/blob/main/src/framework/infrastructure/css). I need my own implementation, cause there is no any other ready solutions in CSS-in-JS, which will work with new React SSR API.
* My own router, which was created to work with redux. Find more info [here](https://github.com/artem-malko/react-ssr-template/blob/main/src/framework/infrastructure/router). Checkout tests, you will find all cases there. Redux us used under the hood. Acutally, you can use the template and do not know about that fact) If you'd like to use redux for your own state — you can wrap your application with a Provider. Redux in the router uses its own context.
* [webpack](https://webpack.js.org/) + [esbuild](https://esbuild.github.io/) to build the project.
* [pino](https://github.com/pinojs/pino) as fast and light logger.
* [mocha](https://mochajs.org/) + [chai](https://www.chaijs.com/) + [sinon](https://sinonjs.org/) + [React testing library](https://testing-library.com/docs/react-testing-library/intro/) to work with tests.
* [eslint](https://eslint.org/) to find mistakes in the code.
* [prettier](https://prettier.io/) to forget about code style.

I've tried to add as many comments in the source code as I could. So, all interesting places have dozens of comments to describe, what's happening there. I do apologize for my english)

As you can see, there is no any state manager for your own data. Redux is used in the router only, react-query is used for any data-fetching. So, you can use anything for any additional data-managment.

If you want to figure out, how it works, just start from:
* https://github.com/artem-malko/react-ssr-template/blob/main/src/application/entry/server/index.tsx for a server-side part of the application.
* https://github.com/artem-malko/react-ssr-template/blob/main/src/application/entry/client/index.tsx for a client-side part of the application.

But I recommend you to start from https://github.com/reactwg/react-18/discussions cause, there a lot of useful information, which can help you to work with current repo.

Fell free to ask me anything in the [issues](https://github.com/artem-malko/react-ssr-template/issues/new).

