import React, { Component } from "react";
import NoImageAvailableLarge from "./images/NoImageAvailableLarge.jpg";
import firebase from "./firebase";
import "firebase/auth";

class TvShowCard extends Component {
  constructor() {
    super();
    this.state = {
      userLists: []
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const user = firebase.auth().currentUser.uid;
        const userInfo = firebase.database().ref().child(user);
        userInfo.on("value", (snapshot) => {
          let userLists = Object.keys(snapshot.val())
    
          this.setState({
            userLists
          })
        })
      }
    })
  }

  render() {
    const showInfo = this.props.location.movieID;

    return (   
      <>
        {
        (this.props.location.movieID)
        ? <>
          <div className="tvShowCard">
          <div className="showCardContent">
            <h1 className="showTitle">{showInfo.name}</h1>
            <ul>
              <li>{showInfo.network && showInfo.network.name}</li>
              <li>{showInfo.country}</li>
              <li>{showInfo.genres}</li>
              <li>
                {showInfo.summary && showInfo.summary.replace(/(<([^>]+)>)/gi, "")}
              </li>
            </ul>
          {
            (firebase.auth().currentUser)
            ? <>
                <form>
                  <label className="languageContainer">changethis</label>
                  <select id="changethis" name="changethis" onChange="">
                    <option></option>
                    {this.state.userLists.map((each) => {
                      return <option>{each}</option>;
                    })}
                  </select>
                  <button type="submit">Add to List</button>
                </form>
              </>
            : <></>
          }
          </div>

          <img
            src={showInfo?.image?.medium || NoImageAvailableLarge}
            alt={showInfo.name}
            className="tvShowCardImg"
          />

          </div>

        </>
        : <></>
        }
      </>
    );
  }
}

export default TvShowCard;
