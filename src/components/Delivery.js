import React, { Component } from "react";
import GrubHub from "./grubhub-logo.png";
import DoorDash from "./doordash-logo.png";
import "../styles.css";
import { Link } from "react-router-dom";
export default class Delivery extends Component {
  render() {
    return (
      <div>
        <section id="contact" className="contact">
          <div className="container p-5 mb-4 bg-light rounded-3 text-center">
            <h1 className="display-5 fw-bold">Order for Pickup/Delivery</h1>
            <p className="fs-4">
              Note: We do not deliver ourselves. Please order through GrubHub or
              Doordash.
            </p>
            <div className="d-flex justify-content-center">
              <Link
                className="bg-dark mb-5"
                to="/menu"
                style={{ padding: 0, width: "max-content", height: "3rem" }}
              >
                <button
                  className="btn btn-warning btn-lg mb-5 menu-btn"
                  type="button"
                >
                  Menu
                </button>
              </Link>
            </div>

            <div className="row">

              {/* Phone div */}
              <div className="col-md-6">
                <div className="box text-center">
                  <span>Phone</span>
                  <h4 className="card-title text-center">
                    <a href="tel:8476620066">Line 1: (847) 662-0066</a>
                  </h4>
                  <h4 className="card-title  pt-3">
                    {" "}
                    <a href="tel:8476620108">Line 2: (847) 662-0108</a>
                  </h4>
                  <h5 className="card-title pt-4">
                    Call Line 2 if Line 1 does not work
                  </h5>
                </div>
              </div>

              {/* Doordash div */}
              <div className="col-md-6 mt-lg-0">
                <div className="box text-center">
                  <span>DoorDash</span>
                  <img
                    src={DoorDash}
                    alt="Logo"
                    width="50%"
                    height="40%"
                    className="d-inline-block align-text-top"
                  />
                  <Link
                    to={{
                      pathname:
                        "https://www.doordash.com/store/best-panda-chinese-restaurant-gurnee-757771/",
                    }}
                    target="DoorDash"
                  >
                    <button
                      type="button"
                      className="w-100 btn btn-lg btn-dark mt-3 delivery-btn"
                    >
                      Click for DoorDash
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
