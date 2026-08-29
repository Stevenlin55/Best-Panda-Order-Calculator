# Best Panda Order Desk

Internal order calculator for Best Panda Chinese Restaurant. Menu items and
prices are read from the same Firestore project as the customer website.

## Local development

This project currently uses Create React App 4 and runs most reliably on
Node.js 16.

```bash
npx npm@7.24.2 ci --legacy-peer-deps
npm start
```

## Workflow

- Search the complete menu or filter by category.
- Tap a dish to add it and adjust quantities from either side of the screen.
- Add an optional customer note or custom charge.
- The current order and its start time are automatically saved in local
  browser storage and restored after a refresh.
- Totals include the configured 9% tax rate.
- Use **New order** to clear the current order after confirmation.
- Use **Print receipt** for a clean order-only print layout.

The calculator reads menu data from Firestore but does not write orders back to
Firestore.

## Menu price manager

Open `/admin/menu` or use the **Prices** button in the Order Desk header. The
mobile price manager can search and filter every dish, update its Firestore
`price` field after a before-and-after confirmation, and undo the most recent
change.

The price manager intentionally has no sign-in because it is designed for
link-based family access. The current Firestore rules allow anonymous updates,
so anyone who discovers the page or database endpoint can change prices. Add
Firebase Authentication and restricted write rules if that access model ever
needs to change.
