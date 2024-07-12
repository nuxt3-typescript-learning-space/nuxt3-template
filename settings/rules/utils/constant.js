/**
 * リアクティブ関数名リスト
 * @type {('ref' | 'toRefs' | 'storeToRefs' | 'computed')[]}
 */
export const REACTIVE_FUNCTIONS = ['ref', 'toRefs', 'storeToRefs', 'computed'];

/**
 * composablesの慣習的な関数名のパターン
 */
export const COMPOSABLE_FUNCTION_PATTERN = /^use[A-Z]/;
