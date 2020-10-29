import React, { Component } from "react";
import NoImageAvailableLarge from './images/NoImageAvailableLarge.jpg'
import firebase from "./firebase";
import axios from 'axios'
class UserList extends Component {
  constructor() {
    super();
    this.state = {
      listArray: [],
      displayListInfo: {},
      displayArray: [],
      arrayWithShowIDs: [],
      sortedArray: [],
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userID = user.uid
        const userList = firebase.database().ref().child(userID).child(this.props.match.params.listid)
        userList.on('value', (snapshot) => {
          const listArray = Object.values(snapshot.val())
          console.log(listArray);
        })
      }
    })
  }

  sortArray = () => {
    const unsortedArray = []
    const unsortedObj = this.state.displayListInfo.shows
    for (let shows in unsortedObj) {
      unsortedArray.push({ showID: parseInt(shows), counter: unsortedObj[shows].counter })
    }
    const sortedArray = unsortedArray.sort(function (a, b) {
      return b.counter - a.counter
    })
    const sortedArrayWithID = sortedArray.map(x => x.showID)
    this.setState({
      arrayWithShowIDs: sortedArrayWithID
    })
  }

  counterFunc = (event) => {
    const dbRef = firebase
      .database()
      .ref(this.props.match.params.listid)
      .child("shows");
    const showID = event.target.getAttribute("showid");
    const myNum = parseInt(event.target.value);
    const origNum = this.state.displayListInfo.shows[showID].counter;
    dbRef.child(showID).update({ counter: origNum + myNum });
    this.sortArray();
  };

  //Loops through the users array of shows to get a set of tv show data.
  //We only want the shows to display when all are ready, so we store
  //the returned promises in promiseArray and use PromiseAll to fire
  //when they are all successful.

  createUserListDisplay = () => {
    let promiseArray = [];
    this.state.arrayWithShowIDs.forEach((each) => {
      promiseArray.push(axios({ url: `https://api.tvmaze.com/shows/${each}` }));
    });
    Promise.all(promiseArray).then((item) => {
      let displayArray = item.map((each) => {
        return each.data;
      });
      this.setState({
        displayArray
      });
    });
  };
  render() {
    return (
      <div>
        {
          this.state.displayArray.map((each) => {
            return (
              <>
                <div className="userListContainer">
                  <img className="userListImage" src={each.image === null ? NoImageAvailableLarge : each.image.medium} alt={each.name} />
                  <h4 className='userCardRating'>{each.rating.average}</h4>
                  <h3 className='userCardTitle'>{each.name}</h3>
                  <button onClick={this.counterFunc} showid={each.id} value={1} className="upVoteBtn"> UpVote </button>
                  <button onClick={this.counterFunc} showid={each.id} value={-1} className="downVoteBtn"> DownVote </button>
                </div>
              </>
            )
          })
        }
      </div>
    )
  }
}
export default UserList
