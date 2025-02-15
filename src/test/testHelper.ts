import { mountSuspended } from '@nuxt/test-utils/runtime';
import { createTestingPinia } from '@pinia/testing';
import { mount, RouterLinkStub } from '@vue/test-utils';
import type { TestingPinia } from '@pinia/testing';
import type { Component } from 'vue';

type InitialState = Record<string, unknown>;
type TestWrapper<T extends Component> = ReturnType<typeof mount<T>>;
type SuspendedTestWrapper<T extends Component> = Awaited<ReturnType<typeof mountSuspended<T>>>;
type MountOptions = {
  attachTo?: Element | string;
  data?: Record<string, unknown>;
  props?: Record<string, unknown>;
  shallow?: boolean;
  stubs?: Record<string, Component | boolean>;
  mocks?: Record<string, unknown>;
  options?: Record<string, unknown>;
};

const DEFAULT_STUBS = {
  NuxtLink: RouterLinkStub,
} as const;

const DEFAULT_MOUNT_OPTIONS: MountOptions = {
  attachTo: undefined,
  data: {},
  props: {},
  shallow: false,
  stubs: DEFAULT_STUBS,
  mocks: {},
  options: {},
} as const;

/**
 * テスト用のPiniaストアを設定します。
 *
 * @param - ストアの初期状態を指定するオブジェクト。
 * @returns - テスト用のPiniaインスタンスを返します。
 */
export function bindTestingPinia(initialState: InitialState = {}): TestingPinia {
  return createTestingPinia({
    stubActions: false,
    initialState: { ...initialState },
  });
}

/**
 * Vueコンポーネントをテスト用にマウントします
 *
 * @param component - テスト対象のVueコンポーネント
 * @param testingPinia - テスト用のPiniaインスタンス
 * @param options - マウントオプション
 * @returns マウントされたコンポーネントのラッパー
 *
 * @example
 * const wrapper = mountComponent(MyComponent, pinia, {
 *   props: { message: 'Hello' }
 * });
 */
export function mountComponent(
  component: Component,
  testingPinia: TestingPinia,
  options: Partial<MountOptions> = DEFAULT_MOUNT_OPTIONS,
): TestWrapper<typeof component> {
  const mergedOptions = { ...DEFAULT_MOUNT_OPTIONS, ...options };
  const { data, attachTo, props, shallow, stubs, mocks, options: additionalOptions } = mergedOptions;

  return mount(component, {
    ...additionalOptions,
    data: () => data,
    attachTo,
    props,
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

/**
 * Vueコンポーネントをテスト用に非同期マウントします
 *
 * @param component - テスト対象のVueコンポーネント
 * @param testingPinia - テスト用のPiniaインスタンス
 * @param options - マウントオプション
 * @returns マウントされたコンポーネントのラッパー
 *
 * @example
 * const wrapper = await mountSuspendedComponent(MyComponent, pinia, {
 *   props: { message: 'Hello' }
 * });
 */
export async function mountSuspendedComponent(
  component: Component,
  testingPinia: TestingPinia,
  options: Partial<MountOptions> = DEFAULT_MOUNT_OPTIONS,
): Promise<SuspendedTestWrapper<typeof component>> {
  const mergedOptions = { ...DEFAULT_MOUNT_OPTIONS, ...options };
  const { data, attachTo, props, shallow, stubs, mocks, options: additionalOptions } = mergedOptions;

  return await mountSuspended(component, {
    ...additionalOptions,
    data: () => data,
    attachTo,
    props,
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
