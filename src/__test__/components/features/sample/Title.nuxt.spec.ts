import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { bindTestingPinia, mountSuspendedComponent } from '@/__test__/testHelper';
import Title from '@/components/features/sample/Title.vue';
import { useSampleStore } from '@/store/sampleStore';

describe('src/features/sample/components/Title.vue', () => {
  let testingPinia: ReturnType<typeof bindTestingPinia>;
  let sampleStore: ReturnType<typeof useSampleStore>;

  beforeEach(() => {
    testingPinia = bindTestingPinia();
    sampleStore = useSampleStore();
    sampleStore.updateTitle = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  test('isFetchingStateがtrueのとき、ローディング文言が表示されること', async () => {
    sampleStore.isFetching = true;
    sampleStore.title = 'test';
    const wrapper = await mountSuspendedComponent(Title, testingPinia);
    expect(wrapper.find('p').text()).toBe('Loading...');
  });

  test('isFetchingStateがfalseのとき、titleStateが表示されること', async () => {
    sampleStore.isFetching = false;
    sampleStore.title = 'test';
    const wrapper = await mountSuspendedComponent(Title, testingPinia);
    expect(wrapper.find('h1').text()).toBe('test');
  });

  test('コンポーネントマウント時にupdateTitleが呼び出されること', async () => {
    await mountSuspendedComponent(Title, testingPinia);
    expect(sampleStore.updateTitle).toHaveBeenCalled();
  });
});
