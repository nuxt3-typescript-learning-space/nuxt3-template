import type { TitleApi } from '@/server/api/title';

type State = {
  title?: string;
  isFetching: boolean;
  count: number;
};

export const useSampleStore = defineStore('sample', {
  state: (): State => ({
    title: '',
    isFetching: false,
    count: 0,
  }),
  getters: {
    getCount: (state) => state.count,
    getCount2(state) {
      return state.count + 2;
    },
    getCount3: (state: State) => (num: number) => state.count + num,
    getCount4(state: State) {
      return (num: number) => state.count + num;
    },
    getCount5: (state: State) => (num: number) => {
      state.count += num;
      return state.count + num;
    },
    getCount6(state) {
      return (num: number) => {
        state.count += num;
        return state.count + num;
      };
    },
  },
  actions: {
    async fetchTitle() {
      const { data, status } = await useFetch<TitleApi>('api/title');
      const title = data.value?.title || 'No title available';
      const isFetching = status.value === 'pending';
      this.title = title;
      this.isFetching = isFetching;
    },
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
