import React, { Component } from "react";
import NoImageAvailableLarge from "./images/noImgAvail.jpg";
import firebase from "./firebase";
import "firebase/auth";

class TvShowCard extends Component {
  constructor() {
    super();
    this.state = {
      userLists: [],
      listID: ''
    };
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const user = firebase.auth().currentUser.uid;
        const userInfo = firebase.database().ref().child(user);
        userInfo.on("value", (snapshot) => {
          if (snapshot.val() !== null) this.setState({ userLists: Object.keys(snapshot.val()) })
          else this.setState({ userLists: [] })
        })
      }
    })
  }

  addShowToList = (event) => {
    event.preventDefault();
    const user = firebase.auth().currentUser.uid
    const id = this.props.location.movieID.id
    firebase.database().ref().child(user).child(this.state.listID).update({[`${id}`]: this.props.location.movieID});
  }

  setUserList = (event) => {
    this.setState({
      listID: event.target.value
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
                    <label className="languageContainer">Add show to list</label>
                    <select id="changethis" name="changethis" value={this.state.listID} onChange={this.setUserList}>
                      <option></option>
                      {this.state.userLists.map((each) => {
                        return <option>{each}</option>;
                      })}
                    </select>
                    <button type="submit" onClick={this.addShowToList}>Add</button>
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
        : null
        }
      </>
    );
  }
}

export default TvShowCard;