type LogParams = Parameters<typeof console.log>;
export const devConsoleLog = (...logParams: LogParams) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(...logParams);
  }
};

type ErrorParams = Parameters<typeof console.error>;
export const devConsoleError = (...logParams: ErrorParams) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(...logParams);
  }
};
