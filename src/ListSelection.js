import React, { Component } from "react";
import firebase from "./firebase";
import { Link } from "react-router-dom";
import "firebase/auth";

class ListSelection extends Component {
  constructor() {
    super();
    this.state = {
      userLists: [],
      listName: "",
      user: null,
      showList: false
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
            userLists,
            user
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

  listNameHandler = (event) => {
    this.setState({
      listName: event.target.value
    })
  }

  createList = (event) => {
    event.preventDefault();
    if(this.state.listName !== ""){
      (!this.state.userLists.includes(this.state.listName))
        ? firebase.database().ref().child(firebase.auth().currentUser.uid).update({[this.state.listName]: 0})
        : alert("List with that name already exists")

      this.setState({
        showList: false,
        listName: ""
      })
    }
    else {
      alert("List name required");
    }
  }

  removeList(list) {
    const user = firebase.auth().currentUser.uid;
    const userInfo = firebase.database().ref().child(user);
    userInfo.child(list).remove();

    userInfo.on("value", (snapshot) => {
      (snapshot.val() !== null) 
        ? this.setState({ userLists: Object.keys(snapshot.val()) })
        : this.setState({ userLists: [] })
    });
  }

  render() {
    return (
      <div className="userListContainer">
        {
          (this.props.user)
          ? <h2>User Lists</h2>
          : <></>  
        }
        {
        (this.props.user && !this.state.showList) 
        ? <button onClick={() => this.setState({showList: true})} 
          className="clearButton" >
          Create New List </button>
        : null
        }
        {
        (this.state.showList) 
        ? <div className="userListContainer">
            <form>
              <label for="listName" className="languageContainer sr-only">Create User List</label>
              <input id="listName" 
                type="text" placeholder="enter list name" 
                value={this.state.listName} onChange={this.listNameHandler} required/>
              <button className="clearButton" type="submit" onClick={this.createList}> Create</button>
            </form>
          </div>
        : null
        }    
        <ul>
          {this.state.userLists.map((list) => {
            return (
              <li key={list}>
                <Link to={{
                  pathname:`/list/${list}`,
                  listID: list
                  }}>
                <p>{list}</p>
                </Link>
                <button
                  aria-label={`delete ${list} list`}
                  className="listDelete"
                  onClick={() => {
                    this.removeList(list);
                  }}
                >X</button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default ListSelection;