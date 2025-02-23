import { fetchTitle } from '@/services/get/sampleServices';

type State = {
  title: string;
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
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    async updateTitle() {
      const { $logger } = useNuxtApp();
      try {
        this.isFetching = true;
        const response = await fetchTitle();
        const { title } = response;
        this.title = title;
      } catch (error) {
        $logger.warn('Error:', error);
        this.title = 'No title available';
        throw error;
      } finally {
        this.isFetching = false;
      }
    },
  },
});
