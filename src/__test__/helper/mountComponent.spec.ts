import { defineStore } from 'pinia';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { defineComponent, h, ref, computed, defineAsyncComponent, nextTick } from 'vue';
import { bindTestingPinia, mountComponent, mountSuspendedComponent } from '@/helper/test';

// 基本的なテスト用のコンポーネント
const TestComponent = defineComponent({
  props: {
    message: {
      type: String,
      default: 'デフォルトメッセージ', // プロパティが指定されない場合のデフォルト値
    },
  },
  setup(props) {
    // 状態管理: カウンターの初期値を0に設定
    const count = ref(0);
    // 計算されるプロパティ: countの値を2倍にする
    const doubledCount = computed(() => count.value * 2);

    // カウンターを1増やす関数
    const increment = () => {
      count.value++;
    };

    // コンポーネントで使用する値と関数を返す
    return {
      count,
      doubledCount,
      increment,
      message: props.message,
    };
  },
  render() {
    // コンポーネントのHTMLを生成する
    return h('div', [
      h('h1', this.message),
      h('p', `Count: ${this.count}`),
      h('p', `Doubled: ${this.doubledCount}`),
      h('button', { onClick: this.increment }, 'Increment'),
    ]);
  },
});

// 非同期で読み込まれるコンポーネント
const AsyncComponent = defineComponent({
  setup() {
    const asyncData = ref('非同期データ');
    return { asyncData };
  },
  render() {
    return h('div', [h('p', `Async data: ${this.asyncData}`)]);
  },
});

// 非同期コンポーネントをPromiseで包んで定義
const AsyncTestComponent = defineAsyncComponent(() => Promise.resolve(AsyncComponent));

// Piniaを使った状態管理ストアの定義
const useCounterStore = defineStore('counter', {
  state: () => ({
    globalCount: 0, // ストアで管理するグローバルなカウンター値
  }),
  actions: {
    increment() {
      this.globalCount++; // ストア内のカウンターを増やすアクション
    },
  },
});

