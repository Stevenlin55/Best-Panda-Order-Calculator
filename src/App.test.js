import { calculateTotals, parsePrice, setOrderItemQuantity } from "./orderUtils";

test("parses Firebase menu prices", () => {
  expect(parsePrice("$15.99")).toBe(15.99);
});

test("calculates a 9 percent taxed order", () => {
  expect(
    calculateTotals([{ id: "a", price: 10, quantity: 2 }])
  ).toEqual({ subtotal: 20, tax: 1.8, total: 21.8 });
});

test("adds, updates, and removes an order item", () => {
  const dish = { id: "beef", name: "Beef", price: 15.99 };
  const added = setOrderItemQuantity([], dish, 1);
  expect(added[0].quantity).toBe(1);
  expect(setOrderItemQuantity(added, dish, 3)[0].quantity).toBe(3);
  expect(setOrderItemQuantity(added, dish, 0)).toEqual([]);
});
