## このリポジトリについて

**パッと始めるNuxt3用テンプレート**

## 開発環境の立ち上げ方

```bash
pnpm install
```

```bash
pnpm dev
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

### settings/rules/store-getters-not-alias.js

storeに定義されているgettersで、`storeToRefs`を使用して分割代入をする時、

```ts
const { foo: fooGetter } = storeToRefs(fooStore);
```

とするのではなく

```ts
const { foo } = storeToRefs(fooStore);
```

というように、getters名を他のプロパティ名にエイリアスしないことを強制したルール。
