import { mountSuspended } from '@nuxt/test-utils/runtime';
import { createTestingPinia } from '@pinia/testing';
import { RouterLinkStub } from '@vue/test-utils';
import type { TestingPinia } from '@pinia/testing';
import type { Component, Slots, VNode } from 'vue';

type InitialState = Record<string, unknown>;
type SuspendedTestWrapper<T extends Component> = Awaited<ReturnType<typeof mountSuspended<T>>>;
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

const DEFAULT_MOUNT_OPTIONS: MountOptions = {
  attachTo: undefined,
  data: {},
  props: {},
  slots: {},
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
