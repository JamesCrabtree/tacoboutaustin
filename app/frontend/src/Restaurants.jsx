import React, { Component } from 'react';
import search from './assets/search.png';
import RestaurantCard from './RestaurantCard';
import RestaurantFilter from './RestaurantFilter';
import Header from './Header';
import Sort from './Sort';
import { Container, Row, Col, Button,
  Form, FormGroup, CardColumns } from 'reactstrap';
import { api_url } from './config';
import Paginator from './Paginator';
import HeaderBackground from './assets/restaurants_header_background.jpg';
import TacoAnimation from './assets/taco_loading.gif';

var resCount = 0;
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
    this.sortPage = this.sortPage.bind(this);
    this.filterPage = this.filterPage.bind(this);
    this.fillInRestaurants = this.fillInRestaurants.bind(this);
    this.doneLoading = this.doneLoading.bind(this);
    this.requestCount = this.requestCount.bind(this);
    this.requestPages = this.requestPages.bind(this);
    this.getCount = this.getCount.bind(this);

    this.state = {
      onPage: 1,
      restaurantsDisplay: [],
      sorted: null,
      filters: {
        rating: 0,
        zipcode: 0,
        open: false
      },
      loading: false,
    };
  }

  componentWillMount() {
    const url = api_url + "/restaurants";
    this.getPage(1, null, null, false);
  }

  componentDidMount() {

  }

  fillInRestaurants(responseText) {
      var tempRestaurants = [];
      let resParsed = JSON.parse(responseText)["list"];
      for (let r of resParsed) {
        tempRestaurants.push(new Restaurant(r["address"], r["id"], r["image"], r["name"], r["rating"], r["zip_code"]));
      }
      this.setState({
        restaurantsDisplay: tempRestaurants
      });
      this.doneLoading();
  }

  getCount(responseText, page_url) {
      resCount = JSON.parse(responseText)["total"];
      this.requestPages(page_url, this.fillInRestaurants);
    }

  requestCount(count_url, page_url, getCount) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) 
          getCount(xmlHttp.responseText, page_url);
      }
      xmlHttp.open("GET", count_url, true) // true for asynchronous
      xmlHttp.send(null);
  }

  requestPages(page_url, fillInRestaurants) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) 
          fillInRestaurants(xmlHttp.responseText);
      }
      xmlHttp.open("GET", page_url, true) // true for asynchronous
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
    this.setState({
      loading: true,
    })
    var apiParams = [];
    var url = api_url + "/restaurants?";

    // Sorting
    if(sortParam != '')
    {
      if (sortParam == "name_asc") {
        apiParams.push("order_by=name");
        apiParams.push("order=asc");
      }
      else if(sortParam == "name_desc") {
        apiParams.push("order_by=name");
        apiParams.push("order=desc");
      } 
      else if(sortParam == "rating_desc") {
        apiParams.push("order_by=rating");
        apiParams.push("order=desc");
      }
      else if(sortParam == "rating_asc") {
        apiParams.push("order_by=rating");
        apiParams.push("order=asc");
      }
    }

    // Apply filters
    if(fils != null) {
      if(fils.rating != 0) {
        apiParams.push("rating=" + fils.rating);
      }
      if(fils.selectedZipcodes != '') {
        apiParams.push("zipcode=" + fils.selectedZipcodes);
      }
      if(fils.open == true) {
        var timeString = this.getDateString();
        apiParams.push("time=" + timeString);
      }
      if(fils.selectedCategories != '') {
        apiParams.push("categories=" + fils.selectedCategories);
      }
    }

    const count_url = url + apiParams.join("&");
    const page_url = count_url + "&page=" + pageNum;

    this.requestCount(count_url, page_url, this.getCount);
    this.setState({
      onPage: pageNum,
      sorted: sortParam,
      filters: fils
    });
  }

  doneLoading() {
    this.setState({loading: false});
  }

  filterPage(filters) {
    this.getPage(1, this.state.sorted, filters);
  }

  sortPage(category) {
    this.getPage(1, category, this.state.filters);
  }

  handlePageClick(pageNum) {
    document.getElementById('jump').scrollIntoView();
    this.getPage(pageNum, this.state.sorted, this.state.filters);
  }

  render() {
    const loadingImage =
      <div>
        <img src={TacoAnimation} alt="Loading Image" width="65%" height="auto" style={{marginLeft: '60%'}}/>
      </div>;

    var pages_count = Math.floor(resCount/per_page);
    if (!((resCount%per_page) == 0))
      pages_count++;

    var cards = this.state.restaurantsDisplay.map(function(restaurant) {
            return <Col xs="12" md="4"><RestaurantCard restaurant={restaurant} /></Col>;
          })


    const container =
        <Col xs="12" md="10">
        {
          resCount > 0 &&
          cards
        }
        {
          resCount == 0 &&
          <h1>No results found.</h1>
        }
        </Col>


    return (
        <div className="background">
          <Header
            title="World-class Restaurants"
            description="From mouth-watering barbeque to spicy Tex-Mex, our wide selection is bound to make your belly happy."
            image={HeaderBackground}
          />
          
          <br />

          <Container id="jump">
            <Row>
              <Col xs="12" md="2">
                <RestaurantFilter handler={this.filterPage}/>
                <br />
                <Sort handler={this.sortPage}/>
              </Col>

              {
                this.state.loading ?
                loadingImage
                :
                container
              }

            </Row>

              {
                !this.state.loading &&
                <Paginator pageCount={pages_count} activePage={this.state.onPage} onPageClicked={this.handlePageClick} />
              }

        </Container>
      </div>
    );
  }
}