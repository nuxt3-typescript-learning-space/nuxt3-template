type ErrorInstance = {
  $: {
    type?: {
      name?: string;
    };
  };
};

interface ErrorInfo {
  message: string;
  stack?: string;
  componentName: string;
  date: string;
  environment: string;
  errorInfo: string;
  userMessage?: string;
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const { $logger } = useNuxtApp();
  const isDevelopment = config.public.NUXT_ENV !== 'production';

  const createErrorInfo = (error: unknown, instance: ErrorInstance | null, info: string): ErrorInfo => ({
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    componentName: instance?.$.type?.name ?? 'Unknown',
    date: new Date().toISOString(),
    environment: config.public.NUXT_ENV,
    errorInfo: info,
  });

  const logError = (error: unknown, errorInfo: ErrorInfo) => {
    if (isDevelopment) {
      $logger.error({
        group: 'Error Details',
        error,
        component: errorInfo.componentName,
        ...errorInfo,
      });
    } else {
      $logger.error({
        message: errorInfo.message,
        componentName: errorInfo.componentName,
      });
    }
  };

  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    $logger.warn('Vue Error occurred');
    const errorInfo = createErrorInfo(error, instance as ErrorInstance | null, info);
    logError(error, errorInfo);
  };

  nuxtApp.hook('vue:error', (error, instance, info) => {
    $logger.warn('Vue Hook Error:', error);
    const errorInfo = createErrorInfo(error, instance as ErrorInstance | null, info);
    logError(error, errorInfo);
  });
});
