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

  const createErrorInfo = (error: unknown, instance: ErrorInstance | null, info: string): ErrorInfo => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const componentName = instance?.$.type?.name ?? 'Unknown';

    const userMessage = isDevelopment ? errorMessage : 'エラーが発生しました。時間をおいて再度お試しください。';

    return {
      message: errorMessage,
      stack: errorStack,
      componentName,
      date: new Date().toISOString(),
      environment: config.public.NUXT_ENV,
      errorInfo: info,
      userMessage,
    };
  };

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
        date: errorInfo.date,
        errorInfo: errorInfo.errorInfo,
      });
    }
  };

  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    if (isDevelopment) {
      $logger.warn('Vue Error:', error);
    } else {
      $logger.warn('Vue Error occurred');
    }

    const errorInfo = createErrorInfo(error, instance as ErrorInstance | null, info);
    logError(error, errorInfo);
  };

  nuxtApp.hook('vue:error', (error, instance, info) => {
    if (isDevelopment) {
      $logger.warn('Vue Hook Error:', error);
    } else {
      $logger.warn('Vue Hook Error occurred');
    }

    const errorInfo = createErrorInfo(error, instance as ErrorInstance | null, info);
    logError(error, errorInfo);
  });
});
