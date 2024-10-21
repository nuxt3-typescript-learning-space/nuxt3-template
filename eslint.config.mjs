import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintCustomRulesPlugin from './settings/rules/index.js';
import eslintReactiveValueSuffix from 'eslint-plugin-reactive-value-suffix';

export default withNuxt({
  ignores: ['.cz-config.cts', 'prettier.config.mjs', 'eslint.config.mjs', 'settings/rules/**/*'],
  languageOptions: {
    parserOptions: {
      parser: '@typescript-eslint/parser',
      project: './tsconfig.json',
    },
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {
    'coding-rules': eslintCustomRulesPlugin,
    'reactive-value-suffix': eslintReactiveValueSuffix,
  },
  rules: {
    'no-console': 'warn',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'vue/require-default-prop': 'off',
    '@typescript-eslint/ban-types': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/html-self-closing': 'off',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'never',
      },
    ],
    'coding-rules/store-state-suffix': 'error',
    'reactive-value-suffix/suffix': [
      'error',
      {
        /**
         * 関数名の引数で、.value チェックをスキップしたい関数名のリスト
         *
         * 例） fooFunc(reactiveValue)のとき、fooFunc内でreactiveValue.valueを参照している場合は、チェックされない方がいいため追加
         * @type {string[]}
         */
        functionNamesToIgnoreValueCheck: [],
      },
    ],
    ...prettierConfig.rules,
  },
});
