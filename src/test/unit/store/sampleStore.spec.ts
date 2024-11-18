import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSampleStore } from '@/store/sampleStore';

describe('sampleStore', () => {
  let sampleStore: ReturnType<typeof useSampleStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    sampleStore = useSampleStore();
  });

  describe('getters', () => {
    it('getCountが初期のカウントを返すこと', () => {
      expect(sampleStore.getCount).toBe(0);
      sampleStore.increment();
      expect(sampleStore.getCount).toBe(1);
    });

    it('getCount2がカウントに2を加えること', () => {
      expect(sampleStore.getCount2).toBe(2);
    });

    it('getCount3が指定された数をカウントに加えること', () => {
      expect(sampleStore.getCount3(3)).toBe(3);
    });

    it('getCount4が指定された数をカウントに加えること', () => {
      expect(sampleStore.getCount4(4)).toBe(4);
    });

    it('getCount5が指定された数をカウントに加え、状態を変更すること', () => {
      expect(sampleStore.getCount5(5)).toBe(10);
      expect(sampleStore.count).toBe(5);
    });

    it('getCount6が指定された数をカウントに加え、状態を変更すること', () => {
      expect(sampleStore.getCount6(6)).toBe(12);
      expect(sampleStore.count).toBe(6);
    });
  });

  describe('actions', () => {
    it('incrementでカウントが増加すること', () => {
      expect(sampleStore.count).toBe(0);
      sampleStore.increment();
      expect(sampleStore.count).toBe(1);
    });

    it('decrementでカウントが減少すること', () => {
      expect(sampleStore.count).toBe(0);
      sampleStore.decrement();
      expect(sampleStore.count).toBe(-1);
    });
  });
});
