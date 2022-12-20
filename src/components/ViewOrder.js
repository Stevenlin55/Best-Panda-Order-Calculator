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
      numericalTotal: 0,
      stringTotal: "",
      loading: true,
      arbitraryPrice: 0,
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

    // calculate the total
    let numericalTotal = this.calculateTotal(items);

    // convert the total to a string with a dollar sign
    let stringTotal = "$" + numericalTotal;
    console.log(stringTotal);
    this.setState({
      items: items,
      numericalTotal: numericalTotal,
      stringTotal: stringTotal,
      loading: false,
    });
  }

  calculateTotal(items) {
    let total = 0;
    // keep total to 2 decimal places
    for (let i = 0; i < items.length; i++) {
      total += items[i].price * items[i].quantity;
    }
    total = total.toFixed(2);
    return total;
  }

  updateTotal = () => {
    // go through the items and calculate the total
    let numericalTotal = this.calculateTotal(this.state.items);
    console.log(numericalTotal);
    let stringTotal = "$" + numericalTotal;

    this.setState({ numericalTotal: numericalTotal, stringTotal: stringTotal });
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
    let numericalTotal = parseFloat(this.state.numericalTotal) + price;
    // get rid of the added 0 before the decimal
    numericalTotal = parseFloat(numericalTotal).toFixed(2);
    // convert the total to a string with a dollar sign
    console.log("numerical", numericalTotal);
    let stringTotal = "$" + numericalTotal;

    // add the arbitrary price as an item to the state
    let items = this.state.items;
    items.push({ name: "Extra", price: price, quantity: 1 });

    // clear the input
    document.getElementById("add").value = "";

    this.setState({
      items: items,
      numericalTotal: numericalTotal,
      stringTotal: stringTotal,
    });
  };

  removeItemFromState = (item, index) => {
    // remove the arbitrary price from the total
    let numericalTotal = parseFloat(this.state.numericalTotal) - item.price;
    // get rid of the added 0 before the decimal
    numericalTotal = parseFloat(numericalTotal).toFixed(2);
    // convert the total to a string with a dollar sign
    let stringTotal = "$" + numericalTotal;
    // remove the arbitrary price from the state
    let items = this.state.items;
    items.splice(index, 1);
    this.setState({
      items: items,
      numericalTotal: numericalTotal,
      stringTotal: stringTotal,
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
              <ul className="list-group mb-2">
                {/* map items and index to an li if only the name is not "Extra". If it is, just show the price */}
                {this.state.items.map((item, index) => {
                  if (item.name !== "Extra") {
                    return (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={index}
                      >
                        {item.name}
                        <QuantityInput
                          item={item}
                          updateTotal={this.updateTotal}
                          updateItemQuantity={this.updateItemQuantity}
                        />
                      </li>
                    );
                  } else {
                    return (
                      // have a trash icon that allows user to remove the arbitrary price from the total and from the state
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={index}
                      >
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.removeItemFromState(item, index);
                          }}
                        >
                          <Trash />
                        </button>
                        {item.name}
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="mr-4">${item.price}</span>
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
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
                  className="btn btn-primary"
                  onClick={this.addArbitraryPriceToTotal}
                  type="submit"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* show the total */}
        <div>
          <h1 className="text-center">Total: {this.state.stringTotal}</h1>
        </div>

        <div className="row">
          <div className="col-12">
            <Link
              to={{
                pathname: "/",
              }}
              className="btn btn-primary btn-block"
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
