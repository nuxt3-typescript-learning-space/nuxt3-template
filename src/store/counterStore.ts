type State = {
  count: number;
};

export const useCounterStore = defineStore('counter', {
  state: (): State => ({
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
  },
});
