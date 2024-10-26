import { mountSuspended } from '@nuxt/test-utils/runtime';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { mount, RouterLinkStub } from '@vue/test-utils';
import type { Component } from 'vue';

type InitialState = Record<string, unknown>;

/**
 * テスト用のPiniaストアを設定します。
 *
 * @param {InitialState} [initialState={}] - ストアの初期状態を指定するオブジェクト。
 * @returns {TestingPinia} - テスト用のPiniaインスタンスを返します。
 */
export function bindTestingPinia(initialState: InitialState = {}): TestingPinia {
  return createTestingPinia({
    stubActions: false,
    initialState: { ...initialState },
  });
}

export function mountComponent<Props extends Record<string, unknown>>(
  component: Component,
  testingPinia: TestingPinia,
  { attachTo = undefined, data = {}, props = {} as Props, shallow = false, stubs = {}, mocks = {}, options = {} } = {},
) {
  return mount(component, {
    ...options,
    data: () => data,
    attachTo,
    props,
    shallow,
    global: {
      plugins: [testingPinia],
      stubs: {
        NuxtLink: RouterLinkStub,
        ...stubs,
      },
      mocks: { ...mocks },
    },
  });
}

export async function mountSuspendedComponent<Props extends Record<string, unknown>>(
  component: Component,
  testingPinia: TestingPinia,
  { attachTo = undefined, data = {}, props = {} as Props, shallow = false, stubs = {}, mocks = {}, options = {} } = {},
) {
  return await mountSuspended(component, {
    ...options,
    data: () => data,
    attachTo,
    props,
    shallow,
    global: {
      plugins: [testingPinia],
      stubs: {
        NuxtLink: RouterLinkStub,
        ...stubs,
      },
      mocks: { ...mocks },
    },
  });
}
