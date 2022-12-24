import React, { Component } from "react";
import { ArrowDownSquare, ArrowUpSquare } from "react-bootstrap-icons";

export default class QuantityInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
    };
  }

  // when the menu loads for first time, make all items' quantity 0, unless there is a saved order with quantity
  // if we are on ViewOrder page, the quantity will be set to the quantity of the item instead
  componentDidMount() {
    if (this.props.item.quantity) {
      this.setState({ quantity: this.props.item.quantity });
    } else {
      // check if session storage has a saved order
      if (sessionStorage.getItem("savedOrder")) {
        let savedOrder = JSON.parse(sessionStorage.getItem("savedOrder"));
        // if the saved order has the same item, set the quantity to the saved order's quantity
        for (let i = 0; i < savedOrder.length; i++) {
          if (savedOrder[i].name === this.props.item.name) {
            this.setState({ quantity: savedOrder[i].quantity });
          }
        }
      } else {
        this.setState({ quantity: 0 });
      }
    }
  }

  // before the page unmounts, update the quantity of all items in parent component
  componentWillUnmount() {
    this.props.item.quantity = this.state.quantity;
  }

  handleQuantityChange = (event) => {
    this.setState({ quantity: event.target.value });
    if (this.props.updateItemQuantity) {
      this.props.updateItemQuantity(this.props.item, event.target.value);
      this.props.updateSubtotalTaxTotal();
    }
    // take care of the case where there is a savedOrder in sessionStorage 
    if (sessionStorage.getItem("savedOrder")) {
      let savedOrder = JSON.parse(sessionStorage.getItem("savedOrder"));
      for (let i = 0; i < savedOrder.length; i++) {
        if (savedOrder[i].name === this.props.item.name) {
          savedOrder[i].quantity = event.target.value;
          sessionStorage.setItem("savedOrder", JSON.stringify(savedOrder));
        }
      }
    }

    // take care of the case where there is a currentOrder in sessionStorage
    if (sessionStorage.getItem("currentOrder")) {
      let currentOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i].name === this.props.item.name) {
          currentOrder[i].quantity = event.target.value;
          sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
        }
      }
    } else {
      let currentOrder = [];
      currentOrder.push({
        name: this.props.item.name,
        price: this.props.item.price,
        quantity: event.target.value,
      });
      sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
    }
  };

  increaseQuantity = () => {
    this.setState({ quantity: this.state.quantity + 1 });

    // if we are on ViewOrder page, update the total
    if (this.props.updateItemQuantity) {
      this.props.updateItemQuantity(this.props.item, this.state.quantity + 1);
      this.props.updateSubtotalTaxTotal();
    }

    // take care of the case where there is a savedOrder in sessionStorage
    // if the saved order does not have the same item, add the item to the saved order and set its quantity to 1
    if (sessionStorage.getItem("savedOrder")) {
      let savedOrder = JSON.parse(sessionStorage.getItem("savedOrder"));
      let found = false;
      for (let i = 0; i < savedOrder.length; i++) {
        if (savedOrder[i].name === this.props.item.name) {
          savedOrder[i].quantity = this.state.quantity + 1;
          sessionStorage.setItem("savedOrder", JSON.stringify(savedOrder));
          found = true;
        }
      }
      if (!found) {
        savedOrder.push({
          name: this.props.item.name,
          price: this.props.item.price,
          quantity: 1,
        });
        sessionStorage.setItem("savedOrder", JSON.stringify(savedOrder));
      }
    }

    // take care of the case where there is a currentOrder in sessionStorage
    // if the current order does not have the same item, add the item to the current order and set its quantity to 1
    if (sessionStorage.getItem("currentOrder")) {
      let currentOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
      let found = false;
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i].name === this.props.item.name) {
          currentOrder[i].quantity = this.state.quantity + 1;
          sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
          found = true;
        }
      }
      if (!found) {
        currentOrder.push({
          name: this.props.item.name,
          price: this.props.item.price,
          quantity: 1,
        });
        sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
      }
    } else {
      let currentOrder = [];
      currentOrder.push({
        name: this.props.item.name,
        price: this.props.item.price,
        quantity: 1,
      });
      sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
    }
  };

  decreaseQuantity = () => {
    if (this.state.quantity > 0) {
      this.setState({ quantity: this.state.quantity - 1 });
    }

    // if we are on ViewOrder page, update the total
    if (this.props.updateItemQuantity) {
      if (this.state.quantity > 0) {
        this.props.updateItemQuantity(this.props.item, this.state.quantity - 1);
        this.props.updateSubtotalTaxTotal();
      }
    }

    // take care of the case where there is a savedOrder in sessionStorage. 
    // if the quantity of a saved item is 0, remove the item from the saved order
    if (sessionStorage.getItem("savedOrder")) {
      let savedOrder = JSON.parse(sessionStorage.getItem("savedOrder"));
      for (let i = 0; i < savedOrder.length; i++) {
        if (savedOrder[i].name === this.props.item.name) {
          if (this.state.quantity > 0) {
            savedOrder[i].quantity = this.state.quantity - 1;
            sessionStorage.setItem("savedOrder", JSON.stringify(savedOrder));
            if (savedOrder[i].quantity === 0) {
              savedOrder.splice(i, 1);
              sessionStorage.setItem("savedOrder", JSON.stringify(savedOrder));
            }
          } 
        }
      }
    }

    // take care of the case where there is a currentOrder in sessionStorage.
    // if the quantity of a current item is 0, remove the item from the current order
    if (sessionStorage.getItem("currentOrder")) {
      let currentOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i].name === this.props.item.name) {
          if (this.state.quantity > 0) {
            currentOrder[i].quantity = this.state.quantity - 1;
            sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
            if (currentOrder[i].quantity === 0) {
              currentOrder.splice(i, 1);
              sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
            }
          } 
        }
      }
    } else {
      let currentOrder = [];
      currentOrder.push({
        name: this.props.item.name,
        price: this.props.item.price,
        quantity: 0,
      });
      sessionStorage.setItem("currentOrder", JSON.stringify(currentOrder));
    }
  };

  render() {
    return (
      <div className="quantity d-flex justify-content-end align-items-center mx-1">
        <ArrowDownSquare
          className="down-arrow"
          onClick={this.decreaseQuantity}
        />
        <input
          type="number"
          className="form-control quantity-input"
          value={this.state.quantity}
          onChange={this.handleQuantityChange}
        />
        <ArrowUpSquare className="up-arrow" onClick={this.increaseQuantity} />
      </div>
    );
  }
}
