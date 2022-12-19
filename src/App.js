import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";
import Header from "./components/Header.js";
import Menu from "./components/Menu";
import ViewOrder from "./components/ViewOrder";
import "./styles.css";

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Header />
          <div className="container body">
            <Route path="/" exact component={Menu} />
            <Route path="/view-order" exact component={ViewOrder} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
