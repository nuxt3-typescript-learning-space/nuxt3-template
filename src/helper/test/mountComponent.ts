import { mountSuspended } from '@nuxt/test-utils/runtime';
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils';
import type { MountOptions } from '@/types/helper/testType';
import type { Component, ComponentPublicInstance } from 'vue';

const DEFAULT_STUBS = {
  NuxtLink: RouterLinkStub,
} as const;

const DEFAULT_OPTIONS = {
  testingPinia: undefined,
  attachTo: undefined,
  props: {},
  slots: {},
  shallow: false,
  stubs: DEFAULT_STUBS,
  mocks: {},
  config: {},
  options: {},
} as const satisfies MountOptions;

/**
 * Vueコンポーネントをテスト用にマウントするヘルパー関数
 *
 * @template VMValue - コンポーネントインスタンスの型。コンポーネントのプロパティやメソッドへの型安全なアクセスをするために使用
 * @param component - テスト対象のVueコンポーネント
 * @param options {@link MountOptions} - マウントオプション（任意）
 * @returns テスト用のVueラッパーオブジェクト
 */
export async function mountComponent<VMValue>(
  component: Component,
  options: Partial<MountOptions> = DEFAULT_OPTIONS,
): Promise<VueWrapper<ComponentPublicInstance & VMValue>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const {
    testingPinia,
    attachTo,
    props,
    slots,
    shallow,
    stubs,
    mocks,
    config,
    options: additionalOptions,
  } = mergedOptions;

  return mount(component, {
    ...additionalOptions,
    attachTo,
    props,
    slots,
    shallow,
    global: {
      plugins: testingPinia ? [testingPinia] : [],
      stubs: { ...DEFAULT_STUBS, ...stubs },
      mocks,
      config,
    },
  });
}

/**
 * Vueコンポーネントをテスト用に非同期マウントするヘルパー関数
 *
 * @template VMValue - コンポーネントインスタンスの型。コンポーネントのプロパティやメソッドへの型安全なアクセスをするために使用
 * @param component - テスト対象のVueコンポーネント
 * @param options {@link MountOptions} - マウントオプション（任意）
 * @returns テスト用のVueラッパーオブジェクト
 */
export async function mountSuspendedComponent<VMValue>(
  component: Component,
  options: Partial<MountOptions> = DEFAULT_OPTIONS,
): Promise<VueWrapper<ComponentPublicInstance & VMValue>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const {
    testingPinia,
    attachTo,
    props,
    slots,
    shallow,
    stubs,
    mocks,
    config,
    options: additionalOptions,
  } = mergedOptions;

  return await mountSuspended(component, {
    ...additionalOptions,
    attachTo,
    props,
    slots,
    shallow,
    global: {
      plugins: testingPinia ? [testingPinia] : [],
      stubs: { ...DEFAULT_STUBS, ...stubs },
      mocks,
      config,
    },
  });
}
