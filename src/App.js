import React from "react";
import Menu from "./components/Menu";
import MenuAdmin from "./components/MenuAdmin";
import "./styles.css";

export default function App() {
  if (window.location.pathname.startsWith("/admin/menu")) {
    return <MenuAdmin />;
  }

  return <Menu />;
}
