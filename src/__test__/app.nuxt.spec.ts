import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bindTestingPinia, mountSuspendedComponent } from '@/__test__/testHelper';
import NuxtAppVue from '@/app.vue';
import type { TestingPinia } from '@pinia/testing';

describe('src/app.vue', () => {
  let pinia: TestingPinia;

  beforeEach(() => {
    pinia = bindTestingPinia();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('基本的なレイアウト構造が正しくレンダリングされるか', async () => {
    const wrapper = await mountSuspendedComponent(NuxtAppVue, pinia, { shallow: true });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('#nuxt-app-vue').exists()).toBe(true);
    expect(wrapper.find('nuxt-route-announcer-stub').exists()).toBe(true);
    expect(wrapper.find('nuxt-layout-stub').exists()).toBe(true);
  });
});
