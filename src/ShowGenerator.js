import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import Sidebar from "./Sidebar";
import axios from "axios";
import "./styles/styles.scss";
import NoImageAvailableLarge from "./images/noImgAvail.jpg";
import ArrowLeft from "./images/angle-left-solid.svg";
import ArrowRight from "./images/angle-double-right-solid.svg";

class ShowGenerator extends Component {
  constructor() {
    super();
    this.state = {
      searches: 0,
      displaySidebar: true,
      query: "",
      chosenFilters: {
        language: undefined,
        genres: undefined,
        status: undefined,
        network: "name",
      },
      filterArray: {},
      apiData: [],
      storedDisplay: [],
      displayArray: [],
      filterProp: [],
      page: 0,
    };
  }

  static contextType = AuthContext;

  //todo - FIX SORT
  //apiHandler handles the axios calls and returns an array of results by default
  //it will also be called anytime query is updated from the search bar, and
  // all results returned dynamically, of course.

    //when page loads, fire the api to get some results immediately
  componentDidMount() {
    this.setDefault();
  }

  async setDefault() {
    const response = await this.apiGeneral();
    const displayArray = [...this.state.displayArray];
    if(displayArray.length === 0) {
      response.forEach((each, index) => { if(index < 33) displayArray.push(each)})
    }
    let storedDisplay = displayArray;

    this.setState({
      displayArray,
      storedDisplay,
    }, () => this.updateFilters());
  }

  async apiGeneral(page = 0) {
    let response = await axios({
      url: `https://api.tvmaze.com/shows?page=${page}`,
    })
    this.makeCache(response);
    return response.data;
  }

  apiSearch() {
    let searches = {...this.state.searches} + 1
    this.setState({
      searches 
    })

    if(this.state.searches === 0) {
      const storedDisplay = [...this.state.displayArray];
      this.setState({
        storedDisplay
      })
    }

    axios({ url: `https://api.tvmaze.com/search/shows?q=${this.state.query}`})
      .then((response) => {
        this.setState({
          displayArray: response.data.map(each => each.show),
        }, () => this.updateFilters());
    });
  }

  makeCache = (data) => {
    const response = data.data;
    const idArray = this.state.apiData.map(each => { return each.id });
    const currentData = [...this.state.apiData];
    const newData = response.filter(each => { if(!(idArray.includes(each.id))) return true; });
    const apiData = currentData.concat(newData);

    this.setState({
      apiData,
    });
  }

  updateFilters = () => {
    let filterProp = [...this.state.displayArray];
    
    this.setState({
      filterProp,
    })
  }

  loadMoreResults = async () => {
    const displayLength = this.state.displayArray.length;
    const apiLength = this.state.apiData.length;
    const displayArray = [...this.state.displayArray];
    const apiData = [...this.state.apiData].slice(displayLength,displayLength + 33)
    const storedDisplay = displayArray;
    let page = this.state.page

    if (displayLength + 30 >= apiLength) {
      page += 1;
      await this.apiGeneral(page);
    }

    apiData.forEach(item => displayArray.push(item));

    this.setState({
      page,
      displayArray,
      storedDisplay,
    })
  }

  //take the input from the search bar and set the state in ShowGenerator
  //so the results can be update and will show.
  setSearch = (searchValue) => {
    this.setState(
      {
        query: searchValue,
      },() => this.apiSearch());
  };

  clearSearch = (searchValue) => {
    const displayArray = [...this.state.storedDisplay];

    this.setState(
      {
        searches: 0,
        displayArray,
      });
  }

  resetDisplay = () => {
    let displayArray = [...this.state.storedDisplay] 

    this.setState({
      displayArray,
    });
  }

  checkObject = (filterKey, filterValue, searchObject) => {
    if (Object.keys(searchObject).includes(filterKey)) {
      return this.checkValues(filterValue, searchObject[filterKey], filterKey)
    } else {
      let objectValues = Object.values(searchObject)
      objectValues.filter(value => {
        if (value) return true
      }).forEach(item => {
        if (Array.isArray(item) || Object.prototype.toString(item).slice(8, -1) === "Object")
          this.checkObject(filterKey, filterValue, item)
      })
    }
  }

  checkValues = (filterValue, filterObject, filterKey) => {
    if(this.state.chosenFilters[filterKey]) {
      let nested = this.state.chosenFilters[filterKey];
      return this.matchValue(filterValue,filterObject?.[nested])
    } 
    else if (Array.isArray(filterObject)) {
      for(let value of filterObject) {
        if(this.matchValue(filterValue, value)) return true;
      }
    } 
    else return this.matchValue(filterValue, filterObject)
  }

