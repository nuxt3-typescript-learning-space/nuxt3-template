import tsEslintParser from '@typescript-eslint/parser';
import vuePrettierConfig from '@vue/eslint-config-prettier';
import eslintReactiveValueSuffix from 'eslint-plugin-reactive-value-suffix';
import globals from 'globals';
import vueEslintParser from 'vue-eslint-parser';
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintCustomRulesPlugin from './settings/rules/index.js';

export default withNuxt([
  {
    ignores: ['.cz-config.cts'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tsEslintParser,
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
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
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
      'reactive-value-suffix/suffix': ['error', { functionNamesToIgnoreValueCheck: [] }],
    },
  },
  {
    files: ['src/components/ui/**/*'],
    rules: {
      'vue/require-default-prop': 'off',
    },
  },
  vuePrettierConfig,
]);
