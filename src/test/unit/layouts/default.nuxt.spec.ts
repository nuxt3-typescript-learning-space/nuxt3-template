import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DefaultLayout from '@/layouts/default.vue';
import { bindTestingPinia, mountSuspendedComponent } from '@/test/testHelper';
import type { TestingPinia } from '@pinia/testing';

describe('src/layouts/default.vue', () => {
  let pinia: TestingPinia;

  beforeEach(() => {
    pinia = bindTestingPinia();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('コンポーネントが正しくレンダリングされるか', async () => {
    const wrapper = await mountSuspendedComponent(DefaultLayout, pinia);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#nuxt-default-layout').exists()).toBe(true);
  });

  it('slotsのコンテンツが正しくレンダリングされるか', async () => {
    const slots = {
      default: () => h('div', { id: 'slot-test' }, [h('p', 'slot content')]),
    };
    const wrapper = await mountSuspendedComponent(DefaultLayout, pinia, { slots });
    expect(wrapper.find('#slot-test').exists()).toBe(true);
    expect(wrapper.find('p').text()).toBe('slot content');
  });
});
