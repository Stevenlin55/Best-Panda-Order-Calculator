import React, { Component } from "react";
import $ from "jquery";
import "../styles.css";
export default class Hours extends Component {
  componentDidMount() {
    $(document).ready(function () {
      $(".opening-hours li").eq(new Date().getDay()).addClass("today");
    });
  }

  render() {
    return (
      <div className="col-md-6">
        <div className="h-100 p-5 bg-light border rounded-3">
          <h2>Hours</h2>
          <p style={{ color: "#f8f9fa" }}>Subject to change</p>

       
          <div
            className="business-hours bg-dark mx-auto"
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "21px 21px 21px 21px",
            }}
          >
            <ul className="list-unstyled opening-hours">
              <li>
                Sunday <span className="pull-right">12:00PM — 9:00PM</span>
              </li>
              <li>
                Monday <span className="pull-right">Closed</span>
              </li>
              <li>
                Tuesday <span className="pull-right">11:30AM — 9:00PM</span>
              </li>
              <li>
                Wednesday <span className="pull-right">11:30AM — 9:00PM</span>
              </li>
              <li>
                Thursday <span className="pull-right">11:30AM — 9:00PM</span>
              </li>
              <li>
                Friday <span className="pull-right">11:30AM — 9:30PM</span>
              </li>
              <li>
                Saturday <span className="pull-right">11:30AM — 9:30PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
