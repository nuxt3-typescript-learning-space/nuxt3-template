import type { TitleApi } from './types/apiTypes';

export default defineEventHandler<TitleApi>(() => {
  return {
    title: 'Hello Nuxt App!',
  };
});
