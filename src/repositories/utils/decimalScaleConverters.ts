/**
 * 小数を整数とscaleに変換
 *
 * @param {number | null | undefined} value - 小数
 * @returns { value: number | null, scale: number | null } - value: 整数値, scale: 小数点以下の桁数
 */
export const convertDecimalToIntegerAndScale = (value: number | null | undefined): { value: number | null, scale: number | null } => {
  if (value === null || value === undefined) {
    return { value: null, scale: null };
  }
  // 整数のみ
  if (Number.isInteger(value)) {
    return { value: value, scale: null };
  }
  // 小数の場合は小数点以下の桁数を計算
  const decimalPart = value.toString().split('.')[1];
  const scale = decimalPart ? decimalPart.length : 0; // 小数点以下の桁数（例: 100.5 → 1, 100.25 → 2）
  const integerValue = Math.round(value * Math.pow(10, scale));

  return { value: integerValue, scale: scale };
};

/**
 * 整数とscaleを小数に変換
 *
 * @param {number | null } value - 整数値
 * @param {number} scale - 小数点以下の桁数
 * @returns {number} - 変換された小数値
 */
export const convertIntegerAndScaleToDecimal = (value: number | null, scale: number | null): number | null => {
  if (value === null) {
    return null;
  }

  if (scale === null || scale === 0) {
    return value;
  }

  return value / Math.pow(10, scale);
};
