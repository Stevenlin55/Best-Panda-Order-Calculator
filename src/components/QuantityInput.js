import React, { Component } from "react";
import { ArrowDownSquare, ArrowUpSquare } from "react-bootstrap-icons";

export default class QuantityInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
    };
  }

  // when the page loads for first time, make all items' quantity 0
  componentDidMount() {
    this.props.item.quantity = 0;
  }

  // before the page unmounts, update the quantity of all items in parent component
  componentWillUnmount() {
    this.props.item.quantity = this.state.quantity;
  }

  handleQuantityChange = (event) => {
    this.setState({ quantity: event.target.value });
  };

  increaseQuantity = () => {
    this.setState({ quantity: this.state.quantity + 1 });
    console.log(this.props.item.name, this.state.quantity);
  };

  decreaseQuantity = () => {
    if (this.state.quantity > 0) {
      this.setState({ quantity: this.state.quantity - 1 });
      console.log(this.props.item.name, this.state.quantity);
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
