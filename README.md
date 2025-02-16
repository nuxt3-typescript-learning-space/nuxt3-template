# パッと始めるNuxt3用テンプレート

## 概要

このプロジェクトは以下の技術スタックを使用した開発のためのテンプレートプロジェクトです。

| カテゴリ                     | 技術                    | 備考                                                 |
| ---------------------------- | ----------------------- | ---------------------------------------------------- |
| フロントエンドフレームワーク | Nuxt3 (Composition API) | nuxt@3.15.4 vue@3.5.13, vue-router@4.5.0             |
| 状態管理ライブラリ           | Pinia                   | Pinia@3.0.1 @pinia/nuxt@0.10.1, @pinia/testing@1.0.0 |
| 言語                         | TypeScript/JavaScript   | typescript@5.7.3                                     |
| バックエンド(BFF)            | Hono                    | hono@4.7.1                                           |
| スタイリング                 | TailwindCSS             | shadcn-nuxt@0.11.3, class-variance-authority@0.7.1   |
| テスティングフレームワーク   | Vitest                  | happy-dom@16.8.1 jsdom@26.0.0                        |
| コード品質                   | ESLint/Prettier         | カスタムルール対応                                   |
| Git フロー                   | husky/lint-staged       | commitlint@19.7.1, commitizen@4.3.1                  |
| パッケージマネージャ         | pnpm                    | pnpm@9.15.5                                          |
| ランタイム                   | Node.js                 | node@22.14.0                                         |
| UI コンポーネント            | radix-vue               | radix-vue@1.9.14, shadcn-nuxt@0.11.3                 |
| アイコン                     | Lucide                  | lucide-vue-next@0.475.0                              |

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

まだ `pnpm` がインストールされていない場合は、[インストール](https://pnpm.io/ja/9.x/installation#volta%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B)を行ってから以下の手順を実行してください。

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

注意: 初期セットアップ後、サンプルファイルの削除をお忘れなく。

- src/components/features/sample
- src/components/template/sample
- src/pages/sample
- src/services/get/sampleServices.ts
- src/store/sampleStore.ts
- src/test/unit/components/features/sample
- src/test/unit/store/sampleStore.spec.ts
- src/test/unit/utils/sample.spec.ts
- src/utils/sample.ts

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
├── composables/            # Vue 3 Composition APIを使用した再利用可能なロジックを定義
│                           # useXxxの形式で命名することが推奨される
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

mainブランチへのプルリクエスト作成時に、以下の自動チェックが実行されます。

1. TypeScriptの型チェック
2. ESLint/Prettierによるコードフォーマットチェック
3. テスト実行
4. ビルド確認

チェック結果はプルリクエストのステータスで確認できます。

## git commit の方法

このプロジェクトでは、コミットメッセージの体裁を整えるため、commitlintを導入しています。

`git commit`コマンドを実行すると、コミットメッセージのprefixをCLI上で選択することができます。

コミットメッセージのprefixをカスタマイズする場合は、以下のファイルを編集してください。

- .cz-config.cts
- commitlint.config.cts

**注意**: CLIの対話形式でコミットメッセージの体裁が決まるため、sourceTreeなどのGUIツールを使用する場合は想定されていません。

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
