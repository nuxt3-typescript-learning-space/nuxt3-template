## このリポジトリについて

**パッと始めるNuxt3用テンプレート**

## 開発環境の立ち上げ方

```bash
pnpm install
```

```bash
pnpm dev
```

もし`pnpm`以外を使用する場合は、`pnpm-lock.yaml`を削除してください。

## ディレクトリ構造の例

```bash
src/
├── assets/                 # 静的リソース
│   ├── css/               # グローバルCSS、Tailwind設定
│   └── image/             # 画像ファイル
│
├── components/            # コンポーネント
│   ├── features/          # 機能単位のコンポーネント
│   │   └── sample/        # 機能固有のコンポーネント
│   ├── layout/           # レイアウトコンポーネント（ヘッダー、フッターなど）
│   └── ui/               # 共通UIコンポーネント
│       └── button/       # 汎用的なUIパーツ
│
├── composables/          # 再利用可能なロジック
│   ├── useAuth.ts        # 認証関連のロジック
│   └── useForm.ts        # フォーム関連のロジック
│
├── constants/            # 定数定義
│   ├── config.ts         # アプリケーション設定
│   ├── routes.ts         # ルート定義
│   └── messages.ts       # メッセージ定義
│
├── lib/                  # 外部ライブラリの設定
│   └── tailwind.ts       # Tailwindの設定
│
├── middleware/           # ルートミドルウェア
│   ├── auth.ts           # 認証ミドルウェア
│   └── logger.ts         # ロギングミドルウェア
│
├── pages/                # ページコンポーネント
│   └── sample/           # 機能単位のページ
│
├── public/               # 静的ファイル
│   └── favicon.ico       # ファビコン
│
├── server/               # サーバーサイド処理
│   └── api/              # APIエンドポイント
│
├── services/             # 外部サービスとの通信
│   ├── api.ts            # APIクライアント
│
├── store/                # 状態管理
│   └── sample/           # 機能単位のストア
│
├── test/                 # テストファイル
│   ├── e2e/              # E2Eテスト
│   ├── integration/      # 統合テスト
│   └── unit/             # ユニットテスト
│       ├── components/   # コンポーネントのテスト
│       ├── lib/          # ライブラリのテスト
│       ├── store/        # ストアのテスト
│       └── utils/        # ユーティリティのテスト
│
├── types/                # 型定義
│   ├── components/      # コンポーネントの型
│   ├── services/        # APIクライアントの型
│   └── store/           # storeの型
│
└── utils/                # ユーティリティ関数
    ├── format.ts         # フォーマット用関数
    ├── validation.ts     # バリデーション関数
    └── helpers.ts        # その他のヘルパー関数
```

## GitHub Actionsについて

mainブランチに対してPRを作成すると、静的解析とテスト、ビルドが実行されます。

1. 型チェック
2. ESLint/Prettierの静的解析
3. テスト
4. ビルド

成功したかどうかはプルリクエストのステータスを御覧ください。

## 実装されているESLintカスタムルール

ご自身の環境にあわせてカスタムルールを`off`にしてください。

### settings/rules/reactive-value-suffix.js

リアクティブな値に対して、`.value`を使用してアクセスすることを強制したルール。
なお、composablesなどの関数（`useFoo`などのuseから始まる関数）の引数に対してはこのルールはスキップされる。
また、composablesから分割代入された関数（正確には分割代入されたすべての値）に対してもこのルールはスキップされる。

### settings/rules/store-state-suffix.js

storeに定義されているstateで、`storeToRefs`を使用して分割代入をする時、

```ts
const { foo } = storeToRefs(fooStore);
```

とするのではなく

```ts
const { foo: fooState } = storeToRefs(fooStore);
```

というように、state名に`State`という接尾辞を付けることを強制したルール。
（gettersもstoreToRefsを使用して分割代入するので、区別できるように）

### ルールの追加方法

`settings/rules/src`配下にルール用のファイルを作成し、`pnpm build:custom-lint`したものが`settings/rules/dist`に出力されます。
それを`settings/rules/index.js`で読み込み、`eslint.config.mjs`で有効にしてください。
