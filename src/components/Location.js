import React, { Component } from "react";

export default class Location extends Component {
  render() {
    return (
      <div className="col-md-6">
        <div className="h-100 p-5 text-white bg-dark rounded-3">
          <h2>Location</h2>
          <p>4949 Grand Ave., Suite 4A Gurnee, IL</p>

          <iframe
            title="Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d736.8962550312554!2d-87.92535887078043!3d42.372682389476196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDIyJzIxLjciTiA4N8KwNTUnMjkuMyJX!5e0!3m2!1sen!2sus!4v1625095875878!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "21px 21px 21px 21px",
            }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    );
  }
}
