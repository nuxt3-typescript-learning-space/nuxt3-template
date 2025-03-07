import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { bindTestingPinia, mountSuspendedComponent } from '@/__test__/testHelper';
import NuxtAppVue from '@/app.vue';

describe('src/app.vue', () => {
  let testingPinia: ReturnType<typeof bindTestingPinia>;

  beforeEach(() => {
    testingPinia = bindTestingPinia();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  test('基本的なレイアウト構造が正しくレンダリングされるか', async () => {
    const wrapper = await mountSuspendedComponent(NuxtAppVue, testingPinia, { shallow: true });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#nuxt-app-vue').exists()).toBe(true);
    expect(wrapper.find('nuxt-route-announcer-stub').exists()).toBe(true);
    expect(wrapper.find('nuxt-layout-stub').exists()).toBe(true);
  });
});
