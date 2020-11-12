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
      if(user) setUser(user.displayName);
    });
  }

  userSignOut = async (setUser) => {
    await firebase.auth().signOut();
    setUser(null);
  }

  render() {
    const { user, setUser } = this.context

    return (
      <div>
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
                  onClick={() => { this.userSignOut(setUser);}}>
                  Sign-Out
                </button>
              </div>
        }
      </div>
    );
  }
}

export default SignIn;