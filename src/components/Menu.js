import React, { useEffect, useMemo, useRef, useState } from "react";
import db from "./firebase";
import Header from "./Header";
import {
  calculateTotals,
  formatCurrency,
  parsePrice,
  setOrderItemQuantity,
  TAX_RATE,
} from "../orderUtils";
import "../styles.css";

const STORAGE_KEY = "bestPandaOrderDeskV4";
const CATEGORY_NAMES = [
  "Appetizer",
  "Soup",
  "Chop Suey",
  "Egg Foo Young",
  "Poultry",
  "Roast Pork",
  "Shrimp",
  "Beef",
  "Vegetable",
  "Fried Rice",
  "Lo Mein",
  "Chow Mein Fun",
  "House Specialties",
  "Daily Special",
  "Lunch Menu",
  "Side Orders",
];

function loadInitialOrder() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (current && Array.isArray(current.items)) {
      return current;
    }

    const legacy = JSON.parse(
      sessionStorage.getItem("currentOrder") ||
        sessionStorage.getItem("savedOrder") ||
        "null"
    );
    if (Array.isArray(legacy) && legacy.length) {
      return {
        items: legacy.map((item, index) => ({
          id: `legacy-${item.name}-${index}`,
          name: item.name,
          price: parsePrice(item.price),
          quantity: Number(item.quantity) || 1,
          category: item.name === "Extra" ? "Custom" : "Saved order",
          custom: item.name === "Extra",
        })),
        note: "",
        startedAt: Date.now(),
      };
    }
  } catch (error) {
    // A corrupt saved order should never prevent the calculator from opening.
  }

  return { items: [], note: "", startedAt: Date.now() };
}

function QuantityControl({ item, quantity, onChange, compact = false }) {
  return (
    <div className={`quantity-control ${compact ? "compact" : ""}`}>
      <button
        type="button"
        onClick={() => onChange(item, quantity - 1)}
        aria-label={`Remove one ${item.name}`}
      >
        −
      </button>
      <input
        type="number"
        min="0"
        inputMode="numeric"
        value={quantity}
        onChange={(event) => onChange(item, event.target.value)}
        aria-label={`${item.name} quantity`}
      />
      <button
        type="button"
        onClick={() => onChange(item, quantity + 1)}
        aria-label={`Add one ${item.name}`}
      >
        +
      </button>
    </div>
  );
}

