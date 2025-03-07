import { describe, expect, test } from 'vitest';
import { cn } from '@/lib/utils';

describe('app/lib/utils.ts', () => {
  test('偽値を無視する', () => {
    const result = cn('btn', '', null, undefined, false, 'btn-primary');
    expect(result).toBe('btn btn-primary');
  });

  test('クラス名の配列を処理する', () => {
    const result = cn(['btn', 'btn-primary'], ['btn-large']);
    expect(result).toBe('btn btn-primary btn-large');
  });

  test('ネストされたクラス名の配列を処理する', () => {
    const result = cn(['btn', ['btn-primary', ['btn-large']]]);
    expect(result).toBe('btn btn-primary btn-large');
  });

  test('キーがクラス名で値がブール値のオブジェクトを処理する', () => {
    const result = cn({
      btn: true,
      'btn-primary': true,
      hidden: false,
    });
    expect(result).toBe('btn btn-primary');
  });
});
