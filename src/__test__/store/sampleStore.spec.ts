import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, test } from 'vitest';
import { useSampleStore } from '@/store/sampleStore';

describe('sampleStore', () => {
  let sampleStore: ReturnType<typeof useSampleStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    sampleStore = useSampleStore();
  });

  describe('getters', () => {
    test('getCountが初期のカウントを返すこと', () => {
      expect(sampleStore.getCount).toBe(0);
      sampleStore.increment();
      expect(sampleStore.getCount).toBe(1);
    });

    test('getCount2がカウントに2を加えること', () => {
      expect(sampleStore.getCount2).toBe(2);
    });

    test('getCount3が指定された数をカウントに加えること', () => {
      expect(sampleStore.getCount3(3)).toBe(3);
    });

    test('getCount4が指定された数をカウントに加えること', () => {
      expect(sampleStore.getCount4(4)).toBe(4);
    });

    test('getCount5が指定された数をカウントに加え、状態を変更すること', () => {
      expect(sampleStore.getCount5(5)).toBe(10);
      expect(sampleStore.count).toBe(5);
    });

    test('getCount6が指定された数をカウントに加え、状態を変更すること', () => {
      expect(sampleStore.getCount6(6)).toBe(12);
      expect(sampleStore.count).toBe(6);
    });
  });

  describe('actions', () => {
    test('incrementでカウントが増加すること', () => {
      expect(sampleStore.count).toBe(0);
      sampleStore.increment();
      expect(sampleStore.count).toBe(1);
    });

    test('decrementでカウントが減少すること', () => {
      expect(sampleStore.count).toBe(0);
      sampleStore.decrement();
      expect(sampleStore.count).toBe(-1);
    });
  });
});
