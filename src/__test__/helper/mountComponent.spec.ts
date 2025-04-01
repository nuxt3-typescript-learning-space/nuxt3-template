import { defineStore } from 'pinia';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { defineComponent, h, ref, computed, defineAsyncComponent, nextTick } from 'vue';
import { bindTestingPinia, mountComponent, mountSuspendedComponent } from '@/helper/test';

// 基本的なテスト用のコンポーネント
const TestComponent = defineComponent({
  props: {
    message: {
      type: String,
      default: 'デフォルトメッセージ',
    },
  },
  setup(props) {
    const count = ref(0);
    const doubledCount = computed(() => count.value * 2);

    const increment = () => {
      count.value++;
    };

    return {
      count,
      doubledCount,
      increment,
      message: props.message,
    };
  },
  render() {
    return h('div', [
      h('h1', this.message),
      h('p', `Count: ${this.count}`),
      h('p', `Doubled: ${this.doubledCount}`),
      h('button', { onClick: this.increment }, 'Increment'),
    ]);
  },
});

// 非同期コンポーネント
const AsyncComponent = defineComponent({
  setup() {
    const asyncData = ref('非同期データ');
    return { asyncData };
  },
  render() {
    return h('div', [h('p', `Async data: ${this.asyncData}`)]);
  },
});

// 非同期コンポーネントの定義
const AsyncTestComponent = defineAsyncComponent(() => Promise.resolve(AsyncComponent));

// スロット付きコンポーネント
const SlottedComponent = defineComponent({
  render() {
    return h('div', [
      h('header', {}, this.$slots.header ? this.$slots.header() : 'デフォルトヘッダー'),
      h('main', {}, this.$slots.default ? this.$slots.default() : 'デフォルトコンテンツ'),
      h('footer', {}, this.$slots.footer ? this.$slots.footer() : 'デフォルトフッター'),
    ]);
  },
});

// 子コンポーネント
const ChildComponent = defineComponent({
  render() {
    return h('div', 'Child Component');
  },
});

// 親コンポーネント
const ParentComponent = defineComponent({
  components: {
    ChildComponent,
  },
  render() {
    return h('div', [h('h1', 'Parent Component'), h(ChildComponent)]);
  },
});

// カスタムボタンコンポーネント
const CustomButton = defineComponent({
  name: 'CustomButton',
  render() {
    return h('button', '複雑なボタン');
  },
});

// スタブテスト用コンポーネント
const StubTestComponent = defineComponent({
  components: {
    CustomButton,
  },
  render() {
    return h('div', [h('h1', 'Main Component'), h(CustomButton)]);
  },
});

// Routerモック用コンポーネント
const MockTestComponent = defineComponent({
  methods: {
    navigate() {
      this.$router.push('/test');
    },
  },
  render() {
    return h('button', { onClick: this.navigate }, 'Navigate');
  },
});

// Piniaストア定義
const useCounterStore = defineStore('counter', {
  state: () => ({
    globalCount: 0,
  }),
  actions: {
    increment() {
      this.globalCount++;
    },
  },
});

// Piniaを使用するコンポーネント
const StoreComponent = defineComponent({
  setup() {
    const store = useCounterStore();

    return {
      store,
      incrementGlobal: () => store.increment(),
    };
  },
  render() {
    return h('div', [
      h('p', `Global count: ${this.store.globalCount}`),
      h('button', { onClick: this.incrementGlobal }, 'Increment Global'),
    ]);
  },
});

describe('src/helper/test/mountComponent.ts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('基本的なコンポーネントをマウントできること', async () => {
    const wrapper = await mountComponent(TestComponent);

    expect(wrapper.find('h1').text()).toBe('デフォルトメッセージ');
    expect(wrapper.find('p').text()).toBe('Count: 0');

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('p').text()).toBe('Count: 1');
  });

  test('プロパティ(props)を渡してコンポーネントをマウントできること', async () => {
    const wrapper = await mountComponent(TestComponent, {
      props: { message: 'カスタムメッセージ' },
    });

    expect(wrapper.find('h1').text()).toBe('カスタムメッセージ');
  });

  test('コンポーネントのインスタンスにアクセスして値を確認できること', async () => {
    interface TestComponentInstance {
      doubledCount: number;
      increment: () => void;
      message: string;
    }

    const wrapper = await mountComponent<TestComponentInstance>(TestComponent);

    expect(wrapper.vm.doubledCount).toBe(0);

    wrapper.vm.increment();
    await nextTick();

    expect(wrapper.vm.doubledCount).toBe(2);
    expect(wrapper.vm.message).toBe('デフォルトメッセージ');
  });

  test('非同期コンポーネントを正しくマウントできること', async () => {
    const wrapper = await mountSuspendedComponent(AsyncTestComponent);

    expect(wrapper.find('p').text()).toBe('Async data: 非同期データ');
  });

  test('スロットを使ってコンポーネントの内容をカスタマイズできること', async () => {
    const wrapper = await mountSuspendedComponent(SlottedComponent, {
      slots: {
        header: () => 'カスタムヘッダー',
        default: () => 'カスタムコンテンツ',
        footer: () => 'カスタムフッター',
      },
    });

    expect(wrapper.find('header').text()).toBe('カスタムヘッダー');
    expect(wrapper.find('main').text()).toBe('カスタムコンテンツ');
    expect(wrapper.find('footer').text()).toBe('カスタムフッター');
  });

  test('Piniaストアを使用するコンポーネントをテストできること', async () => {
    const pinia = bindTestingPinia();
    const wrapper = await mountSuspendedComponent(StoreComponent, {
      testingPinia: pinia,
    });

    expect(wrapper.find('p').text()).toBe('Global count: 0');

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('p').text()).toBe('Global count: 1');

    const store = useCounterStore();
    expect(store.globalCount).toBe(1);
  });

  test('初期値を持つPiniaストアを使用するコンポーネントをテストできること', async () => {
    const pinia = bindTestingPinia({
      counter: {
        globalCount: 10,
      },
    });

    const wrapper = await mountSuspendedComponent(StoreComponent, {
      testingPinia: pinia,
    });

    expect(wrapper.find('p').text()).toBe('Global count: 10');
  });

  test('shallow オプションを使って子コンポーネントをスタブ化できること', async () => {
    const wrapper = await mountSuspendedComponent(ParentComponent, {
      shallow: true,
    });

    expect(wrapper.findComponent(ChildComponent).exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Child Component');
  });

  test('特定のコンポーネントだけをスタブ化できること', async () => {
    const wrapper = await mountSuspendedComponent(StubTestComponent, {
      stubs: {
        CustomButton: true,
      },
    });

    expect(wrapper.findComponent(CustomButton).exists()).toBe(true);
    expect(wrapper.text()).not.toContain('複雑なボタン');
  });

  test('モックを使ってコンポーネント内の外部機能をシミュレートできること', async () => {
    const mockPush = vi.fn();

    const wrapper = await mountSuspendedComponent(MockTestComponent, {
      mocks: {
        $router: {
          push: mockPush,
        },
      },
    });

    await wrapper.find('button').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/test');
  });
});
