import React, { Component } from "react";
import firebase from "./firebase";

// this component adds the show ID to a specific user list

class AddToList extends Component {
    constructor() {
        super();
        this.state = {
            dbReturn: []
        }
    }
    componentDidMount = () => {
        const dbRef = firebase.database().ref()
        dbRef.on('value', (snapshot) => {
            const dbArray = []
            const dbReturn = snapshot.val()
            for (let objEntry in dbReturn) {

                if (objEntry.length > 14) {
                    dbArray.push({ key: objEntry, name: dbReturn[objEntry] })
                }
            }
            this.setState({
                dbReturn: dbArray
            })
        })
    }
    setNewShow = (event) => {
        event.preventDefault()
        const dbRef = firebase.database().ref()
        const path = event.target.getAttribute('path')
        const showID = event.target.getAttribute('showid')
        dbRef.child(path).child("shows").child(`${showID}`).update({ counter: 0 })
    }

    render() {
        return (
            <div className="firebase-data">
                <h1>User Lists</h1>
                <ul>
                    {this.state.dbReturn.map((entry) => {
                        return (
                            <button key={entry.key} path={entry.key} showid={(parseInt(this.props.id))}
                                onClick={this.setNewShow}
                                className="addToListBtn">
                                Add to {entry.name.listName}
                            </button>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default AddToList;
