import pino from 'pino';
const isProduction = process.env.NODE_ENV === 'production';

function initLogger() {
  const loggerInstance = pino({
    base: null,
    messageKey: 'message',
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    formatters: {
      level(label) {
        return { pino_level: label };
      },
    },
    transport: isProduction
      ? {
          target: 'pino/file',
        }
      : {
          target: 'pino-pretty',
        },
  });

  return loggerInstance;
}

export default initLogger();
