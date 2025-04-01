import { afterEach, describe, expect, test, vi } from 'vitest';
import NuxtAppVue from '@/app.vue';
import { mountSuspendedComponent } from '@/helper/test';

describe('src/app.vue', () => {
  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  test('基本的なレイアウト構造が正しくレンダリングされるか', async () => {
    const wrapper = await mountSuspendedComponent(NuxtAppVue, { shallow: true });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#nuxt-app-vue').exists()).toBe(true);
    expect(wrapper.find('nuxt-route-announcer-stub').exists()).toBe(true);
    expect(wrapper.find('nuxt-layout-stub').exists()).toBe(true);
  });
});
