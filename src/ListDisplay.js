import React, { Component } from "react";
import { Link } from "react-router-dom";
import NoImageAvailableLarge from "./images/noImgAvail.jpg";
import ListSelection from "./ListSelection";
import firebase from "./firebase";
import "firebase/auth";

class ListDisplay extends Component {
	constructor() {
		super();
		this.state = {
			location: "",
			displayArray: ""
		};
	}

	componentWillMount() {
		this.setState({
			location: this.props.match.params.listid
		})
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const user = firebase.auth().currentUser.uid;
				const list = this.state.location
				const listInfo = firebase.database().ref().child(user).child(list);
				listInfo.on("value", (snapshot) => {
					if(snapshot.val() !== null){
					let displayArray = Object.values(snapshot.val());

					this.setState({
						displayArray
					})}
				})
			}
		})
	}

	render() {
		return (
			<>
				<div className="showGeneratorContainer">
					<div className="sideBarContainer">
						<ListSelection />
					</div>
					<div className="cardDisplayContainer">
						<h2>{this.state.location}</h2>
						{
							this.state.displayArray.length !== 0
								? (this.state.displayArray.map((each) => {
									return (
										<div className="movieContainer">
											{
											(each.rating.average > 0)
												? <h4 className="bodyCardRating">{each.rating.average}</h4>
												: null
											}
											<Link to={{
												pathname: `/show/${each.id}`,
												movieID: each
											}}>
												<img className="cardImg"
													src={each?.image?.medium ?? NoImageAvailableLarge}
													alt={each.name}
												/>
												<h3 className="bodyCardTitle">{each.name}</h3>
											</Link>
										</div>
									);
								}))
								: <h2>User list empty.</h2>
						}
					</div>
				</div>
			</>
		);
	}
}

export default ListDisplay;