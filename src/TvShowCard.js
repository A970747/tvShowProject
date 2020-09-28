import React, { Component } from "react";
import axios from "axios";
import AddToList from "./AddToList";

class TvShowCard extends Component {
  constructor() {
    super();
    this.state = {
      apiData: [],
    };
  }
  componentDidMount() {
    axios({
      url: "https://api.tvmaze.com/shows/" + this.props.match.params.id,
    }).then((response) => {
      this.setState({
        apiData: response.data,
      });
    });
  }
  render() {
    const data = this.state.apiData;
    return (
      <>
        <div className="tvShowCard">
          <div className="showCardContent">
            <h1 className="showTitle">{data.name}</h1>
            <ul>
              <li>{data.network && data.network.name}</li>
              <li>{data.country}</li>
              <li>{data.genres}</li>
              <li>
                {data.summary && data.summary.replace(/(<([^>]+)>)/gi, "")}
              </li>
            </ul>
          </div>

          <img
            src={data?.image && data?.image?.medium}
            alt={data.name}
            className="tvShowCardImg"
          />
        </div>

        <div className="listBtns">
          <AddToList id={this.props.match.params.id} />
        </div>
      </>
    );
  }
}

export default TvShowCard;
