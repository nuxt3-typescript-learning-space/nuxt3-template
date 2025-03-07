import { mountSuspended } from '@nuxt/test-utils/runtime';
import { createTestingPinia } from '@pinia/testing';
import { RouterLinkStub } from '@vue/test-utils';
import type { TestingPinia } from '@pinia/testing';
import type { VueWrapper } from '@vue/test-utils';
import type { StateTree } from 'pinia';
import type { Component, ComponentPublicInstance, Slots, VNode } from 'vue';

type MountOptions = {
  attachTo?: Element | string;
  data?: Record<string, unknown>;
  props?: Record<string, unknown>;
  slots?: Record<string, () => VNode | VNode[] | string> | Slots;
  shallow?: boolean;
  stubs?: Record<string, Component | boolean>;
  mocks?: Record<string, unknown>;
  options?: Record<string, unknown>;
};

const DEFAULT_STUBS = {
  NuxtLink: RouterLinkStub,
} as const;

const DEFAULT_OPTIONS = {
  attachTo: undefined,
  data: {},
  props: {},
  slots: {},
  shallow: false,
  stubs: DEFAULT_STUBS,
  mocks: {},
  options: {},
} as const satisfies MountOptions;

/**
 * テスト用のPiniaストアを設定します。
 *
 * @param - ストアの初期状態を指定するオブジェクト。
 * @returns - テスト用のPiniaインスタンスを返します。
 */
export function bindTestingPinia(initialState: StateTree = {}): TestingPinia {
  return createTestingPinia({
    stubActions: false,
    initialState: { ...initialState },
  });
}

/**
 * Vueコンポーネントをテスト用に非同期マウントします
 *
 * @param component - テスト対象のVueコンポーネント
 * @param testingPinia - テスト用のPiniaインスタンス
 * @param options - マウントオプション
 * @returns マウントされたコンポーネントのラッパー
 *
 * @example
 * const wrapper = await mountSuspendedComponent<{ computedProperty: string }>(MyComponent, pinia, {
 *   props: { message: 'Hello' }
 * });
 * expect(wrapper.vm.computedProperty).toBe('computedValue');
 */
export async function mountSuspendedComponent<VMValue>(
  component: Component,
  testingPinia: ReturnType<typeof bindTestingPinia>,
  options: Partial<MountOptions> = DEFAULT_OPTIONS,
): Promise<VueWrapper<ComponentPublicInstance & VMValue>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { data, attachTo, props, slots, shallow, stubs, mocks, options: additionalOptions } = mergedOptions;

  return await mountSuspended(component, {
    ...additionalOptions,
    data: () => data,
    attachTo,
    props,
    slots,
    shallow,
    global: {
      plugins: [testingPinia],
      stubs: {
        ...DEFAULT_STUBS,
        ...stubs,
      },
      mocks: { ...mocks },
    },
  });
}