describe('src/helper/test/mountComponent.ts', () => {
  beforeEach(() => {
    // 各テスト実行前に全てのモックをリセット
    vi.resetAllMocks();
  });

  test('基本的なコンポーネントをマウントできること', async () => {
    // テスト対象のコンポーネントをマウント
    const wrapper = await mountComponent(TestComponent);

    // h1タグのテキストがデフォルト値と一致するか確認
    expect(wrapper.find('h1').text()).toBe('デフォルトメッセージ');
    // 最初のpタグのテキストが「Count: 0」と一致するか確認
    expect(wrapper.find('p').text()).toBe('Count: 0');

    // ボタンをクリックする操作をシミュレート
    await wrapper.find('button').trigger('click');
    // クリック後にカウントが1になっているか確認
    expect(wrapper.find('p').text()).toBe('Count: 1');
  });

  test('プロパティ(props)を渡してコンポーネントをマウントできること', async () => {
    // カスタムメッセージをプロパティとして渡す
    const wrapper = await mountComponent(TestComponent, {
      props: { message: 'カスタムメッセージ' },
    });

    // h1タグのテキストが渡したカスタムメッセージと一致するか確認
    expect(wrapper.find('h1').text()).toBe('カスタムメッセージ');
  });

  test('コンポーネントのインスタンスにアクセスして値を確認できること', async () => {
    // コンポーネントのインターフェースを定義（型チェック用）
    interface TestComponentInstance {
      doubledCount: number;
      increment: () => void;
      message: string;
    }

    const wrapper = await mountComponent<TestComponentInstance>(TestComponent);

    // 初期状態ではdoubledCountは0のはず
    expect(wrapper.vm.doubledCount).toBe(0);

    // コンポーネントのincrement関数を直接呼び出す
    wrapper.vm.increment();
    // DOMの更新を待つ
    await nextTick();

    // カウンターが1増えたので、doubledCountは2になっているはず
    expect(wrapper.vm.doubledCount).toBe(2);
    // messageプロパティがデフォルト値のままであることを確認
    expect(wrapper.vm.message).toBe('デフォルトメッセージ');
  });

  test('非同期コンポーネントを正しくマウントできること', async () => {
    // 非同期コンポーネントをマウント
    const wrapper = await mountSuspendedComponent(AsyncTestComponent);

    // 非同期コンポーネントの内容が正しく表示されているか確認
    expect(wrapper.find('p').text()).toBe('Async data: 非同期データ');
  });

  test('スロットを使ってコンポーネントの内容をカスタマイズできること', async () => {
    // スロットを持つシンプルなコンポーネント
    const SlottedComponent = defineComponent({
      render() {
        return h('div', [
          // headerスロットがあれば使用、なければデフォルトテキストを表示
          h('header', {}, this.$slots.header ? this.$slots.header() : 'デフォルトヘッダー'),
          // defaultスロットがあれば使用、なければデフォルトテキストを表示
          h('main', {}, this.$slots.default ? this.$slots.default() : 'デフォルトコンテンツ'),
          // footerスロットがあれば使用、なければデフォルトテキストを表示
          h('footer', {}, this.$slots.footer ? this.$slots.footer() : 'デフォルトフッター'),
        ]);
      },
    });

    // 各スロットにカスタム内容を指定してマウント
    const wrapper = await mountSuspendedComponent(SlottedComponent, {
      slots: {
        header: () => 'カスタムヘッダー',
        default: () => 'カスタムコンテンツ',
        footer: () => 'カスタムフッター',
      },
    });

    // 各スロットの内容が正しく表示されているか確認
    expect(wrapper.find('header').text()).toBe('カスタムヘッダー');
    expect(wrapper.find('main').text()).toBe('カスタムコンテンツ');
    expect(wrapper.find('footer').text()).toBe('カスタムフッター');
  });

  test('Piniaストアを使用するコンポーネントをテストできること', async () => {
    // Piniaストアを使用するコンポーネント
    const StoreComponent = defineComponent({
      setup() {
        // ストアのインスタンスを取得
        const store = useCounterStore();

        return {
          store,
          // グローバルカウンターを増やす関数
          incrementGlobal: () => store.increment(),
        };
      },
      render() {
        return h('div', [
          // グローバルカウンターの値を表示
          h('p', `Global count: ${this.store.globalCount}`),
          // グローバルカウンターを増やすボタン
          h('button', { onClick: this.incrementGlobal }, 'Increment Global'),
        ]);
      },
    });

    // テスト用のPiniaストアを準備
    const pinia = bindTestingPinia();
    // ストアを使うコンポーネントをマウント
    const wrapper = await mountSuspendedComponent(StoreComponent, {
      testingPinia: pinia,
    });

    // 初期状態ではグローバルカウンターは0
    expect(wrapper.find('p').text()).toBe('Global count: 0');

    // ボタンをクリックしてグローバルカウンターを増やす
    await wrapper.find('button').trigger('click');
    // グローバルカウンターが1になっているか確認
    expect(wrapper.find('p').text()).toBe('Global count: 1');

    // ストアから直接値を取得して確認
    const store = useCounterStore();
    expect(store.globalCount).toBe(1);
  });

  test('初期値を持つPiniaストアを使用するコンポーネントをテストできること', async () => {
    // Piniaストアを使用するシンプルなコンポーネント
    const StoreComponent = defineComponent({
      setup() {
        const store = useCounterStore();
        return { store };
      },
      render() {
        return h('p', `Global count: ${this.store.globalCount}`);
      },
    });

    // 初期値を指定してテスト用のPiniaストアを準備
    const pinia = bindTestingPinia({
      counter: {
        globalCount: 10, // カウンターの初期値を10に設定
      },
    });

    // コンポーネントをマウント
    const wrapper = await mountSuspendedComponent(StoreComponent, {
      testingPinia: pinia,
    });

    // グローバルカウンターが初期値の10になっているか確認
    expect(wrapper.find('p').text()).toBe('Global count: 10');
  });

  test('shallow オプションを使って子コンポーネントをスタブ化できること', async () => {
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

    // shallowオプションを指定してマウント（子コンポーネントをスタブ化）
    const wrapper = await mountSuspendedComponent(ParentComponent, {
      shallow: true,
    });

    // 子コンポーネントはスタブ化されてはいるが存在する
    expect(wrapper.findComponent(ChildComponent).exists()).toBe(true);
    // 子コンポーネントの内容は表示されていない
    expect(wrapper.text()).not.toContain('Child Component');
  });

  test('特定のコンポーネントだけをスタブ化できること', async () => {
    // カスタムボタンコンポーネント
    const CustomButton = defineComponent({
      name: 'CustomButton',
      render() {
        return h('button', '複雑なボタン');
      },
    });

    // テスト対象のコンポーネント
    const StubTestComponent = defineComponent({
      components: {
        CustomButton,
      },
      render() {
        return h('div', [h('h1', 'Main Component'), h(CustomButton)]);
      },
    });

    // CustomButtonだけをスタブ化してマウント
    const wrapper = await mountSuspendedComponent(StubTestComponent, {
      stubs: {
        CustomButton: true, // CustomButtonをスタブ化する
      },
    });

    // CustomButtonコンポーネントはスタブ化されているが存在する
    expect(wrapper.findComponent(CustomButton).exists()).toBe(true);
    // CustomButtonの実際の内容は表示されていない
    expect(wrapper.text()).not.toContain('複雑なボタン');
  });

  test('モックを使ってコンポーネント内の外部機能をシミュレートできること', async () => {
    // $router.pushのモック関数を作成
    const mockPush = vi.fn();

    // $routerを使用するコンポーネント
    const MockTestComponent = defineComponent({
      methods: {
        navigate() {
          // Vue Routerのpushメソッドを呼び出す
          this.$router.push('/test');
        },
      },
      render() {
        return h('button', { onClick: this.navigate }, 'Navigate');
      },
    });

    // $routerをモック化してマウント
    const wrapper = await mountSuspendedComponent(MockTestComponent, {
      mocks: {
        $router: {
          push: mockPush, // push関数をモックに置き換え
        },
      },
    });

    // ボタンをクリックしてnavigateメソッドを実行
    await wrapper.find('button').trigger('click');
    // モックのpush関数が'/test'引数で呼ばれたか確認
    expect(mockPush).toHaveBeenCalledWith('/test');
  });
});
