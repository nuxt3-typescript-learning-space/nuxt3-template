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
      try {
        this.isFetching = true;
        const { data, error } = await useFetch<TitleApi>('api/title');

        if (error.value) {
          throw new Error('タイトルの取得に失敗しました');
        }

        this.title = data.value?.title || 'タイトルがありません';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.title = 'エラーが発生しました';
      } finally {
        this.isFetching = false;
      }
    },
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
