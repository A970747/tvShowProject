import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ShowGenerator from "./ShowGenerator";
import TvShowCard from "./TvShowCard";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ListDisplay from "./ListDisplay";
import Auth from "./Auth";
import "firebase/auth";
import "./styles/styles.scss";
import { AuthProvider } from "./AuthContext";

class App extends Component {

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
          <Route path="/list/:listid" component={ListDisplay} />
        </div>
      </Router>
    );
  }
}

export default App;
