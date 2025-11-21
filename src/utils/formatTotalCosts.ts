export type Cost = {
  title: string;
  amount: number;
  required?: "required" | "notRequired";
};

export const formatTotalCosts = (costs?: Cost[]) => {
  if (!costs || costs.length === 0) return "Free";

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const requiredTotal = costs
    .filter((cost) => cost.required !== "notRequired")
    .reduce((acc, cost) => acc + cost.amount, 0);

  const totalWithOptional = costs.reduce((acc, cost) => acc + cost.amount, 0);

  if (requiredTotal === 0) {
    return "Free";
  }

  if (requiredTotal === totalWithOptional) {
    return formatCurrency(requiredTotal);
  }

  return `${formatCurrency(requiredTotal)}–${formatCurrency(totalWithOptional)}`;
};
