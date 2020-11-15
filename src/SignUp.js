import React, { Component } from "react";
import firebase from "./firebase";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import AuthContext from "./AuthContext";

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      email: null,
      password: null,
      confirmPassword: null,
      redirect: false
    };
  }

  static contextType = AuthContext;

  createUser = (e, setUser) => {
    e.preventDefault();
    if( this.state.email && this.state.password === this.state.confirmPassword) {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then( () => {
        this.updateUserDisplayName(setUser)
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
      });
    }
    else {
      alert(`Passwords do not match`)
    }
  }

  updateUserDisplayName = (setUser) => {
    setUser(this.state.user);
    firebase.auth().currentUser.updateProfile({
      displayName: this.state.user
    }).then(() => this.checkAuthChange())
  }

  checkAuthChange = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          redirect: true
        })
      }
    })
  }

  ifSignedIn = () => {
    if(this.state.redirect) {
      this.setState({
        password: null,
        confirmPassword: null
      })
      return <Redirect to="/" />
    }
  }

  handleUserName = (e) => {
    this.setState({
      user: e.target.value
    })
  }

  handleUserEmail = (e) => {
    this.setState({
      email: e.target.value
    })
  }

  handleUserPassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  handleConfirmPassword = (e) => {
    this.setState({
      confirmPassword: e.target.value
    })
  }

  render() {
    const { setUser } = this.context;
    return (
      <div className="signIn">
        {this.ifSignedIn()} 
        <form className="authGrid" action="">
          <label for="username">User Name:</label>
          <input type="text" id="username" name="useremail" value={this.state.user} onChange={this.handleUserName} required />
          <label for="useremail">E-mail:</label>
          <input type="email" id="useremail" name="useremail"
            //pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            value={this.state.email} onChange={this.handleUserEmail} required />
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" minlength="8"
            value={this.state.password} onChange={this.handleUserPassword} required />
          <label for="confirmpassword">Confirm Password:</label>
          <input type="password" id="confirmpassword" name="password" minlength="8"
            value={this.state.confirmPassword} onChange={this.handleConfirmPassword} required />
          <button type="submit" value="Sign in" onClick={(e)=>this.createUser(e,setUser)}>Submit </button>
        </form>
      </div>
    );
  }
}

export default SignUp;