  matchValue = (filterValue, matchedKeyValue) => {
    if(filterValue === matchedKeyValue) return true;
    else return false;
  }

  //taking a returned array from sidebar, and filtering it so that any index
  //that doesn't have the a value in index 0 is not put into the array as it
  // doesn't have an appropriate value for the filterData function that is called
  // as it was not set by user.
  //this will fire anytime a user updates their filters, and automatically filter the
  //displayed results.
  setFilterArray = (arrayFromSidebar) => {
    let filterArray = arrayFromSidebar

    if(Object.keys(arrayFromSidebar).length !== 0) {
      this.setState({
        filterArray,
      }, () => this.filterData())
    }
    else this.resetDisplay()
    };

  filterData = () => {
    let data = [...this.state.displayArray];
    const filterObj = {...this.state.filterArray};
    for(let [key, value] of Object.entries(filterObj))  {
      data = data.filter( data => this.checkObject(key, value, data));
    }

    this.setState({
      displayArray: data,
    })
  }

  //this sorts any numerical rating that we decide to add a filter for
  // the order argument can be set to 1 or -1 to allow for reversing the order
  // returned.
  ratingSort = (order) => {
    let sortArray = [...this.state.displayArray];
    sortArray.sort((a, b) => {
      return (b.rating.average > a.rating.average ? 1 : -1) * order;
    });
    this.setState({
      displayArray: sortArray,
    });
  };

  //this sorts any name rating that we decide to add a filter for
  // the order argument can be set to 1 or -1 to allow for reversing the order
  // returned.
  nameSort = (order) => {
    let sortArray = [...this.state.displayArray];
    sortArray.sort(
      (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1) * order
    );
    this.setState({
      displayArray: sortArray,
    });
  };

  //decide which sort to fire based on the data returned.
  //this is a brute force type approach, there is probably a nicer way to implement a sort
  //that doesn't require firing different sort functions, but we couldn't do it in time.
  sortFunc = (settings) => {
    settings[0] === "name"
      ? this.nameSort(settings[1])
      : this.ratingSort(settings[1]);
  };

  toggleSidebar = () => {
    console.log(this.state.displaySidebar);
    this.setState({ displaySidebar: !this.state.displaySidebar })
  }

  render() {
    let apiLength = this.state.apiData.length
    let displayLength = this.state.displayArray.length
    const { user } = this.context

    return (
      <div>
        <div className={(this.state.displaySidebar) ? `showGeneratorContainerExpanded` : `showGeneratorContainerContracted`}>
          {
          (!this.state.displaySidebar)
          ? <div className="sidebarContracted">
              <div className="setHeight">
                <input type="image" className="expandArrow" 
                  src={ArrowRight} alt="right-pointing-arrow"
                  onClick={this.toggleSidebar}/>
              </div>
            </div>
          : <div className="sidebarExpanded">
              <div className="expandContainer">
                <input type="image" className="expandArrow" 
                  src={ArrowLeft} alt="left-pointing-arrow"
                  onClick={this.toggleSidebar}/>
              </div>
              <Sidebar
                chosenFilters={this.state.chosenFilters}
                displayArray={this.state.filterProp}
                bringItOnBack={this.setFilterArray}
                searchPass={this.setSearch}
                clearPass={this.clearSearch}
                sortPass={this.sortFunc}
                user={user}
              />
            </div>
          }
        <div className="cardDisplayContainer">
          {
            this.state.displayArray.length !== 0 
            ? (this.state.displayArray.map((each) => {
                return (
                  <div className="movieContainer">
                    <Link to={{
                      pathname:`/show/${each.id}`,
                      movieID: each
                      }}>
                      <img className="cardImg"
                        src={each?.image?.medium ?? NoImageAvailableLarge}
                        alt={each.name}
                      />
                      {
                      (each.rating.average > 0)
                      ? <h4 className="bodyCardRating">{each.rating.average}</h4>
                      : null
                      }
                      <h3 className="bodyCardTitle">{each.name}</h3>
                    </Link>
                  </div>
                );
            })) 
            : <h3>No results for combination of search and/or filters.</h3>
          }
        </div>
        { displayLength >= 30 && displayLength <= apiLength
          ? <div className="loadMoreResults">
              <button onClick={this.loadMoreResults}>Load more results</button>
            </div>
          : <></>
        }
        </div>
      </div>
    );
  }
}

export default ShowGenerator;