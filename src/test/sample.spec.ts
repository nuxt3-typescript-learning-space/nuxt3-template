import { expect, describe, it } from 'vitest';
import { sampleSum } from '@/utils/sample';

describe('src/utils/sample.ts', () => {
  it('1 + 2が3になること', () => {
    expect(sampleSum(1, 2)).toBe(3);
  });
  it('1 + 2が4にならないこと', () => {
    expect(sampleSum(1, 2)).not.toBe(4);
  });
});
