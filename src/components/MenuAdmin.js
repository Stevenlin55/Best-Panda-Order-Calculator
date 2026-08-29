import React, { useEffect, useMemo, useRef, useState } from "react";
import db from "./firebase";
import logo from "./panda.png";
import { CATEGORY_NAMES } from "../menuConfig";
import { formatCurrency, parsePrice } from "../orderUtils";
import "../admin.css";

function firestorePrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export default function MenuAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [editingItem, setEditingItem] = useState(null);
  const [draftPrice, setDraftPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [lastChange, setLastChange] = useState(null);
  const [undoing, setUndoing] = useState(false);
  const priceInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function fetchMenu() {
      try {
        const loaded = await Promise.all(
          CATEGORY_NAMES.map(async (category) => {
            const snapshot = await db.collection(category).orderBy("number").get();
            return snapshot.docs.map((document) => {
              const data = document.data();
              return {
                id: `${category}::${document.id}`,
                documentId: document.id,
                name: document.id,
                category,
                number: data.number,
                price: parsePrice(data.price),
              };
            });
          })
        );

        if (mounted) {
          setItems(loaded.flat());
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setLoadError("The menu could not be loaded. Check the connection and try again.");
          setLoading(false);
        }
      }
    }

    fetchMenu();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!editingItem || !priceInputRef.current) return;
    priceInputRef.current.focus();
    priceInputRef.current.select();
  }, [editingItem]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, items, search]);

  function openEditor(item) {
    setEditingItem(item);
    setDraftPrice(item.price.toFixed(2));
    setSaveError("");
  }

  function closeEditor() {
    if (saving) return;
    setEditingItem(null);
    setDraftPrice("");
    setSaveError("");
  }

  async function savePrice(event) {
    event.preventDefault();
    if (!editingItem) return;

    const nextPrice = Math.round(parsePrice(draftPrice) * 100) / 100;
    if (nextPrice <= 0 || nextPrice > 999.99) {
      setSaveError("Enter a price between $0.01 and $999.99.");
      return;
    }

    if (nextPrice === editingItem.price) {
      closeEditor();
      return;
    }

    const confirmed = window.confirm(
      `Change ${editingItem.name} from ${formatCurrency(editingItem.price)} to ${formatCurrency(nextPrice)}?`
    );
    if (!confirmed) return;

    setSaving(true);
    setSaveError("");
    try {
      await db
        .collection(editingItem.category)
        .doc(editingItem.documentId)
        .update({ price: firestorePrice(nextPrice) });

      const change = {
        item: editingItem,
        before: editingItem.price,
        after: nextPrice,
      };
      setItems((current) =>
        current.map((item) =>
          item.id === editingItem.id ? { ...item, price: nextPrice } : item
        )
      );
      setLastChange(change);
      setEditingItem(null);
      setDraftPrice("");
    } catch (error) {
      setSaveError("That price did not save. Check the connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function undoLastChange() {
    if (!lastChange || undoing) return;
    setUndoing(true);
    try {
      await db
        .collection(lastChange.item.category)
        .doc(lastChange.item.documentId)
        .update({ price: firestorePrice(lastChange.before) });
      setItems((current) =>
        current.map((item) =>
          item.id === lastChange.item.id
            ? { ...item, price: lastChange.before }
            : item
        )
      );
      setLastChange(null);
    } catch (error) {
      setSaveError("Undo did not work. Check the connection and try again.");
    } finally {
      setUndoing(false);
    }
  }

  return (
    <div className="price-admin-app">
      <header className="price-admin-header">
        <div className="price-admin-header-inner">
          <a href="/" className="price-admin-brand" aria-label="Back to Order Desk">
            <img src={logo} alt="" width="42" height="42" />
            <span>
              <strong>Menu prices</strong>
              <small>Best Panda</small>
            </span>
          </a>
          <a href="/" className="back-to-orders">Order Desk</a>
        </div>
      </header>

      <main className="price-admin-main">
        <section className="price-admin-intro">
          <p className="staff-kicker">Price manager</p>
          <h1>Tap a dish to change its price</h1>
          <p>Every saved change goes live in Firestore immediately.</p>
        </section>

        <div className="price-admin-controls">
          <label className="price-admin-search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search dishes</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dishes"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                ×
              </button>
            )}
          </label>

          <div className="price-category-tabs" aria-label="Menu categories">
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
        </div>

        {loading && (
          <div className="price-admin-message" role="status">
            <span className="loading-spinner" />
            <strong>Loading current prices…</strong>
          </div>
        )}

        {loadError && (
          <div className="price-admin-message price-admin-error" role="alert">
            <strong>Menu unavailable</strong>
            <p>{loadError}</p>
            <button type="button" onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}

        {!loading && !loadError && (
          <>
            <p className="price-result-count">
              <strong>{visibleItems.length}</strong> dishes
              {activeCategory !== "All" && <> in {activeCategory}</>}
            </p>
            <div className="price-admin-list">
              {visibleItems.map((item) => (
                <button
                  type="button"
                  className="price-row"
                  key={item.id}
                  onClick={() => openEditor(item)}
                  aria-label={`Edit ${item.name}, currently ${formatCurrency(item.price)}`}
                >
                  <span className="price-row-copy">
                    <small>{item.category}</small>
                    <strong>{item.name}</strong>
                  </span>
                  <span className="price-row-value">
                    <strong>{formatCurrency(item.price)}</strong>
                    <small>Edit</small>
                  </span>
                </button>
              ))}
            </div>
            {!visibleItems.length && (
              <div className="price-admin-message">
                <strong>No matching dishes</strong>
                <p>Try a different name or category.</p>
              </div>
            )}
          </>
        )}
      </main>

      {editingItem && (
        <>
          <button
            type="button"
            className="price-editor-backdrop"
            aria-label="Close price editor"
            onClick={closeEditor}
          />
          <form
            className="price-editor-sheet"
            onSubmit={savePrice}
            role="dialog"
            aria-modal="true"
            aria-labelledby="price-editor-title"
          >
            <div className="price-editor-handle" aria-hidden="true" />
            <div className="price-editor-heading">
              <span>
                <small>{editingItem.category}</small>
                <strong id="price-editor-title">{editingItem.name}</strong>
              </span>
              <button type="button" onClick={closeEditor} aria-label="Close price editor">×</button>
            </div>

            <p className="current-price-label">
              Current price <strong>{formatCurrency(editingItem.price)}</strong>
            </p>
            <label className="price-editor-input">
              <span>$</span>
              <input
                ref={priceInputRef}
                type="number"
                min="0.01"
                max="999.99"
                step="0.01"
                inputMode="decimal"
                value={draftPrice}
                onChange={(event) => setDraftPrice(event.target.value)}
                aria-label={`New price for ${editingItem.name}`}
              />
            </label>
            {saveError && <p className="price-save-error" role="alert">{saveError}</p>}
            <button type="submit" className="save-price-button" disabled={saving}>
              {saving ? "Saving…" : `Save ${formatCurrency(parsePrice(draftPrice))}`}
            </button>
          </form>
        </>
      )}

      {lastChange && !editingItem && (
        <div className="price-save-toast" role="status">
          <span>
            <strong>Price saved</strong>
            {lastChange.item.name} is now {formatCurrency(lastChange.after)}
          </span>
          <button type="button" onClick={undoLastChange} disabled={undoing}>
            {undoing ? "Undoing…" : "Undo"}
          </button>
        </div>
      )}

      {saveError && !editingItem && (
        <div className="price-error-toast" role="alert">{saveError}</div>
      )}
    </div>
  );
}
