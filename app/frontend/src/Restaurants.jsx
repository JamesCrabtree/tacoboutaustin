import React, { Component } from 'react';
import search from './assets/search.png';
import './App.css';
import RestaurantCard from './RestaurantCard';
import RestaurantFilter from './RestaurantFilter';
import Header from './Header';
import Sort from './Sort';
import { Container, Row, Col, Button, Pagination, PaginationItem, 
  PaginationLink, Form, FormGroup, CardColumns } from 'reactstrap';
import { api_url } from './config';
import Paginator from './Paginator';

var res_count = 0;
const per_page = 12;
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export class Restaurant {
  constructor(address, id, image, name, rating, zip_code) {
    this.address = address;
    this.id = id;
    this.image = image;
    this.name = name;
    this.rating = rating;
    this.zip_code = zip_code;
  }
}

export default class Restaurants extends Component {
  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.sortPage = this.sortPage.bind(this)
    this.filterPage = this.filterPage.bind(this)
    this.fillInRestaurants = this.fillInRestaurants.bind(this)
    this.state = {
      onPage: 0,
      restaurants_display: [],
      sorted: null,
      filters: {
        rating: 0,
        zipcode: 0,
        open: false
      }
    };
  }

  componentWillMount() {
    const url = api_url + "/restaurants";
    this.request(url, this.getCount);
    this.getPage(0, null, null, false);
  }

  fillInRestaurants(responseText) {
      var temp_restaurants = [];
      let restaurants_parsed = JSON.parse(responseText)["list"];
      for (let r of restaurants_parsed) {
        temp_restaurants.push(new Restaurant(r["address"], r["id"], r["image"], r["name"], r["rating"], r["zip_code"]));
      }
      this.setState({
        restaurants_display: temp_restaurants
      });
  }

  getCount(responseText) {
      res_count = JSON.parse(responseText)["total"];
  }

  request(url, parseResponse) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) 
          parseResponse(xmlHttp.responseText);
      }
      xmlHttp.open("GET", url, false) // true for asynchronous
      xmlHttp.send(null);
  }

  getDateString() {
    var d = new Date();
    var hour = d.getHours();
    var day = d.getDay(); 
    var timeString = days[day] + ",";
    timeString += hour + ":00"
    return timeString;
  }


  getPage(pageNum, sortParam, fils) {
    var apiParams = [];
    var url = api_url + "/restaurants?";

    // Sorting
    if(sortParam != null)
    {
      if (sortParam == "name") {
        apiParams.push("order_by=name");
        apiParams.push("order=asc");
      }
      else {
        apiParams.push("order_by=rating");
        apiParams.push("order=desc");
      }
    }

    // Apply filters
    if(fils != null) {
      if(fils.rating != 0) {
        apiParams.push("rating=" + fils.rating);
      }
      if(fils.zipcode != 0) {
        apiParams.push("zipcode=" + fils.zipcode);
      }
      if(fils.open == true) {
        var timeString = this.getDateString();
        apiParams.push("time=" + timeString);
      }
    }

    const count_url = url + apiParams.join("&");
    const page_url = count_url + "&page=" + pageNum+1;

    this.request(count_url, this.getCount);
    this.request(page_url, this.fillInRestaurants);
    this.setState({
      onPage: pageNum,
      sorted: sortParam,
      filters: fils
    });
  }


  filterPage(filters) {
    this.getPage(0, this.state.sorted, filters);
  }

  sortPage(category) {
    this.getPage(0, category, this.state.filters);
  }

  handlePageClick(pageNum) {
    document.getElementById('jump').scrollIntoView();
    this.setState({onPage: pageNum});

    this.getPage(pageNum, this.state.sorted, this.state.filters);
  }

  render() {
    const pages_count = (res_count%per_page) == 0 ? res_count/per_page : res_count/per_page + 1;

    var cards = this.state.restaurants_display.map(function(restaurant) {
            return <RestaurantCard restaurant={restaurant} />;
          })

    return (
    	<div className="background">
        <Header title="Restaurants" description="Restaurants description"/>
        <br />
    		<Container id="jump">
            <Col xs="12" md="2">
              <RestaurantFilter handler={this.filterPage}/>
              <br />
              <Sort handler={this.sortPage}/>
            </Col>
            <Row>
            <CardColumns>
            {
              res_count > 0 &&
              cards
            }
            {
              res_count == 0 &&
              <h1>No results found.</h1>
            }
            </CardColumns>
            </Row>

              {/*<Col md="4"/>*/}
              {/*<Col xs="12" md="4">*/}
                {/*<Pagination size="lg">{pages}</Pagination>*/}

                <Paginator totalPages={pages_count} activePage={this.state.onPage} onPageClicked={this.handlePageClick}/>
        </Container>
                {/*</Col>*/}
              {/*<Col md="4"/>*/}
      </div>
    );
  }
}