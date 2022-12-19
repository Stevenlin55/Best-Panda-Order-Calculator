import React, { Component } from "react";
import "../styles.css";
import Accordion from "./Accordion.js";
import db from "./firebase.js";
import chili from "./chili.png";
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
        const snapshot = await db.collection(this.state.categories[i].name).orderBy("number").get(); //get snapshot of all categories and order the items by their number
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
            <div className="col-lg-10 mx-auto col-12 text-center mb-3">
              <h1 className="mt-0 text-dark">Our Menu</h1>
              <p className="lead" style={{ color: "gray" }}>
                Pricing and availability are subject to change
              </p>
              <div className="d-flex justify-content-center align-items-center">
                <div style={{flex: 1}}></div>
                <img
                  src={chili}
                  alt="Chili"
                  width="50"
                  height="52"
                  className="d-incline-block float-left"
                  style={{marginLeft:'-20px'}}
                />{" "}
                <div style={{marginLeft:'-15px'}}>indicates hot and spicy</div>
                <div style={{flex: 1}}></div>
              </div>
            </div>

            <div className="accordion" id="accordionPanelsStayOpenExample">
              <Accordion categories={this.state.categories} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
