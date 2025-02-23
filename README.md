# パッと始めるNuxt3用テンプレート

## 概要

このプロジェクトは以下の技術スタックを使用した開発のためのテンプレートプロジェクトです。

| カテゴリ                        | 技術                                  |
| ------------------------------- | ------------------------------------- |
| フロントエンドフレームワーク    | Nuxt3/Vue3                            |
| 状態管理ライブラリ              | Pinia                                 |
| 言語                            | TypeScript/JavaScript                 |
| バックエンドフレームワーク(BFF) | Hono                                  |
| スタイリング                    | TailwindCSS                           |
| テスティングフレームワーク      | Vitest (happy-dom, jsdom環境サポート) |
| コード品質                      | ESLint/Prettier                       |
| Git hooks                       | husky/lint-staged                     |
| コミット管理                    | Commitizen/commitlint (gitmoji対応)   |
| パッケージマネージャ            | pnpm                                  |
| ランタイム                      | Node.js                               |
| UI コンポーネントライブラリ     | shadcn-vue/shadcn-nuxt                |
| アイコン                        | Lucide                                |
| CI/CD                           | GitHub Actions                        |
| アナリティクス                  | Google Tag Manager (Vue GTM)          |
| テーマ                          | カラーモード対応 (@nuxtjs/color-mode) |

## 開発環境のセットアップ

### 必要要件

このテンプレートは以下のバージョンで動作確認されています。

```json
{
  "engines": {
    "node": "22.14.0",
    "pnpm": "9.15.5"
  }
}
```

### インストール

このプロジェクトでは、パッケージマネージャとして `pnpm` を使用しています。

