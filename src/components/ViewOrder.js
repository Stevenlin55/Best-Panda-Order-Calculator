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
      stringTax: ""
    };
  }

  componentDidMount() {
    let items = [];
    let categories = this.props.location.state.categories;

    // go through each category and add individual items to the state if they have a quantity greater than 0
    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].items.length; j++) {
        if (categories[i].items[j].quantity > 0) {
          items.push(categories[i].items[j]);
        }
      }
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
      stringTax: stringTax
    });
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
    console.log(numericalSubtotal);
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
      stringTax: stringTax
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
    console.log("price", price);
    // add the price to the total and keep it to 2 decimal places
    let numericalSubtotal = parseFloat(this.state.numericalSubtotal) + price;
    // get rid of the added 0 before the decimal
    numericalSubtotal = parseFloat(numericalSubtotal).toFixed(2);
    // convert the total to a string with a dollar sign
    console.log("numerical", numericalSubtotal);
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

    // clear the input
    document.getElementById("add").value = "";

    this.setState({
      items: items,
      numericalSubtotal: numericalSubtotal,
      stringSubtotal: stringSubtotal,
      numericalTotal: numericalTotal,
      stringTotal: stringTotal,
      tax: tax,
      stringTax: stringTax
    });

  };

  removeItemFromState = (item, index) => {
    // remove the arbitrary price from the total
    let priceToRemove = item.price * item.quantity;
    let numericalSubtotal = parseFloat(this.state.numericalSubtotal) - priceToRemove;
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

    this.setState({
      items: items,
      numericalSubtotal: numericalSubtotal,
      stringSubtotal: stringSubtotal,
      numericalTotal: numericalTotal,
      stringTotal: stringTotal,
      tax: tax,
      stringTax: stringTax
    });
    
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
        </div>
      );
    }
    // return a list of items with their quantity and price
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <table>
                <tbody>
                    {/* map items and index to an li if only the name is not "Extra". If it is, just show the price */}
                  {this.state.items.map((item, index) => {
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
                              updateSubtotalTaxTotal={this.updateSubtotalTaxTotal}
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
                  })}
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
              <h5 className="price-values" id="total-price">{this.state.stringTotal}</h5>
            </div>
          </div>
        </div>
        
           
        <div className="row">
          <div className="col-12">
            <Link
              to={{
                pathname: "/",
              }}
              className="btn btn-success btn-block"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ViewOrder);
