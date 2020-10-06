import React, { Component } from "react";

class SideBar extends Component {
  constructor() {
    super();
    this.state = {
      searchBar: "",
      filters: {},
      returnFilters: {},
      sortArray: [
        ["A-Z", "name", "1"],
        ["Z-A", "name", "-1"],
        ["Highest Rated", "rating", "1"],
        ["Lowest Rated", "rating", "-1"],
      ],
    };
  }


  createFilterArrays = (response) => {
    Array.from(Object.keys(this.props.chosenFilters)).forEach(filter => {
      this.searchTree(filter, response);
    });
  }

  searchTree = (filterValue, searchObject) => {
    if (Object.keys(searchObject).includes(filterValue)) {
      this.testUniqueValues(filterValue, searchObject[filterValue])
    }
    else {
      let objectValues = Object.values(searchObject)
      objectValues.filter(value => {
        if (value) return true;
      }).forEach(item => {
        if (Array.isArray(item) || Object.prototype.toString(item).slice(8, -1) === "Object")
          this.searchTree(filterValue, item)
      })
    }
  }

  testUniqueValues = (filterValue, searchObjectValues) => {
    if (this.props.chosenFilters[filterValue]) {
      let nested = this.props.chosenFilters[filterValue];
      this.pushUniqueValues(filterValue, searchObjectValues?.[nested])
    }
    else this.pushUniqueValues(filterValue, searchObjectValues)
  }

  pushUniqueValues = (filterValue, testValue) => {
    let filters = {...this.state.filters};
    let filVal = filters[filterValue];
    
    if(Array.isArray(testValue)) {
      testValue.forEach(each => {
        this.pushUniqueValues(filterValue, each)
      });
    } 
    else if (!(filVal.includes(testValue))) {
      filVal.push(testValue);
      filVal.sort();
    }

    this.setState({
      filters,
    });
  }

  //anytime the props change, fire the createFilters array so we always
  //have up to date options in our filters.
  componentDidUpdate(previousProps, previousState) {
    if (previousProps.displayArray !== this.props.displayArray) {
      this.updateFilters();
    }
  }

  updateFilters = () => {
    let filters = {};
    for (let x of Object.keys(this.props.chosenFilters)) {
      filters[x] = [];
    }

    this.setState({
      filters,
    }, () => this.createFilterArrays(this.props.displayArray));
  }

  //this creates and returns to ShowGenerator, the array used
  // to filter the displayed results on the main page.
  dropHandler = (event) => {
    let returnFilters = {...this.state.returnFilters};

    (event.target.value)
      ? returnFilters[event.target.name] = event.target.value
      : delete returnFilters[event.target.name]

    this.setState(
      {
        returnFilters
      }, () => this.props.bringItOnBack(this.state.returnFilters));
  };

  //takes search value and sets it on change ready to be sent back
  //for our API to use in ShowGenerator.
  searchHandler = (event) => {

    this.setState({
      searchBar: event.target.value,
    });
  };

  //pass back the sorting information to ShowGenerator.
  //it's a string with a comma that separates two values,
  //so split on the comma and return to two values we want.
  sortHandler = (event) => {
    this.props.sortPass(event.target.value.split(","));
  };

  //send back searchBar values to ShowGenerator to use.
  returnSearchValue = (event) => {
    event.preventDefault();
    this.props.searchPass(this.state.searchBar);
  };


  //todo this needs to clear the value in the searchbox, change the value in state to "" and
  // put back the old displayArray.
  clearSearch = (e) => {
    e.preventDefault();

    this.setState({
      searchBar: "",
    }, () => this.props.clearPass(this.state.searchBar));
  }

  clearFilters = (e) => {
    e.preventDefault();
    let returnFilters = {};

    this.setState({
      returnFilters
    }, () => {
      document.getElementById("selectForm").reset();
      this.props.bringItOnBack(this.state.returnFilters);
    });
  }

  render() {
    return (
      <div className="queryContainer">
        <form>
          <input
            type="text"
            id="searchBox"
            placeholder="Search"
            value={this.state.searchBar}
            onChange={this.searchHandler}
            className="searchBox"
          />
          <button className="sideBarSearchBtn" onClick={this.returnSearchValue}>
            Search
          </button>
          <button className="sideBarSearchBtn" onClick={this.clearSearch}>
            clear
          </button>
        </form>
        <form className="criteriaContainer" id="selectForm">
          {
            Object.keys(this.state.filters).map((property, index) => {
              return (
                <>
                  <label className="languageContainer">{property}</label>
                  <select id={property} name={property} onChange={this.dropHandler}>
                    <option></option>
                    {this.state.filters[property].map((each) => {
                      return <option>{each}</option>;
                    })}
                  </select>
                </>
              );
            })
          }
          <button className="sideBarSearchBtn" onClick={this.clearFilters}>
            c filters
          </button>
          <label className="sortByContainer">Sort By</label>
          <select id="sortBy" name="sortBy" onChange={this.sortHandler}>
            <option value=""></option>
            {this.state.sortArray.map((each) => {
              return <option value={[each[1], each[2]]}>{each[0]}</option>;
            })}
          </select>
        </form>
      </div>
    );
  }
}

export default SideBar;