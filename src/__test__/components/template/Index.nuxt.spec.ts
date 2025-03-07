import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { bindTestingPinia, mountSuspendedComponent } from '@/__test__/testHelper';
import Index from '@/components/template/sample/Index.vue';
import { useSampleStore } from '@/store/sampleStore';

describe('src/features/sample/components/Index.vue', () => {
  let testingPinia: ReturnType<typeof bindTestingPinia>;
  let sampleStore: ReturnType<typeof useSampleStore>;

  beforeEach(() => {
    testingPinia = bindTestingPinia();
    sampleStore = useSampleStore();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  test('Titleコンポーネントがレンダリングされているか', async () => {
    const Title = {
      template: '<h1></h1>',
    };
    const stubs = { Title };
    const wrapper = await mountSuspendedComponent(Index, testingPinia, { stubs, shallow: true });
    expect(wrapper.findComponent(Title).exists()).toBe(true);
  });

  test('Buttonコンポーネントのイベントが発火するか', async () => {
    const Button = {
      template: '<button></button>',
    };
    const stubs = { Button };
    const wrapper = await mountSuspendedComponent(Index, testingPinia, { stubs, shallow: true });
    const incrementButton = wrapper.findAllComponents(Button)[0];
    const decrementButton = wrapper.findAllComponents(Button)[1];

    await incrementButton.trigger('click');
    await decrementButton.trigger('click');
    expect(sampleStore.increment).toHaveBeenCalledOnce();
    expect(sampleStore.decrement).toHaveBeenCalledOnce();
  });

  test('increment関数が発火したときに、countStateが増加するか', async () => {
    const Button = {
      template: '<button></button>',
    };
    const stubs = { Button };
    const wrapper = await mountSuspendedComponent(Index, testingPinia, { stubs, shallow: true });
    const incrementButton = wrapper.findAllComponents(Button)[0];
    await incrementButton.trigger('click');
    expect(sampleStore.count).toBe(1);
  });

  test('decrement関数が発火したときに、countStateが減少するか', async () => {
    const Button = {
      template: '<button></button>',
    };
    const stubs = { Button };
    const wrapper = await mountSuspendedComponent(Index, testingPinia, { stubs, shallow: true });
    const decrementButton = wrapper.findAllComponents(Button)[1];
    await decrementButton.trigger('click');
    expect(sampleStore.count).toBe(-1);
  });

  test('CounterDisplayコンポーネントにPropsが渡されるか', async () => {
    const CounterDisplay = {
      props: ['count'],
      template: '<button></button>',
    };
    const stubs = { CounterDisplay };
    const wrapper = await mountSuspendedComponent(Index, testingPinia, { stubs, shallow: true });
    expect(wrapper.findComponent(CounterDisplay).props('count')).toBe(sampleStore.count);
  });
});
