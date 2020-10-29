import React, { Component } from "react";
import firebase from "./firebase";

// this component adds the show ID to a specific user list

class AddToList extends Component {
  constructor() {
    super();
    this.state = {
      dbReturn: []
    }
  }

  componentDidMount = () => {
    const dbRef = firebase.database().ref()

    dbRef.on('value', (snapshot) => {
      const dbArray = []
      const dbReturn = snapshot.val()
    })

    //console.log(firebase.database().ref().once('value').then((snapshot)=>{console.log(snapshot.val())}))
  }

  setNewShow = (event) => {
    event.preventDefault()
    const dbRef = firebase.database().ref()
    const path = event.target.getAttribute('path')
    const showID = event.target.getAttribute('showid')
    dbRef.child(path).child("shows").child(`${showID}`).update({ counter: 0 })
  }

  render() {
    return (
      <div className="firebase-data">
        <button>this will add to a list</button> 
      </div>
    )
  }
}

export default AddToList;