また、Node.jsのバージョン管理ツールとして[Volta](https://docs.volta.sh/guide/getting-started)を採用しています。

インストールされていない場合は、[インストール](https://docs.volta.sh/guide/getting-started)を行うと便利です。

まだ `pnpm` がインストールされていない場合は、[インストール](https://pnpm.io/ja/9.x/installation#volta%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B)を行ってから以下の手順を実行してください。

```bash
pnpm install
```

### 環境変数の設定

1. プロジェクトのルートディレクトリに`.env`ファイルを作成してください。

2. 環境に応じて以下の値を設定してください（`.env.example`を参考に）：

開発環境の場合（`.env`）:

```bash
NUXT_ENV=development
API_URL=http://localhost:3000/ # Hono Clientが使用するベースURL
```

本番環境の場合（`.env.prod`）:

```bash
NUXT_ENV=production
API_URL=https://your-production-domain.com/ # デプロイ先のドメインを設定
```

ローカル開発から始めると思うので、ひとまず `.env` ファイルの作成のみで良いです。

> [!NOTE]
>
> - API_URLには、開発環境ではローカルホストを、本番環境では実際のデプロイ先のドメインを設定してください。
> - この設定は、クライアントサイドでのHono ClientによるAPI呼び出しに使用されます。
> - APIのベースパスは /api に設定されており、例えば /api/title のようなエンドポイントにアクセスできます。

### 開発サーバーの起動

```bash
pnpm dev
```

> [!CAUTION]
> このリポジトリにはサンプルファイルが追加されています。
> 開発を開始する前に、不要なファイルを削除してください。
>
> - src/components/features/sample
> - src/components/template/sample
> - src/pages/sample
> - src/services/get/sampleServices.ts
> - src/store/sampleStore.ts
> - src/test/unit/components/features/sample
> - src/test/unit/store/sampleStore.spec.ts
> - src/test/unit/utils/sample.spec.ts
> - src/utils/sample.ts
>
> など

## プロジェクト構成

### ディレクトリ構成

srcディレクトリ配下の構成は以下の通りです:

```bash
src/
├── app.vue                  # アプリケーションのルートコンポーネント
│                           # すべてのページで共有されるレイアウトを定義可能
│
├── assets/                 # 画像やCSSなどの静的ファイルを定義するディレクトリ
│                           # ビルド時に処理・最適化される
│
├── components/             # 再利用可能なVueコンポーネントを定義するディレクトリ
│
├── composables/            # Composition APIを使用した再利用可能なロジックを定義
│                           # useXxxの形式で命名することが慣習的
│
├── constants/              # アプリケーション全体で使用される定数を定義
│                           # 環境変数以外の静的な値を管理
│
├── layouts/                # ページレイアウトを定義するディレクトリ
│                           # default.vueが基本レイアウトとして使用される
│
├── lib/                    # サードパーティライブラリに依存するロジックを定義
│                           # ライブラリのラッパーやカスタム設定を配置
│
├── middleware/             # ページ遷移時に実行されるミドルウェアを定義
│                           # グローバルミドルウェア（全ルート対象）
│                           # ページミドルウェア（特定ページ対象）の2種類が利用可能
│
├── pages/                  # ページコンポーネントを定義するディレクトリ
│                           # ファイルベースのルーティングにより自動的にルートが生成される
│                           # 動的ルーティングは[id].vueのような命名で実現
│
├── plugins/                # Vueインスタンス生成時に実行されるプラグインを定義
│                           # グローバルコンポーネント、関数、変数の登録に使用
│
├── public/                 # 静的ファイルを配置するディレクトリ
│                           # favicon.ico, robots.txt等
│                           # ビルド時に処理されず、そのまま/ルートで配信される
│
├── server/                 # サーバーサイドのロジックを定義
│                           # APIエンドポイント、サーバーミドルウェア等
│                           # api/ディレクトリ内のファイルは自動的にAPIエンドポイントとして扱われる
│
├── services/               # APIコールを行うロジックを定義するディレクトリ
│
├── store/                  # Piniaを使用した状態管理を定義
│
├── test/                   # テストファイルを配置
│                           # ユニットテスト、E2Eテスト等
│
├── types/                  # TypeScriptの型定義ファイルを配置
│
└── utils/                  # 純粋なJavaScript/TypeScriptユーティリティを定義
```

## CI/CD

### GitHub Actions

mainもしくはmasterブランチへのプルリクエスト作成時に、以下の自動チェックが実行されます。

1. TypeScriptの型チェック
2. ESLint/Prettierによるコードフォーマットチェック
3. テスト実行
4. ビルド確認

チェック結果はプルリクエストのステータスで確認できます。

## git commit の方法

このプロジェクトでは、コミットメッセージの体裁を整えるため、commitlintを導入しています。

`git commit`コマンドを実行すると、コミットメッセージのprefixをCLI上で選択することができます。

> [!NOTE]
> コミットメッセージのprefixをカスタマイズする場合は、以下のファイルを編集してください。
>
> - .cz-config.cts
> - commitlint.config.cts

---

> [!WARNING]
>
> **注意**: CLIの対話形式でコミットメッセージの体裁が決まるため、sourceTreeなどのGUIツールを使用する場合は想定されていません。

## ESLintカスタムルール

### 実装済みルール

#### store-state-suffix

Piniaで定義されたstateをstoreToRefsを使用して参照するとき、接尾辞に `State` という文字列の使用を強制するルールです。

```ts
// ❌ 非推奨
const { foo } = storeToRefs(fooStore);

// ✅ 推奨
const { foo: fooState } = storeToRefs(fooStore);
```

※ gettersもstoreToRefsで取得するため、区別を明確にする目的があります。

### 新規ルールの追加方法

1. `settings/rules/src` にルール定義ファイルを作成（例: `store-state-suffix.ts`）
2. `pnpm build:custom-rule`を実行して、`settings/rules/dist`に出力
3. `settings/rules/index.js` でルールを読み込み
4. `eslint.config.mjs`で有効化

ご自身のプロジェクトに合わせて、必要に応じてルールをoffにしてください。

## テスト実装の雛形

### コンポーネントテスト実装例

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TestTargetComponent from '@/components/your/test/target/component/path.vue';
import { useTestStore } from '@/store/your/test/store/path';
import { bindTestingPinia, mountSuspendedComponent } from '@/test/testHelper';
import type { TestingPinia } from '@pinia/testing';

describe('TestTargetComponentPath', () => {
  let pinia: TestingPinia;
  let testStore: ReturnType<typeof useTestStore>;

  beforeEach(() => {
    pinia = bindTestingPinia();
    testStore = useTestStore();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  describe('マウント時の初期表示', () => {
    it('コンポーネントが正しくマウントされるか', async () => {
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia);
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Props', () => {
    it('propsの値が正しく表示されるか', async () => {
      const testProps = {
        propsName: 'propsValue',
      };
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia, { props: testProps });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('div').text()).toBe('propsValue');
    });
  });

  describe('子コンポーネントの表示', () => {
    it('子コンポーネントが正しくレンダリングされるか', async () => {
      const ChildComponent = {
        template: '<div></div>',
      };
      const stubs = { ChildComponent };
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia, { stubs });
      expect(wrapper.findComponent(ChildComponent).exists()).toBe(true);
    });

    it('子コンポーネントに正しいpropsが渡されるか', async () => {
      const ChildComponent = {
        props: ['test'],
        template: '<div></div>',
      };
      const stubs = { ChildComponent };
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia, { stubs });
      expect(wrapper.findComponent(ChildComponent).props('test')).toBe('期待値');
    });

    it('複数ある同じ名前の子コンポーネントがレンダリングされているか', async () => {
      const ButtonComponent = {
        template: '<button></button>',
      };
      const stubs = { ButtonComponent };
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia, { stubs });

      const buttons = wrapper.findAllComponents(ButtonComponent);
      const firstButton = buttons[0];
      const secondButton = buttons[1];

      expect(firstButton.exists()).toBe(true);
      expect(secondButton.exists()).toBe(true);
    });

    it('slotsのコンテンツが正しくレンダリングされるか', async () => {
      const slots = {
        default: () => h('div', { id: 'slot-test' }, [h('p', 'slot content')]),
      };
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia, { slots });
      expect(wrapper.find('#slot-test').exists()).toBe(true);
      expect(wrapper.find('p').text()).toBe('slot content');
    });
  });

  describe('イベント発火', () => {
    it('ボタンクリック時にclickイベントが発火するか', async () => {
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia);
      const target = wrapper.find('button');
      await target.trigger('click');
      expect(wrapper.emitted('click')).toHaveBeenCalledOnce();
    });

    it('ボタンクリック時にclickイベントが1回emitされる', async () => {
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia);
      const target = wrapper.find('button');
      await target.trigger('click');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });
  });

  describe('Store', () => {
    it('storeの値が正しく表示されるか', async () => {
      testStore.testValue = 'test';
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia);
      expect(wrapper.find('div').text()).toBe('test');
    });

    it('storeの値が変更されたときに表示が更新されるか', async () => {
      testStore.testValue = 'test';
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia);
      expect(wrapper.find('div').text()).toBe('test');
      testStore.testValue = 'updated';
      expect(wrapper.find('div').text()).toBe('updated');
    });

    it('storeの関数が正しく呼び出されるか', async () => {
      const wrapper = await mountSuspendedComponent(TestTargetComponent, pinia);
      const target = wrapper.find('button');
      await target.trigger('click');
      expect(testStore.testFunction).toHaveBeenCalled();
    });
  });
});
```

### `vi.spyOn()` と `vi.fn()` の使い分け

`vi.spyOn()` を使用するケース：

- 既存の実装を保持したまま関数の呼び出しを監視したい場合
- `mockImplementation()`で一時的に実装を上書きする場合も可能

`vi.fn()` を使用するケース：

- 完全に新しいモック実装に置き換えたい場合
- テストケースごとに異なる振る舞いを定義したい場合
