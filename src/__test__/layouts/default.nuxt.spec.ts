import { afterEach, describe, expect, test, vi } from 'vitest';
import { mountSuspendedComponent } from '@/helper/test';
import DefaultLayout from '@/layouts/default.vue';

describe('src/layouts/default.vue', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  test('コンポーネントが正しくレンダリングされるか', async () => {
    const wrapper = await mountSuspendedComponent(DefaultLayout);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#nuxt-default-layout').exists()).toBe(true);
  });

  test('slotsのコンテンツが正しくレンダリングされるか', async () => {
    const slots = {
      default: () => h('div', { id: 'slot-test' }, [h('p', 'slot content')]),
    };
    const wrapper = await mountSuspendedComponent(DefaultLayout, { slots });
    expect(wrapper.find('#slot-test').exists()).toBe(true);
    expect(wrapper.find('p').text()).toBe('slot content');
  });
});
