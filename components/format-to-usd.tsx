export function formatAsDollar(amountStr:string) {
  const amount = parseFloat(amountStr);

  if (isNaN(amount)) {
    return "Invalid amount";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}