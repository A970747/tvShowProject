import React, { Component } from "react";
import firebase from "./firebase";
import "firebase/auth";
import { Link, Redirect } from "react-router-dom";
import AuthContext from "./AuthContext";

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      email: null,
      password: null,
      redirect: false
    };
  }

  static contextType = AuthContext;

  googleSignIn = (setUser) => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().useDeviceLanguage();

    firebase.auth().signInWithPopup(provider)
    .then(() => this.checkAuthChange(setUser))
    .catch(function(error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;
    });
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

  userSignIn = (setUser) => {
    firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
    .then(() => this.checkAuthChange(setUser))
    .catch(function(error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
    })
  }

  checkAuthChange = (setUser) => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user.displayName);
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
        password: null
      })
      return <Redirect to="/" />
    }
  }

  render() {
    const { setUser } = this.context;
    return (
      <div className="signIn">
        {this.ifSignedIn()} 
        <div className="authGrid">
          <form action="">
          <label for="useremail">User E-mail:</label>
          <input type="email" id="useremail" name="useremail" value={this.state.email} onChange={this.handleUserEmail} required/>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" minlength="8" value={this.state.password} onChange={this.handleUserPassword} required />     
          <button type="submit" value="Sign in" 
            onClick={
              (event) => {
                event.preventDefault();
                this.userSignIn(setUser)
              }
            }>
            Sign-In 
          </button>
          </form>
          <p>New here?
            <Link to={`/SignUp`}>
              <a> Sign up!</a>
            </Link>
          </p>
        </div>
        <div>
          <button onClick={()=>this.googleSignIn(setUser)}>Sign In With Google</button>
        </div>
      </div>
    );
  }
}

export default SignIn;