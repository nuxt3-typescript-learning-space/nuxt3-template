export type TitleApi = {
  title: string;
};

export default defineEventHandler<TitleApi>(() => {
  return {
    title: 'Hello Nuxt App!',
  };
});
