/**
 * リアクティブ関数名リスト
 * @type {('ref' | 'toRefs' | 'storeToRefs' | 'computed')[]}
 */
export const REACTIVE_FUNCTIONS = ['ref', 'toRefs', 'storeToRefs', 'computed'];

/**
 * composablesの慣習的な関数名のパターン
 */
export const COMPOSABLE_FUNCTION_PATTERN = /^use[A-Z]/;

/**
 * .valueチェックをスキップする関数の名前を格納するリスト
 *
 * このリストに含まれる関数名の引数は`.value`チェックがスキップされます。
 * @type {string[]}
 */
export const SKIP_CHECK_ARGUMENT_FUNCTION_NAMES = [];
