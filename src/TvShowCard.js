import React, { Component } from "react";
import NoImageAvailableLarge from "./images/noImgAvail.jpg";
import { Link } from "react-router-dom";
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

    if([null, undefined, ""].includes(this.state.listID)) {
      console.log(this.state.listID)
    }
    else {
      const user = firebase.auth().currentUser.uid
      const id = this.props.location.movieID.id
      firebase.database().ref().child(user).child(this.state.listID).update({[`${id}`]: this.props.location.movieID});
      alert(`Show added to ${this.state.listID}`)

      this.setState({
        listID: ''
      })
    }
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
                <li>{showInfo?.network?.name}</li>
                <li>{showInfo.genres.map(each=>`${each} `)}</li>
                <li>{showInfo.summary.replace(/(<([^>]+)>)/gi, "")}</li>
              </ul>
            {
              (firebase.auth().currentUser)
              ? <>
                  <form>
                    <label className="languageContainer">Add show to list </label>
                    <select id="changethis" name="changethis" value={this.state.listID} onChange={this.setUserList}>
                      <option></option>
                      {this.state.userLists.map((each) => {
                        return <option>{each}</option>;
                      })}
                    </select>
                    <button className="addButton" type="submit" onClick={this.addShowToList}>Add</button>
                  </form>
                </>
              : <></>
            }
            <Link to="/">
              <button className="backButton">back</button>
            </Link>
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