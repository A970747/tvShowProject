import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ShowGenerator from "./ShowGenerator";
import TvShowCard from "./TvShowCard";
import Auth from "./Auth";
//import firebase from "./firebase";
import "firebase/auth";
import "./styles/styles.scss";
import UserList from "./UserList";

//const provider = new firebase.auth.GoogleAuthProvider();
//const auth = firebase.auth();

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }
  }

  setUserStatus = (status) => {

  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <header>
            <h1 className="mainTitle"> showsearch</h1>
          </header>
          <Route exact path="/" component={ () => <ShowGenerator user={this.state.user} setUserStatus={this.setUserStatus}/>}/>
          <Route path="/show/:id" component={TvShowCard} />
          <Route path="/list/:listid" component={UserList} />
          <Route path="/Auth" component={Auth} />
        </div>
      </Router>
    );
  }
}

export default App;
