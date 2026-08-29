export const TAX_RATE = 0.09;

export function parsePrice(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}

export function calculateTotals(items, taxRate = TAX_RATE) {
  const subtotal = items.reduce(
    (sum, item) => sum + parsePrice(item.price) * Number(item.quantity || 0),
    0
  );
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const tax = Math.round(roundedSubtotal * taxRate * 100) / 100;
  return {
    subtotal: roundedSubtotal,
    tax,
    total: Math.round((roundedSubtotal + tax) * 100) / 100,
  };
}

export function setOrderItemQuantity(items, item, quantity) {
  const nextQuantity = Math.max(0, Number.parseInt(quantity, 10) || 0);
  const existingIndex = items.findIndex((entry) => entry.id === item.id);

  if (nextQuantity === 0) {
    return existingIndex === -1
      ? items
      : items.filter((entry) => entry.id !== item.id);
  }

  if (existingIndex === -1) {
    return [...items, { ...item, quantity: nextQuantity }];
  }

  return items.map((entry) =>
    entry.id === item.id ? { ...entry, quantity: nextQuantity } : entry
  );
}
