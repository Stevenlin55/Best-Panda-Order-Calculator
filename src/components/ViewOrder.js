import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles.css";

class ViewOrder extends Component {
  // get the items from Link state
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      numericalTotal: 0,
      stringTotal: "",
      loading: true,
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
    this.setState({ items: items, numericalTotal: numericalTotal, stringTotal: stringTotal, loading: false});
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
              <ul className="list-group">
                {this.state.items.map((item) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    {item.name}
                    <span className="badge badge-primary badge-pill">
                      {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
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
