import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ShowGenerator from "./ShowGenerator";
import TvShowCard from "./TvShowCard";
import firebase from "./firebase";
import "./styles/styles.scss";
import UserList from "./UserList";

class App extends Component {
  getListNameThenAddToDatabase = () => {
    const listName = prompt("Enter List Name");
    const dbRef = firebase.database().ref();
    const userObj = {
      listName: listName,
      shows: []
    }
    dbRef.push(userObj)
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <header>
            <h1 className="mainTitle"> PiePepper</h1>
            <button 
            onClick={this.getListNameThenAddToDatabase}
            className="createListBtn">
              Create List
            </button>
          </header>
          <Route exact path="/" component={ShowGenerator} />
          <Route path="/show/:id" component={TvShowCard} />
          <Route path="/list/:listid" component={UserList} />
        </div>
      </Router>
    );
  }
}

export default App;
