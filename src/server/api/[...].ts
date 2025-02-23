import { Hono } from 'hono';

const honoApp = new Hono().basePath('/api').get('/title', async (context) => {
  const response = {
    title: 'Hello Nuxt App!',
  } as const;

  return context.json(response);
});

export type APIResponseType = typeof honoApp;

export default defineEventHandler(async (event) => {
  const { $logger } = useNuxtApp();
  try {
    const request = toWebRequest(event);
    const response = await honoApp.fetch(request);

    return response;
  } catch (error) {
    $logger.error(
      {
        err: error,
        path: event.path,
        method: event.method,
      },
      'API Error occurred',
    );
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
