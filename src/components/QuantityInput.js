import React, { Component } from "react";
import { ArrowDownSquare, ArrowUpSquare } from "react-bootstrap-icons";

export default class QuantityInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
    };
  }

  // when the menu loads for first time, make all items' quantity 0
  // if we are on ViewOrder page, the quantity will be set to the quantity of the item instead
  componentDidMount() {
    if (this.props.item.quantity) {
      this.setState({ quantity: this.props.item.quantity });
    } else {
      this.setState({ quantity: 0 });
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
      this.props.updateTotal();
    }
  };

  increaseQuantity = () => {
    this.setState({ quantity: this.state.quantity + 1 });

    // if we are on ViewOrder page, update the total
    if (this.props.updateItemQuantity) {
      this.props.updateItemQuantity(this.props.item, this.state.quantity + 1);
      this.props.updateTotal();
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
        this.props.updateTotal();
      }
    }
  };

  render() {
    return (
      <div className="quantity d-flex justify-content-end align-items-center">
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
