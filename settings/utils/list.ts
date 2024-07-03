/**
 * リストを更新する関数
 * @param {string[]} newValues - 新しい値のリスト
 * @returns {string[]} - 更新されたリスト
 */
export const updateList = (newValues: string[]): string[] => {
  const updatedList: string[] = [];
  newValues.forEach((value) => {
    if (!updatedList.includes(value)) {
      updatedList.push(value);
    }
  });
  return updatedList;
};
