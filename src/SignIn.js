import React, { Component } from "react";
import AuthContext from "./AuthContext";
import { Link } from "react-router-dom";
import firebase from "./firebase";
import "firebase/auth";

class SignIn extends Component {

  static contextType = AuthContext;

  componentWillMount() {
    const { setUser } = this.context

    firebase.auth().onAuthStateChanged(function (user) {  
      if (user) {
        setUser(user.displayName);
      }
      
      const dbRef = firebase.database().ref();
      dbRef.on('value', (snapshot) => {
      })

    });
  }

  userSignOut = async (setUser) => {
    await firebase.auth().signOut();
    setUser(null);
  }

  createRef = () => {
    const newNum = Math.floor(Math.random() * 1000)
    const newNum1 = Math.floor(Math.random() * 1000)
    const newNum2 = Math.floor(Math.random() * 1000)
    const newNum3 = Math.floor(Math.random() * 1000)
    firebase.database().ref().child(firebase.auth().currentUser.uid).update({[`newNum_${newNum}`]: [newNum1,newNum2,newNum3]});
    //firebase.database().ref().child(firebase.auth().currentUser.uid).child(`newNum_${newNum}`).update({[`newNum_${newNum1}`]: [new]});
    //firebase.database().ref().child(firebase.auth().currentUser.uid).child(`newNum_${newNum}`).update({[`newNum_${newNum2}`]: ''});
    //firebase.database().ref().child(firebase.auth().currentUser.uid).child(`newNum_${newNum}`).update({[`newNum_${newNum3}`]: ''});
    //firebase.database().ref().child(firebase.auth().currentUser.uid).child('thislist').set(0);
    //firebase.database().ref().child(firebase.auth().currentUser.uid).child('thislist').update({[`newNum_${newNum}`]:'new'});
    //.push(firebase.auth().currentUser.displayName)
  }

  whoLoggedIn = () => {
    console.log(firebase.auth().currentUser);
  }

  render() {
    const { user, setUser } = this.context

    return (
      <div className="firebase-data">
        {
          (user === null)
            ? <Link to={`/Auth`}>
              <button className="createListBtn">
                Sign-In
                </button>
            </Link>
            : <div className="loggedIn">
              <p>{user}</p>
              <button className="createListBtn"
                onClick={() => {
                  this.userSignOut(setUser);
                }}>
                Sign-Out
                </button>
            </div>
        }
        {
          <>
            <button onClick={() => setUser("mark")}> mark </button>
            <button onClick={() => setUser(null)}> null </button>
          </>
        }
        {
          <button onClick={() => console.log(firebase.auth().currentUser, this.context)}> context </button>
        }
        {
          <button onClick={() => this.createRef()}>Make a ref</button>
        }
        {
          <button onClick={() => this.whoLoggedIn()}>Who dis</button>
        }
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