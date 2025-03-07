import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { bindTestingPinia, mountSuspendedComponent } from '@/__test__/testHelper';
import CounterDisplay from '@/components/features/sample/CounterDisplay.vue';

describe('src/features/sample/components/CounterDisplay.vue', () => {
  let testingPinia: ReturnType<typeof bindTestingPinia>;

  beforeEach(() => {
    testingPinia = bindTestingPinia();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  test('コンポーネントに渡されたPropsが適切に表示されていること', async () => {
    const testProps = { count: 999 };
    const wrapper = await mountSuspendedComponent(CounterDisplay, testingPinia, { props: testProps });
    expect(wrapper.find('div').text()).toBe('counter: 999');
  });
});
