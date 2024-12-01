import { createGtm } from '@gtm-support/vue-gtm';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  /**
   * GTM ID が有効かどうかを判定する
   *
   * @param {string} id - チェックするGTM ID
   * @returns {boolean} - 有効なら true, 無効なら false
   *
   * @example
   * // 有効なGTM ID:
   * // 'GTM-A1B2C3D'
   * // 'G-A1B2C3D'
   *
   * @example
   * // 無効なGTM ID:
   * // 'ABC-A1B2C3D'
   * // 'GTM1234567'
   *
   * 正規表現の詳細:
   * - 'GTM-' または 'G-' で始まる
   * - その後に任意の桁数の大文字英数字が続く
   */
  const isValidGtmID = (id: string): boolean => /^(GTM|G)-[0-9A-Z]+$/.test(id);

  const gtmID = config.public.GTM_ID as string;
  if (!gtmID) {
    // eslint-disable-next-line no-console
    console.warn('GTM_ID is not configured');
    return;
  }
  if (!isValidGtmID(gtmID)) {
    // eslint-disable-next-line no-console
    console.warn(`Invalid GTM_ID format: ${gtmID}`);
    return;
  }

  const gtm = createGtm({
    id: gtmID,
    defer: true,
    enabled: process.env.NODE_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
    loadScript: true,
  });

  nuxtApp.vueApp.use(gtm);
});
