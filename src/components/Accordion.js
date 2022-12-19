import React, { Component } from "react";
import "../styles.css";
export default class Accordion extends Component {
  renderItems(category) {
    if (category.items) {
      //if we have all the items of the categories, show the cards for each item
      return category.items.map((item, index) => (
        <div key={index} className="col-sm-6">
          <div key={index} className="card">
            <div className="card-body">
              <h5 className="card-title fw-bold">
                {item.name}
                {/* TODO: buttons for each item here */}
                <span className="pull-right fw-bold">{item.price}</span>
              </h5>
            </div>
          </div>
        </div>
      ));
    }
    return (
      //if we don't have the items, show spinners in each category
      <div className="spinner-border text-success m-auto" role="status">
        <span className="sr-only"></span>
      </div>
    );
  }
  
  render() {
    if (this.props.categories && this.props.categories[0].items) {
      return (
        <div>
          <div className="accordion" id="accordionPanelsStayOpenExample">
            {this.props.categories.map(
              (
                category,
                index //creates the accordion and uses the categories as labels for the accordion panels
              ) => (
                <div key={index} className="accordion-item">
                  <h2
                    className="accordion-header"
                    id={
                      "panelsStayOpen-headings" +
                      category.name.toString().split(" ").join("") //makes sure  every string doesn't include spaces because then accordions actually open
                    }
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={
                        "#panelsStayOpen-collapse" +
                        category.name.toString().split(" ").join("")
                      }
                      aria-expanded="false"
                      aria-controls={
                        "panelsStayOpen-collapse" +
                        category.name.toString().split(" ").join("")
                      }
                    >
                      {category.name}
                    </button>
                  </h2>
                  <div
                    id={
                      "panelsStayOpen-collapse" +
                      category.name.toString().split(" ").join("")
                    }
                    className="accordion-collapse collapse"
                    aria-labelledby={
                      "panelsStayOpen-heading" +
                      category.name.toString().split(" ").join("")
                    }
                  >
                    <div className="accordion-body">

                      <div className="row">{this.renderItems(category)}</div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="spinner-border text-success d-block m-auto"
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      );
    }
  }
}
