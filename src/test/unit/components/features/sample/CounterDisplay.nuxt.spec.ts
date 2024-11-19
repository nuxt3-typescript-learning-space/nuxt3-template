import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import CounterDisplay from '@/components/features/sample/CounterDisplay.vue';
import { bindTestingPinia, mountComponent } from '@/test/testHelper';
import type { TestingPinia } from '@pinia/testing';

describe('src/features/sample/components/CounterDisplay.vue', () => {
  let pinia: TestingPinia;

  beforeEach(() => {
    pinia = bindTestingPinia();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('コンポーネントに渡されたPropsが適切に表示されていること', () => {
    const testProps = { count: 999 };
    const wrapper = mountComponent(CounterDisplay, pinia, { props: testProps });
    expect(wrapper.find('div').text()).toBe('counter: 999');
  });
});
