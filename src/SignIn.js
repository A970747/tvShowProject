import React, { Component } from "react";
import firebase from "./firebase";
import "firebase/auth";
import { Link } from "react-router-dom";
import Auth from "./Auth";
import AuthContext from "./AuthContext";


class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  static contextType = AuthContext;

  componentWillMount() {
    let { user } = this.context;

    this.setState({
      user
    })
  }

/*   componentDidUpdate() {
    let { user } = this.context;
    console.log(this.context);
    if(this.state.user !== user) {
      this.setState({
        user
      })
    }
  } */

  userSignOut = async (setUser) => {
    await firebase.auth().signOut();
    setUser(null);
  }

  render() {
    const { user, setUser } = this.context
    return (
      <div className="firebase-data">
        {(user === null)
          ? <Link to={`/Auth`}>
            <button
              className="createListBtn">
              Sign-In
          </button>
          </Link>
          :
          <div className="loggedIn">
          <p>{user}</p>
          <button
            onClick={() => { 
              this.userSignOut(setUser);
            }}
            className="createListBtn">
            Sign-Out
          </button>
          </div>
        }
        {
          <>
          <button onClick={()=>setUser("mark")}> mark </button>
          <button onClick={()=>setUser(null)}> null </button>
          </>
        }
        {
          <button onClick={()=>console.log(firebase.auth().currentUser,this.context)}> context </button>
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