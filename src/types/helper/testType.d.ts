import type { bindTestingPinia } from '@/helper/test';
import type { Component, SlotsType, VNode } from 'vue';

export interface MountOptions {
  /** テスト用のPiniaインスタンス（bindTestingPinia関数で作成したもの） */
  testingPinia?: ReturnType<typeof bindTestingPinia>;
  /** コンポーネントをマウントするDOM要素 */
  attachTo?: Element | string;
  /** コンポーネントに渡すprops */
  props?: Record<string, unknown>;
  /** コンポーネントのスロット */
  slots?: Record<string, () => VNode | VNode[] | string> | SlotsType;
  /** shallowレンダリングを行うかどうか */
  shallow?: boolean;
  /** 子コンポーネントをスタブ化するためのオブジェクト */
  stubs?: Record<string, Component | boolean>;
  /** モックオブジェクト */
  mocks?: Record<string, unknown>;
  /** グローバルコンフィグ */
  config?: Record<string, unknown>;
  /** その他追加マウントオプション */
  options?: Record<string, unknown>;
}
