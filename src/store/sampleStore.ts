import type { TitleApi } from '@/server/api/title';

type State = {
  title?: string;
  isFetching: boolean;
};

const DEFAULT_STATE: State = {
  title: '',
  isFetching: false,
};

export const useSampleStore = defineStore('sample', {
  state: () => ({ ...DEFAULT_STATE }),
  actions: {
    async fetchTitle() {
      const { data, status } = await useFetch<TitleApi>('api/title');
      const title = data.value?.title || 'No title available';
      const isFetching = status.value === 'pending';
      this.title = title;
      this.isFetching = isFetching;
    },
  },
});
