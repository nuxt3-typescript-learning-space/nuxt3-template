import { createGtm } from '@gtm-support/vue-gtm';
import type { GtmIdContainer } from '@gtm-support/vue-gtm';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  /**
   * GTM ID が有効かどうかを判定する
   *
   * @param id チェックするGTM ID
   * @returns 有効なら true, 無効なら false
   *
   * @example
   * // 有効なGTM ID:
   * // 'GTM-A1B2C3D'
   * // 'G-A1B2C3D'
   * // ['GTM-A1B2C3D', 'G-A1B2C3D']
   * // [{ id: 'GTM-A1B2C3D' }, { id: 'G-A1B2C3D' }]
   *
   * @example
   * // 無効なGTM ID:
   * // 'ABC-A1B2C3D'
   * // 'GTM1234567'
   */
  const isValidGtmID = (id: string | string[] | GtmIdContainer[]): boolean => {
    if (Array.isArray(id)) {
      // 配列の場合、各要素を検証
      return id.every((item) => {
        if (typeof item === 'string') {
          return /^(GTM|G)-[0-9A-Z]+$/.test(item);
        }
        if (typeof item === 'object' && item !== null && 'id' in item) {
          return /^(GTM|G)-[0-9A-Z]+$/.test(item.id);
        }
        return false;
      });
    }
    // 文字列の場合
    if (typeof id === 'string') {
      return /^(GTM|G)-[0-9A-Z]+$/.test(id);
    }
    return false;
  };

  const gtmID = config.public.GTM_ID as string | string[] | GtmIdContainer[];

  if (!gtmID) {
    return;
  }

  if (!isValidGtmID(gtmID)) {
    // eslint-disable-next-line no-console
    console.warn(`Invalid GTM_ID format: ${JSON.stringify(gtmID)}`);
    return;
  }

  const gtm = createGtm({
    id: gtmID,
    defer: true,
    loadScript: true,
  });

  nuxtApp.vueApp.use(gtm);
});
