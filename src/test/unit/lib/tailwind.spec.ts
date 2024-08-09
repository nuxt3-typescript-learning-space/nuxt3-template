import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/tailwind';

describe('app/lib/tailwind.ts', () => {
  it('偽値を無視する', () => {
    const result = cn('btn', '', null, undefined, false, 'btn-primary');
    expect(result).toBe('btn btn-primary');
  });

  it('クラス名の配列を処理する', () => {
    const result = cn(['btn', 'btn-primary'], ['btn-large']);
    expect(result).toBe('btn btn-primary btn-large');
  });

  it('ネストされたクラス名の配列を処理する', () => {
    const result = cn(['btn', ['btn-primary', ['btn-large']]]);
    expect(result).toBe('btn btn-primary btn-large');
  });

  it('キーがクラス名で値がブール値のオブジェクトを処理する', () => {
    const result = cn({
      btn: true,
      'btn-primary': true,
      hidden: false,
    });
    expect(result).toBe('btn btn-primary');
  });
});
