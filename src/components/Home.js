import React, { Component } from "react";
import Location from "./Location";
import Hours from "./Hours";
import Delivery from "./Delivery";

export default class Home extends Component {
  render() {
    return (
      <div>
        <Delivery />

        <div className="row align-items-md-stretch">
          <Location />
          <Hours />
        </div>
      </div>
    );
  }
}
