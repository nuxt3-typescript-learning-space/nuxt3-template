import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintCustomRulesPlugin from './settings/rules/index.js';

export default withNuxt({
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: { 'coding-rules': eslintCustomRulesPlugin },
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
    'coding-rules/store-getters-not-alias': 'error',
    'coding-rules/reactive-value-suffix': 'error',
    ...prettierConfig.rules,
  },
});
