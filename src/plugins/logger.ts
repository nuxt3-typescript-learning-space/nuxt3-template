import pino from 'pino';
import type { Logger } from 'pino';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const isDevelopment = config.public.NUXT_ENV !== 'production';

  const logger = pino({
    level: isDevelopment ? 'debug' : 'info',
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: true,
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  }) as Logger;

  return {
    provide: {
      logger,
    },
  };
});
