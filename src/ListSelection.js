import React, { Component } from "react";
import firebase from "./firebase";
import { Link } from "react-router-dom";
import "firebase/auth";

class ListSelection extends Component {
  constructor() {
    super();
    this.state = {
      userLists: [],
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userID = user.uid;
        const userInfo = firebase.database().ref().child(userID);
        userInfo.on("value", (snapshot) => {
          if (snapshot.val() != null) {
          const userLists = Object.keys(snapshot.val());
    
          this.setState({
            userLists
          })
        }
        });
      }
      else {
        this.setState({
          userLists: []
        })
      }
    })
  };

  showKeys() {
      const user = firebase.auth().currentUser.uid;
      const userInfo = firebase.database().ref().child(user);
      userInfo.on("value", (snapshot) => {
        let userLists = Object.keys(snapshot.val())

        this.setState({
          userLists
        })
      })
  }

  removeList(userList) {
    const user = firebase.auth().currentUser.uid;
    const userInfo = firebase.database().ref().child(user).child(userList);
    userInfo.remove();
  }

  render() {

    return (
      <div className="firebase-data">
        <h1>User Lists</h1>
        <ul>
          {this.state.userLists.map((list) => {
            return (
              <li key={list}>
                <Link to={`/list/${list}`}>
                <p>{list}</p>
                </Link>
                <button
                  className="listDelete"
                  onClick={() => {
                    this.removeList(list);
                  }}
                >X
                </button>
              </li>
            );
          })}
        </ul>
        <button
          className="listDelete"
          onClick={() => {
            this.showKeys();
          }}
        >keys
        </button>
      </div>
    );
  }
}

export default ListSelection;
