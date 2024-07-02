/**
 * リストを更新する関数
 * @param {string[]} existingList - 既存のリスト
 * @param {string[]} newValues - 新しい値のリスト
 * @returns {string[]} - 更新されたリスト
 */
export const updateList = (existingList: string[], newValues: string[]): string[] => {
  const updatedList = existingList.filter((value) => newValues.includes(value));
  newValues.forEach((value) => {
    if (!updatedList.includes(value)) {
      updatedList.push(value);
    }
  });
  return updatedList;
};
