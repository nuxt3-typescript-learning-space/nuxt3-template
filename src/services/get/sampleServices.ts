import { hc } from 'hono/client';
import type { APIResponseType } from '@/server/api/[...]';

export const fetchTitle = async () => {
  const config = useRuntimeConfig();
  const { API_URL } = config.public;

  const client = hc<APIResponseType>(API_URL);

  const response = await client.api.title.$get();

  if (!response.ok) {
    throw new Error('Failed to fetch title');
  }

  return response.json();
};
