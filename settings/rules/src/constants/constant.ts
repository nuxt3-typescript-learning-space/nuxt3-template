type REACTIVE_FUNCTIONS = 'ref' | 'toRefs' | 'storeToRefs' | 'computed';

/**
 * リアクティブな値を返す関数名のリスト
 */
export const REACTIVE_FUNCTIONS: REACTIVE_FUNCTIONS[] = ['ref', 'toRefs', 'storeToRefs', 'computed'];

/**
 * composablesの慣習的な関数名の正規表現パターン
 *
 * useという接頭辞がついて、次に大文字が始まるという正規表現
 */
export const COMPOSABLES_FUNCTION_PATTERN: RegExp = /^use[A-Z]/;
