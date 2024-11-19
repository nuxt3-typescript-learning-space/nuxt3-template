import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Index from '@/components/features/sample/Index.vue';
import { useSampleStore } from '@/store/sampleStore';
import { bindTestingPinia, mountSuspendedComponent } from '@/test/testHelper';
import type { TestingPinia } from '@pinia/testing';

describe('src/features/sample/components/Index.vue', () => {
  let pinia: TestingPinia;
  let sampleStore: ReturnType<typeof useSampleStore>;

  beforeEach(() => {
    pinia = bindTestingPinia();
    sampleStore = useSampleStore();
    vi.spyOn(sampleStore, 'increment');
    vi.spyOn(sampleStore, 'decrement');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('Titleコンポーネントがレンダリングされているか', async () => {
    const Title = {
      template: '<h1></h1>',
    };
    const stubs = { Title };
    const wrapper = await mountSuspendedComponent(Index, pinia, { stubs });
    expect(wrapper.findComponent(Title).exists()).toBe(true);
  });

  test('Buttonコンポーネントのイベントが発火するか', async () => {
    const Button = {
      template: '<button></button>',
    };
    const stubs = { Button };
    const wrapper = await mountSuspendedComponent(Index, pinia, { stubs });
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
    const wrapper = await mountSuspendedComponent(Index, pinia, { stubs });
    const incrementButton = wrapper.findAllComponents(Button)[0];
    await incrementButton.trigger('click');
    expect(sampleStore.count).toBe(1);
  });

  test('decrement関数が発火したときに、countStateが減少するか', async () => {
    const Button = {
      template: '<button></button>',
    };
    const stubs = { Button };
    const wrapper = await mountSuspendedComponent(Index, pinia, { stubs });
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
    const wrapper = await mountSuspendedComponent(Index, pinia, { stubs });
    expect(wrapper.findComponent(CounterDisplay).props('count')).toBe(sampleStore.count);
  });
});
