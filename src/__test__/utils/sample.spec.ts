import { expect, describe, test } from 'vitest';
import { sampleSum } from '@/utils/sample';

describe('src/utils/sample.ts', () => {
  test('1 + 2が3になること', () => {
    expect(sampleSum(1, 2)).toBe(3);
  });
  test('1 + 2が4にならないこと', () => {
    expect(sampleSum(1, 2)).not.toBe(4);
  });
});