export default function Menu() {
  const initialOrder = useMemo(loadInitialOrder, []);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [orderItems, setOrderItems] = useState(initialOrder.items);
  const [orderNote, setOrderNote] = useState(initialOrder.note || "");
  const [startedAt, setStartedAt] = useState(initialOrder.startedAt || Date.now());
  const [orderOpen, setOrderOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMenu() {
      try {
        const loadedCategories = await Promise.all(
          CATEGORY_NAMES.map(async (name) => {
            const snapshot = await db.collection(name).orderBy("number").get();
            return {
              name,
              items: snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: `${name}::${doc.id}`,
                  name: doc.id,
                  category: name,
                  price: parsePrice(data.price),
                  description: data.description || "",
                  number: data.number,
                };
              }),
            };
          })
        );
        if (mounted) {
          setCategories(loadedCategories);
          setLoading(false);
        }
      } catch (fetchError) {
        if (mounted) {
          setError("The menu could not be loaded. Check the connection and try again.");
          setLoading(false);
        }
      }
    }

    fetchMenu();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items: orderItems, note: orderNote, startedAt })
    );
  }, [orderItems, orderNote, startedAt]);

  useEffect(() => {
    function handleShortcut(event) {
      const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current && searchRef.current.focus();
      }
      if (event.key === "Escape") {
        if (orderOpen) setOrderOpen(false);
        else if (search) setSearch("");
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [orderOpen, search]);

  const allItems = useMemo(
    () => categories.flatMap((category) => category.items),
    [categories]
  );
  const quantityById = useMemo(
    () => Object.fromEntries(orderItems.map((item) => [item.id, item.quantity])),
    [orderItems]
  );
  const totals = useMemo(() => calculateTotals(orderItems), [orderItems]);
  const itemCount = orderItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, allItems, search]);

  function updateQuantity(item, quantity) {
    setOrderItems((items) => setOrderItemQuantity(items, item, quantity));
  }

  function addCustomItem(event) {
    event.preventDefault();
    const price = parsePrice(customPrice);
    if (price <= 0) return;
    const item = {
      id: `custom-${Date.now()}`,
      name: customName.trim() || "Extra charge",
      category: "Custom",
      price,
      custom: true,
    };
    setOrderItems((items) => setOrderItemQuantity(items, item, 1));
    setCustomName("");
    setCustomPrice("");
  }

  function startNewOrder() {
    if (orderItems.length && !window.confirm("Clear this order and start a new one?")) {
      return;
    }
    setOrderItems([]);
    setOrderNote("");
    setStartedAt(Date.now());
    setOrderOpen(false);
    sessionStorage.removeItem("currentOrder");
    sessionStorage.removeItem("savedOrder");
    searchRef.current && searchRef.current.focus();
  }

  const startedLabel = new Date(startedAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="order-desk-app">
      <Header
        itemCount={itemCount}
        total={formatCurrency(totals.total)}
        onOpenOrder={() => setOrderOpen(true)}
        onNewOrder={startNewOrder}
      />

      <main className="workspace-shell">
        <section className="menu-workspace">
          <div className="workspace-heading">
            <div>
              <p className="staff-kicker">Staff tool</p>
              <h1>Build an order</h1>
              <p>Search a dish or choose a category, then tap to add it.</p>
            </div>
            <span className="shortcut-hint"><kbd>/</kbd> Search</span>
          </div>

          <label className="order-search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <span className="sr-only">Search menu</span>
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dishes, categories, or ingredients"
              autoFocus
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                ×
              </button>
            )}
          </label>

          <div className="category-tabs" aria-label="Menu categories">
            {["All", ...CATEGORY_NAMES].map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {loading && (
            <div className="workspace-message" role="status">
              <span className="loading-spinner" />
              <h2>Loading the current menu…</h2>
            </div>
          )}

          {error && (
            <div className="workspace-message error-message" role="alert">
              <h2>Menu unavailable</h2>
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>Try again</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="result-count">
                <strong>{filteredItems.length}</strong> menu items
                {activeCategory !== "All" && <> in {activeCategory}</>}
              </div>
              <div className="dish-grid">
                {filteredItems.map((item) => {
                  const quantity = quantityById[item.id] || 0;
                  return (
                    <article className={`dish-card ${quantity ? "in-order" : ""}`} key={item.id}>
                      <button
                        type="button"
                        className="dish-main-action"
                        onClick={() => updateQuantity(item, quantity + 1)}
                        aria-label={`Add ${item.name}`}
                      >
                        <span className="dish-copy">
                          <small>{item.category}</small>
                          <strong>{item.name}</strong>
                          {item.description && <em>{item.description}</em>}
                        </span>
                        <span className="dish-price">{formatCurrency(item.price)}</span>
                      </button>
                      {quantity > 0 ? (
                        <QuantityControl item={item} quantity={quantity} onChange={updateQuantity} />
                      ) : (
                        <button
                          type="button"
                          className="quick-add"
                          onClick={() => updateQuantity(item, 1)}
                        >
                          Add <span aria-hidden="true">+</span>
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
              {!filteredItems.length && (
                <div className="workspace-message">
                  <h2>No matching dishes</h2>
                  <p>Try another spelling or select “All.”</p>
                </div>
              )}
            </>
          )}
        </section>

        <div
          className={`order-backdrop ${orderOpen ? "visible" : ""}`}
          onClick={() => setOrderOpen(false)}
          aria-hidden="true"
        />
        <aside className={`order-panel ${orderOpen ? "mobile-open" : ""}`} aria-label="Current order">
          <div className="order-panel-header">
            <div>
              <p>Current order</p>
              <h2>{itemCount ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "No items yet"}</h2>
              <span>Started {startedLabel}</span>
            </div>
            <button type="button" className="close-order" onClick={() => setOrderOpen(false)} aria-label="Close order">
              ×
            </button>
          </div>

          <label className="order-note">
            <span>Customer / order note</span>
            <input
              value={orderNote}
              onChange={(event) => setOrderNote(event.target.value)}
              placeholder="Name, phone, or special note"
            />
          </label>

          <div className="order-lines">
            {orderItems.length ? (
              orderItems.map((item) => (
                <article className="order-line" key={item.id}>
                  <div className="order-line-top">
                    <div>
                      <small>{item.category}</small>
                      <strong>{item.name}</strong>
                    </div>
                    <b>{formatCurrency(item.price * item.quantity)}</b>
                  </div>
                  <div className="order-line-controls">
                    <QuantityControl
                      item={item}
                      quantity={item.quantity}
                      onChange={updateQuantity}
                      compact
                    />
                    <button type="button" onClick={() => updateQuantity(item, 0)}>Remove</button>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-order">
                <span aria-hidden="true">＋</span>
                <strong>Your order is empty</strong>
                <p>Tap any menu item to add it here.</p>
              </div>
            )}
          </div>

          <form className="custom-charge" onSubmit={addCustomItem}>
            <p>Add a custom charge</p>
            <div>
              <label>
                <span className="sr-only">Charge name</span>
                <input
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="Label (optional)"
                />
              </label>
              <label className="money-input">
                <span aria-hidden="true">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={customPrice}
                  onChange={(event) => setCustomPrice(event.target.value)}
                  placeholder="0.00"
                  aria-label="Custom charge amount"
                />
              </label>
              <button type="submit" disabled={parsePrice(customPrice) <= 0}>Add</button>
            </div>
          </form>

          <div className="totals-card">
            <div><span>Subtotal</span><strong>{formatCurrency(totals.subtotal)}</strong></div>
            <div><span>Tax ({Math.round(TAX_RATE * 100)}%)</span><strong>{formatCurrency(totals.tax)}</strong></div>
            <div className="grand-total"><span>Total</span><strong>{formatCurrency(totals.total)}</strong></div>
          </div>

          <div className="order-actions">
            <button type="button" className="print-order" onClick={() => window.print()} disabled={!orderItems.length}>
              Print receipt
            </button>
            <button type="button" className="new-order" onClick={startNewOrder}>
              New order
            </button>
          </div>
        </aside>
      </main>

      <button type="button" className="mobile-order-bar" onClick={() => setOrderOpen(true)}>
        <span><b>{itemCount}</b> {itemCount === 1 ? "item" : "items"}</span>
        <strong>{formatCurrency(totals.total)}</strong>
        <em>Review order</em>
      </button>
    </div>
  );
}
