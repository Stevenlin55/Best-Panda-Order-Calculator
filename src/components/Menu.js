import React, { Component } from "react";
import "../styles.css";
import Accordion from "./Accordion.js";
import db from "./firebase.js";
import { Link } from "react-router-dom";
export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [
        { name: "Appetizer" },
        { name: "Soup" },
        { name: "Chop Suey" },
        { name: "Egg Foo Young" },
        { name: "Poultry" },
        { name: "Roast Pork" },
        { name: "Shrimp" },
        { name: "Beef" },
        { name: "Vegetable" },
        { name: "Fried Rice" },
        { name: "Lo Mein" },
        { name: "Chow Mein Fun" },
        { name: "House Specialties" },
        { name: "Daily Special" },
        { name: "Lunch Menu" },
        { name: "Side Orders" },
      ],
      loading: true, //when page loads, it's going to show loading spinner
    };
  }
  componentDidMount() {
    this.fetchDataFromFirebase(); //when page loads, fetch from firebase
  }

  async fetchDataFromFirebase() {
    try {
      for (let i = 0; i < this.state.categories.length; i++) {
        //loop through all the categories
        const snapshot = await db
          .collection(this.state.categories[i].name)
          .orderBy("number")
          .get(); //get snapshot of all categories and order the items by their number
        this.state.categories[i].items = snapshot.docs.map((doc) => ({
          //update the state's categories' items from snapshot
          name: doc.id,
          price: doc.data().price,
          details: doc.data().description,
        }));
        this.setState({ loading: false }); //after fetching data, make sure to make screen not loading anymore
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    if (this.state.loading) {
      //if it's loading, show a spinner
      return (
        <div
          className="spinner-border text-success d-block m-auto"
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      );
    }

    return (
      //show the menu page if screen loads
      <div>
        <div className="container">
          <div className="row">
            {/* Accordion */}
            <div
              className="accordion mb-5"
              id="accordionPanelsStayOpenExample"
            >
              <Accordion categories={this.state.categories} />
            </div>

            {/* View Order button */}
            <div>
              <Link
                to={{
                  pathname: "/view-order",
                  state: { categories: this.state.categories }, //pass the categories to the next page
                }}
              >
                <button className="btn btn-success btn-lg fixed-bottom" id="view-order-btn">
                  View Order
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
