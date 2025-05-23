export const parseAmount = (
  amountStr: string | number | null | undefined
): number => {
  if (amountStr == null) return 0;
  if (typeof amountStr === "number") return amountStr;
  if (typeof amountStr === "string") {
    return parseFloat(amountStr.replace(/,/g, "")) || 0;
  }
  return 0;
};

export const formatAmount = (amount: number): string => {
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
