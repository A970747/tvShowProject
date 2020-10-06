import React, { Component } from "react";
import firebase from "./firebase";
import { Link } from "react-router-dom";

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      dbReturn: [],
    };
  }


  render() {
    return (
      <div className="firebase-data">
        <button
          onClick={this.getListNameThenAddToDatabase}
          className="createListBtn">
          Create List
        </button>
      </div>
    );
  }
}

export default SignIn;

  // getListNameThenAddToDatabase = () => {
  //   const listName = prompt("Enter List Name");
  //   const dbRef = firebase.database().ref();
  //   const userObj = {
  //     listName,
  //     shows: []
  //   }
  //   dbRef.push(userObj)
  // }

/* <button
onClick={this.getListNameThenAddToDatabase}
className="createListBtn">
Create List
</button> */