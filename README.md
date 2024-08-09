## このリポジトリについて

**パッと始めるNuxt3用テンプレート**

## 開発環境の立ち上げ方

```bash
pnpm install
```

```bash
pnpm dev
```

## ディレクトリ構造

```bash
src
├── assets                        # 画像やCSSなどの静的ファイル用のディレクトリ
│   ├── css                       # CSSファイル用のディレクトリ
│   │   └── tailwind.css          # TailwindCSSの設定ファイル
│   └── image                     # 画像ファイル用のディレクトリ
├── components                    # 共通のコンポーネント用のディレクトリ
│   ├── layout                    # レイアウト用のコンポーネント用のディレクトリ
│   └── ui                        # UIコンポーネント用のディレクトリ
│       └── button                # ボタンコンポーネント用のディレクトリ
│           ├── Button.vue
│           └── index.ts
├── composables                   # コンポーザブル関数用のディレクトリ
├── features                      # 各ページごとの機能用のディレクトリ
│   └── sample                    # サンプルページ用のディレクトリ
│       ├── api                   # サンプルページ固有のAPI呼び出し用のディレクトリ
│       └── components            # サンプルページ固有のコンポーネント用のディレクトリ
│           ├── CounterDisplay.vue
│           ├── Index.vue
│           └── Title.vue
├── lib                           # ライブラリに依存した関数用のディレクトリ
│   └── tailwind.ts
├── pages                         # ルーティングページ用のディレクトリ
│   ├── index.vue
│   └── sample                    # サンプルページ用のディレクトリ
│       └── index.vue
├── server                        # サーバーサイドの処理用のディレクトリ
│   ├── api                       # サーバーサイドのAPI用のディレクトリ
│   │   └── title.ts
│   └── tsconfig.json
├── store                         # 状態管理（Pinia）用のディレクトリ
│   └── counterStore.ts
├── test                          # テスト用のディレクトリ
│   ├── e2e                       # E2Eテスト用のディレクトリ
│   ├── integration               # 統合テスト用のディレクトリ
│   └── unit                      # ユニットテスト用のディレクトリ
│       └── lib
│           ├── sample.spec.ts
│           └── tailwind.spec.ts
├── types                         # 型定義用のディレクトリ
└── utils                         # ユーティリティ関数用のディレクトリ
    └── sample.ts

```

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
