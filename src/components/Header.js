import React from "react";
import logo from "./panda.png";

export default function Header({ itemCount, total, onOpenOrder, onNewOrder }) {
  return (
    <header className="desk-header">
      <div className="desk-header-inner">
        <div className="desk-brand">
          <img src={logo} alt="" width="50" height="50" />
          <div>
            <strong>Best Panda</strong>
            <span>Order Desk</span>
          </div>
        </div>

        <div className="desk-status">
          <span className="save-status"><i /> Autosaved locally</span>
          <button type="button" className="header-new-order" onClick={onNewOrder}>
            New order
          </button>
          <button type="button" className="header-order-button" onClick={onOpenOrder}>
            <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
            <strong>{total}</strong>
          </button>
        </div>
      </div>
    </header>
  );
}
