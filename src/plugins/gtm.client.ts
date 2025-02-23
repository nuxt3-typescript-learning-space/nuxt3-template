import { createGtm } from '@gtm-support/vue-gtm';
import type { GtmIdContainer } from '@gtm-support/vue-gtm';

/**
 * GTM IDの型定義
 * string: 単一のGTM ID
 * string[]: GTM IDの配列
 * GtmIdContainer[]: GTM IDを含むオブジェクトの配列
 */
type GtmIdType = string | string[] | GtmIdContainer[];

/**
 * GTM IDのバリデーションパターン
 * GTM-XXXXXXX or G-XXXXXXX の形式
 */
const GTM_ID_PATTERN = /^(GTM|G)-[0-9A-Z]{6,12}$/;

/**
 * GTM IDコンテナオブジェクトの型ガード
 */
export const isGtmContainer = (item: unknown): item is GtmIdContainer => {
  return typeof item === 'object' && item !== null && 'id' in item && typeof (item as GtmIdContainer).id === 'string';
};

/**
 * GTM ID が有効かどうかを判定する
 *
 * @param id チェックするGTM ID
 * @returns 有効なら true, 無効なら false
 *
 * @example
 * // 有効なGTM ID:
 * isValidGtmId('GTM-A1B2C3D')      // => true
 * isValidGtmId('G-A1B2C3D')        // => true
 * isValidGtmId(['GTM-A1B2C3D'])    // => true
 * isValidGtmId([{ id: 'G-A1B2C3D' }]) // => true
 */
export const isValidGtmId = (id: GtmIdType): boolean => {
  // 文字列の場合
  if (typeof id === 'string') {
    return GTM_ID_PATTERN.test(id);
  }

  // 配列でない場合は無効
  if (!Array.isArray(id)) {
    return false;
  }

  // 空配列の場合は無効
  if (id.length === 0) {
    return false;
  }

  return id.every((item) => {
    if (typeof item === 'string') {
      return GTM_ID_PATTERN.test(item);
    }

    if (isGtmContainer(item)) {
      return GTM_ID_PATTERN.test(item.id);
    }

    return false;
  });
};

export default defineNuxtPlugin((nuxtApp) => {
  const { $logger } = useNuxtApp();
  const config = useRuntimeConfig();
  const gtmId: GtmIdType | undefined = config.public.GTM_ID;

  // GTM IDが設定されていない場合は早期リターン
  if (!gtmId) {
    return;
  }

  // GTM IDが無効な場合は警告を出して早期リターン
  if (!isValidGtmId(gtmId)) {
    $logger.warn({ plugin: 'GTM', gtmId }, 'Invalid GTM_ID format');
    return;
  }

  // GTMの初期化と設定
  const gtm = createGtm({
    id: gtmId,
    defer: true,
    loadScript: true,
  });

  nuxtApp.vueApp.use(gtm);
});
