import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bindTestingPinia, mountSuspendedComponent } from '@/__test__/testHelper';
import DefaultLayout from '@/layouts/default.vue';

describe('src/layouts/default.vue', () => {
  let testingPinia: ReturnType<typeof bindTestingPinia>;

  beforeEach(() => {
    testingPinia = bindTestingPinia();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('コンポーネントが正しくレンダリングされるか', async () => {
    const wrapper = await mountSuspendedComponent(DefaultLayout, testingPinia);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#nuxt-default-layout').exists()).toBe(true);
  });

  it('slotsのコンテンツが正しくレンダリングされるか', async () => {
    const slots = {
      default: () => h('div', { id: 'slot-test' }, [h('p', 'slot content')]),
    };
    const wrapper = await mountSuspendedComponent(DefaultLayout, testingPinia, { slots });
    expect(wrapper.find('#slot-test').exists()).toBe(true);
    expect(wrapper.find('p').text()).toBe('slot content');
  });
});
