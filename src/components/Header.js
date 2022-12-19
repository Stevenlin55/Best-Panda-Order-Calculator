import React, { Component } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/js/src/collapse.js";
import logo from "./panda.png";
import "../styles.css";
export default class Header extends Component {
  // Mobile Devices: whenever link is clicked, navbar collapses
  collapseNavbar() {
    let navbar = document.getElementById("navbarSupportedContent");
    let navbarButton = document.getElementById("navbar-btn");
    navbar.className = "navbar-collapse collapse";
    navbarButton.className = "navbar-toggler collapsed";
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-success fixed-top">
          <div className="container-fluid">
            <Link
              className="navbar-brand d-flex justify-content-between align-items-center"
              to="/"
              onClick={() => this.collapseNavbar()}
            >
              <img
                src={logo}
                alt="Logo"
                width="50"
                height="52"
                className="d-inline-block"
              />
              <div className="ml-5 name">Best Panda</div>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              id="navbar-btn"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/"
                    onClick={() => this.collapseNavbar()}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/menu"
                    onClick={() => this.collapseNavbar()}
                  >
                    Menu
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
