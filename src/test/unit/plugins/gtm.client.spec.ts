import { describe, expect, suite, test } from 'vitest';
import { isValidGtmId } from '@/plugins/gtm.client';

suite('src/plugins/gtm.client.ts', () => {
  describe('isValidGtmId', () => {
    test('正しい形式のGTM IDを検証できること', () => {
      expect(isValidGtmId('GTM-ABC1234')).toBe(true);
      expect(isValidGtmId('GTM-ABC1234DEF56')).toBe(true);
      expect(isValidGtmId('G-ABC1234')).toBe(true);
    });

    test('不正な形式のGTM IDを検証できること', () => {
      expect(isValidGtmId('GTM-123')).toBe(false);
      expect(isValidGtmId('GTM_ABC1234')).toBe(false);
      expect(isValidGtmId('UAT-ABC1234')).toBe(false);
      expect(isValidGtmId('')).toBe(false);
    });

    test('GTM IDの配列を検証できること', () => {
      expect(isValidGtmId(['GTM-ABC1234', 'G-XYZ7890'])).toBe(true);
      expect(isValidGtmId(['GTM-ABC1234', 'invalid-id'])).toBe(false);
      expect(isValidGtmId([])).toBe(false);
    });

    test('GTM IDコンテナオブジェクトの配列を検証できること', () => {
      expect(isValidGtmId([{ id: 'GTM-ABC1234' }])).toBe(true);
      expect(isValidGtmId([{ id: 'GTM-ABC1234' }, { id: 'G-XYZ7890' }])).toBe(true);
      expect(isValidGtmId([{ id: 'invalid-id' }])).toBe(false);
    });
  });
});
