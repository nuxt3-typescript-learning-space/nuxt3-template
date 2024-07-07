## このリポジトリについて

**パッと始めるNuxt3用テンプレート**

## 開発環境の立ち上げ方

```bash
pnpm install
```

```bash
pnpm dev
```

## ESLintカスタムルールのディレクトリ構造

```
settings/
├── data/
│   ├── store-getters-list.json
│   └── store-state-list.json
├── rules/
│   ├── utils/
│   │   └── reactiveVariableUtils.js
│   ├── ASTNode.md
│   ├── index.js
│   ├── reactive-value-suffix.js
│   ├── store-getters-not-alias.js
│   └── store-state-suffix.js
├── utils/
│   ├── constant.ts
│   ├── file.ts
│   ├── json.ts
│   ├── list.ts
│   ├── logger.ts
│   └── regex.ts
├── convert.ts
├── updateGetterValues.ts
└── updateStateValues.ts
```

### convert.ts

storeディレクトリに定義されているTypeScriptファイルを取得し、そこに定義されているstate名とgetters名を取得する処理のメインの実行ファイル。

### updateGetterValues.ts

getters名を取得する処理を行うファイル。

### updateStateValues.ts

state名を取得する処理を行うファイル。

### settings/utils/\*\*

convert.ts, updateGetterValues.ts, updateStateValues.tsで使用するユーティリティ関数を定義するディレクトリ。

### settings/rules/ASTNode.md

ASTNodeについて記載したマークダウンファイル。

### settings/rules/index.js

ESLintのカスタムルールを定義するファイル。

### settings/rules/reactive-value-suffix.js

リアクティブな値に対して、`.value`を使用してアクセスすることを強制したルール。

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

### settings/rules/utils/

settings/rules/ディレクトリで使用するユーティリティ関数を定義するディレクトリ。
主にESLintのカスタムルールを定義する際に使用する関数を定義。

### settings/data/

convert.tsで自動的にリスト化されたstate名とgetters名を保存するディレクトリ。
