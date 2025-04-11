import type { TSESTree } from '@typescript-eslint/utils';

export type PropertyWithIdentifier = TSESTree.Property & { key: TSESTree.Identifier; value: TSESTree.Identifier };
