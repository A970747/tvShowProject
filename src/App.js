import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ShowGenerator from "./ShowGenerator";
import TvShowCard from "./TvShowCard";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Auth from "./Auth";
import "firebase/auth";
import "./styles/styles.scss";
import UserList from "./UserList";
import { AuthProvider } from "./AuthContext";


class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <AuthProvider>
            <header>
              <h1 className="mainTitle"> showsearch</h1>
              <SignIn />
            </header>
            <Route path="/Auth" component={Auth} />
            <Route path="/SignUp" component={SignUp} />
          </AuthProvider>
          <Route exact path="/" component={ShowGenerator} />
          <Route path="/show/:id" component={TvShowCard} />
          <Route path="/list/:listid" component={UserList} />
        </div>
      </Router>
    );
  }
}

export default App;
