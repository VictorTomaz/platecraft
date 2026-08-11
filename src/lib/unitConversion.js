export const GRAMS_PER_OZ = 28.3495;

export function toggleUnit(unit) {
  return unit === "oz" ? "g" : "oz";
}

export function convertAmount(amount, fromUnit, toUnit) {
  const num = parseFloat(amount) || 0;
  if (fromUnit === toUnit) return num;
  if (fromUnit === "oz" && toUnit === "g") return Math.round(num * GRAMS_PER_OZ * 100) / 100;
  if (fromUnit === "g" && toUnit === "oz") return Math.round((num / GRAMS_PER_OZ) * 100) / 100;
  return num;
}