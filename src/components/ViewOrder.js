import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import QuantityInput from "./QuantityInput";
import { Trash } from "react-bootstrap-icons";
import "../styles.css";

class ViewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      numericalSubtotal: 0,
      stringSubtotal: "",
      loading: true,
      arbitraryPrice: 0,
      numericalTotal: 0,
      stringTotal: "",
      tax: 0,
      stringTax: "",
      savedOrderBtnClicked: false,
    };
  }

  componentDidMount() {
    // if there is a saved order from sessionStorage, load it
    if (sessionStorage.getItem("savedOrder")) {
      let savedOrder = JSON.parse(sessionStorage.getItem("savedOrder"));
      // go through savedOrder and if the price is a string, then convert it to a number by removing the dollar sign
      for (let i = 0; i < savedOrder.length; i++) {
        if (typeof savedOrder[i].price === "string") {
          savedOrder[i].price = parseFloat(savedOrder[i].price.slice(1));
        }
      }

      // calculate subtotal, total, and tax of saved order
      let numericalSubtotal = this.calculateSubtotal(savedOrder);
      let stringSubtotal = "$" + numericalSubtotal;
      let numericalTotal = parseFloat(numericalSubtotal) * 1.09;
      numericalTotal = numericalTotal.toFixed(2);
      let stringTotal = "$" + numericalTotal;
      let tax = parseFloat(numericalTotal) - parseFloat(numericalSubtotal);
      tax = tax.toFixed(2);
      let stringTax = "$" + tax;

      this.setState({
        items: savedOrder,
        numericalSubtotal: numericalSubtotal,
        stringSubtotal: stringSubtotal,
        numericalTotal: numericalTotal,
        stringTotal: stringTotal,
        tax: tax,
        stringTax: stringTax,
        loading: false,
      });
    } else {
      let items = [];

      // go through items in the cart in currentOrder in sessionStorage and add them to the items array
      if (sessionStorage.getItem("currentOrder")) {
        let currentOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
        for (let i = 0; i < currentOrder.length; i++) {
          items.push(currentOrder[i]);
        }

        // go through items and convert the price from string to a number after removing the dollar sign
        for (let i = 0; i < items.length; i++) {
          items[i].price = parseFloat(items[i].price.substring(1));
        }

        // calculate the subtotal
        let numericalSubtotal = this.calculateSubtotal(items);

        // convert the total to a string with a dollar sign
        let stringSubtotal = "$" + numericalSubtotal;

        // calculate the total with 9% tax
        let numericalTotal = parseFloat(numericalSubtotal) * 1.09;
        numericalTotal = numericalTotal.toFixed(2);
        let stringTotal = "$" + numericalTotal;

        // calculate the tax by subtracting the subtotal from the total
        let tax = parseFloat(numericalTotal) - parseFloat(numericalSubtotal);
        tax = tax.toFixed(2);

        // convert the tax to a string with a dollar sign
        let stringTax = "$" + tax;

        this.setState({
          items: items,
          numericalSubtotal: numericalSubtotal,
          stringSubtotal: stringSubtotal,
          loading: false,
          numericalTotal: numericalTotal,
          stringTotal: stringTotal,
          tax: tax,
          stringTax: stringTax,
        });
      } else {
        // take the user back to the menu page if there is no current order
        this.props.history.push("/");
      }
    } 
  }

  calculateSubtotal(items) {
    let total = 0;
    // keep total to 2 decimal places
    for (let i = 0; i < items.length; i++) {
      total += items[i].price * items[i].quantity;
    }
    total = total.toFixed(2);
    return total;
  }

  updateSubtotalTaxTotal = () => {
    // go through the items and calculate the subtotal
    let numericalSubtotal = this.calculateSubtotal(this.state.items);
    let stringSubtotal = "$" + numericalSubtotal;

    // calculate the total with 9% tax
    let numericalTotal = parseFloat(numericalSubtotal) * 1.09;
    numericalTotal = numericalTotal.toFixed(2);
    let stringTotal = "$" + numericalTotal;

    // calculate the tax by subtracting the subtotal from the total
    let tax = parseFloat(numericalTotal) - parseFloat(numericalSubtotal);
    tax = tax.toFixed(2);

    // convert the tax to a string with a dollar sign
    let stringTax = "$" + tax;

    this.setState({
      numericalSubtotal: numericalSubtotal,
      stringSubtotal: stringSubtotal,
      numericalTotal: numericalTotal,
      stringTotal: stringTotal,
      tax: tax,
      stringTax: stringTax,
    });
  };

  updateItemQuantity = (item, quantity) => {
    // find the item in the state and update its quantity
    let items = this.state.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].name === item.name) {
        items[i].quantity = quantity;
      }
    }
    this.setState({ items: items });
  };

  addArbitraryPriceToTotal = (e) => {
    // prevent the page from reloading
    e.preventDefault();

    // get the value of the input named "Add"
    let price = parseFloat(this.state.arbitraryPrice);
    // convert the value to a number
    // add the price to the total and keep it to 2 decimal places
    let numericalSubtotal = parseFloat(this.state.numericalSubtotal) + price;
    // get rid of the added 0 before the decimal
    numericalSubtotal = parseFloat(numericalSubtotal).toFixed(2);
    // convert the total to a string with a dollar sign
    let stringSubtotal = "$" + numericalSubtotal;

    // calculate the total with 9% tax
    let numericalTotal = parseFloat(numericalSubtotal) * 1.09;
    numericalTotal = numericalTotal.toFixed(2);
    let stringTotal = "$" + numericalTotal;

    // calculate the tax by subtracting the subtotal from the total
    let tax = parseFloat(numericalTotal) - parseFloat(numericalSubtotal);
    tax = tax.toFixed(2);

    // convert the tax to a string with a dollar sign
    let stringTax = "$" + tax;

    // add the arbitrary price as an item to the state
    let items = this.state.items;
    items.push({ name: "Extra", price: price, quantity: 1 });
    // add the item to the currentOrder in sessionStorage
    let currentOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
    currentOrder.push({ name: "Extra", price: price, quantity: 1 });
    sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));

    // clear the input
    document.getElementById("add").value = "";

    this.setState({
      items: items,
      numericalSubtotal: numericalSubtotal,
      stringSubtotal: stringSubtotal,
      numericalTotal: numericalTotal,
      stringTotal: stringTotal,
      tax: tax,
      stringTax: stringTax,
    });
  };

  removeItemFromState = (item, index) => {
    // remove the arbitrary price from the total
    let priceToRemove = item.price * item.quantity;
    let numericalSubtotal =
      parseFloat(this.state.numericalSubtotal) - priceToRemove;
    // get rid of the added 0 before the decimal
    numericalSubtotal = parseFloat(numericalSubtotal).toFixed(2);
    // convert the total to a string with a dollar sign
    let stringSubtotal = "$" + numericalSubtotal;

    // calculate the total with 9% tax
    let numericalTotal = parseFloat(numericalSubtotal) * 1.09;
    numericalTotal = numericalTotal.toFixed(2);
    let stringTotal = "$" + numericalTotal;

    // calculate the tax by subtracting the subtotal from the total
    let tax = parseFloat(numericalTotal) - parseFloat(numericalSubtotal);
    tax = tax.toFixed(2);

    // convert the tax to a string with a dollar sign
    let stringTax = "$" + tax;

    // remove the arbitrary price from the state
    let items = this.state.items;
    items.splice(index, 1);

    // remove the item from the currentOrder in sessionStorage
    let currentOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
    currentOrder.splice(index, 1);
    sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));

    this.setState({
      items: items,
      numericalSubtotal: numericalSubtotal,
      stringSubtotal: stringSubtotal,
      numericalTotal: numericalTotal,
      stringTotal: stringTotal,
      tax: tax,
      stringTax: stringTax,
    });
  };

  saveOrder = () => {
    // add currentOrder in session storage to savedOrder in session storage
    let savedOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
    sessionStorage.setItem("savedOrder", JSON.stringify(savedOrder));

    //set the state of savedOrderBtnClicked to true
    this.setState({ savedOrderBtnClicked: true });

    // change save order button to green background color by changing class name to "btn btn-success"
    document.getElementById("saveOrderBtn").className = "btn btn-success";
    // change the text of the button to "Saved"
    document.getElementById("saveOrderBtn").innerHTML = "SAVED";
  };

  clearOrder = () => {
    // clear the session storage
    sessionStorage.clear();
    // clear the state for everything except the loading state
    this.setState({
      items: [],
      numericalSubtotal: 0,
      stringSubtotal: "$0",
      numericalTotal: 0,
      stringTotal: "$0",
      tax: 0,
      stringTax: "$0",
      arbitraryPrice: "",
      savedOrderBtnClicked: false,
    });
  };

  handleBackToMenu = () => {
    // if the user did not clcik the "Save Order" button, clear the session storage
    if (!this.state.savedOrderBtnClicked) {
      this.clearOrder();
    }
  };

  render() {
    if (this.state.loading) {
      // show loading sign
      return (
        <div
          className="spinner-border text-success d-block m-auto"
          role="status"
        >
          <span className="sr-only"></span>
          <h1> Loading</h1>
        </div>
      );
    }
    return (
      // return a list of items with their quantity and price
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <table>
                <tbody>
                  {/* first check if array exists */}
                  {/* map items and index to an li if only the name is not "Extra". If it is, just show the price */}
                  {this.state.items && this.state.items.length > 0 ? (
                    this.state.items.map((item, index) => {
                      if (item.name !== "Extra") {
                        return (
                          <tr key={index}>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  this.removeItemFromState(item, index)
                                }
                              >
                                <Trash />
                              </button>
                            </td>
                            <td className="item-name">{item.name}</td>
                            <td>
                              <QuantityInput
                                item={item}
                                updateItemQuantity={this.updateItemQuantity}
                                updateSubtotalTaxTotal={
                                  this.updateSubtotalTaxTotal
                                }
                              />
                            </td>
                          </tr>
                        );
                      } else {
                        // if the item is "Extra", just show the trash button, name, and price
                        return (
                          <tr key={index}>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  this.removeItemFromState(item, index)
                                }
                              >
                                <Trash />
                              </button>
                            </td>
                            <td className="item-name">{item.name}</td>
                            <td className="item-price">${item.price}</td>
                          </tr>
                        );
                      }
                    })
                  ) : (
                    <tr>
                      <td>No items in cart</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            {/* create input that allows user to add arbitary price to the total */}
            <form className="d-flex justify-content-between align-items-center">
              <input
                type="number"
                name="Add"
                id="add"
                className="form-control"
                onChange={(e) =>
                  this.setState({ arbitraryPrice: e.target.value })
                }
              />
              <button
                className="btn btn-success"
                onClick={this.addArbitraryPriceToTotal}
                type="submit"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* show the subtotal, tax, and total on the right side of screen and wrapped in divs with their numbers */}
        <div className="container my-4">
          <div className="row">
            {/* show the stuff on the right of screen like a receipt */}
            <div className="d-flex justify-content-end">
              <h5 id="subtotal">Subtotal</h5>
              <h5 className="price-values">{this.state.stringSubtotal}</h5>
            </div>
            <div className="d-flex justify-content-end">
              <h5 id="tax">Tax</h5>
              <h5 className="price-values">{this.state.stringTax}</h5>
            </div>
            <div className="d-flex justify-content-end">
              <h5 id="total">Total</h5>
              <h5 className="price-values" id="total-price">
                {this.state.stringTotal}
              </h5>
            </div>
            <div className="d-flex justify-content-between">
              {/* clear order button */}
              <button className="btn btn-danger" onClick={this.clearOrder}>
                CLEAR
              </button>
              <button
                // make button white with black text and black border
                className="btn btn-light btn-block text-dark border-dark"
                id="saveOrderBtn"
                onClick={this.saveOrder}
              >
                SAVE ORDER
              </button>
            </div>
            {/* back to menu button */}
            <div>
              <Link
                to="/"
                className="btn btn-primary btn-block border-dark w-100 mt-5"
                onClick={this.handleBackToMenu}
              >
                BACK TO MENU
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ViewOrder);
