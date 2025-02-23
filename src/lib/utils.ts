import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Updater } from '@tanstack/vue-table';
import type { Ref } from 'vue';

/**
 * Tailwind CSSのクラス名を結合するユーティリティ関数
 * @param inputs - 結合するクラス名（文字列、配列、オブジェクト）
 * @returns 結合された文字列
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<unknown>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue;
}
