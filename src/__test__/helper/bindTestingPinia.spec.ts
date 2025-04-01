import { describe, expect, test } from 'vitest';
import { bindTestingPinia } from '@/helper/test';

// テスト用のPiniaストアを定義
const useTestStore = defineStore('test', {
  // ストアの初期状態を定義
  state: () => ({
    count: 0, // カウンターの初期値は0
    name: 'test', // 名前の初期値は'test'
  }),
  // ストアで利用できるアクション（状態を変更する関数）を定義
  actions: {
    // カウンターを1増やすアクション
    increment() {
      this.count++;
    },
    // 名前を更新するアクション
    updateName(name: string) {
      this.name = name;
    },
  },
});

// bindTestingPinia関数のテストグループ
describe('src/helpers/test/bindTestingPinia.ts', () => {
  // 初期状態を指定せずにPiniaストアをテストするケース
  test('空のinitialStateでPiniaインスタンスを作成する', () => {
    // 引数なしでbindTestingPiniaを呼び出し（デフォルト設定のストアを作成）
    const testingPinia = bindTestingPinia();

    // 作成されたPiniaインスタンスが存在することを確認
    expect(testingPinia).toBeDefined();

    // テスト用ストアを取得
    const testStore = useTestStore();
    // ストアの初期値がデフォルト値（state関数で定義した値）になっているか確認
    expect(testStore.count).toBe(0);
    expect(testStore.name).toBe('test');

    // アクションを実行してストアの状態を変更
    testStore.increment(); // カウンターを1増やす
    testStore.updateName('newName'); // 名前を'newName'に変更

    // アクション実行後、ストアの状態が期待通りに変更されているか確認
    expect(testStore.count).toBe(1);
    expect(testStore.name).toBe('newName');
  });

  // カスタムの初期状態を指定してPiniaストアをテストするケース
  test('初期状態を持つPiniaインスタンスを作成する', () => {
    // カスタム初期状態を定義
    // キーはストア名、値はストアの初期状態
    const initialState = {
      // 'test'という名前のストアの初期状態
      test: {
        count: 5, // カウンターの初期値を5に設定
        name: 'initialName', // 名前の初期値を'initialName'に設定
      },
    };

    // カスタム初期状態を指定してbindTestingPiniaを呼び出す
    const testingPinia = bindTestingPinia(initialState);

    // 作成されたPiniaインスタンスが存在することを確認
    expect(testingPinia).toBeDefined();

    // テスト用ストアを取得
    const testStore = useTestStore();
    // ストアの初期値が、指定したカスタム初期値になっているか確認
    expect(testStore.count).toBe(5);
    expect(testStore.name).toBe('initialName');

    // アクションを実行してストアの状態を変更
    testStore.increment(); // カウンターを1増やす（5→6）
    testStore.updateName('updatedName'); // 名前を'updatedName'に変更

    // アクション実行後、ストアの状態が期待通りに変更されているか確認
    expect(testStore.count).toBe(6);
    expect(testStore.name).toBe('updatedName');
  });
});
