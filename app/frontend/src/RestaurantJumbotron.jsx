import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  Jumbotron, 
  Button, 
  Row,
  Col,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Container } from 'reactstrap';
import LargeTacoRating from './LargeTacoRating';

var parsedOpeningHours;
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default class RestaurantJumbotron extends Component {

  constructor(props) {
      super(props);
      this.state = { activeIndex: 0 };
      this.next = this.next.bind(this);
      this.previous = this.previous.bind(this);
      this.goToIndex = this.goToIndex.bind(this);
      this.onExiting = this.onExiting.bind(this);
      this.onExited = this.onExited.bind(this);
    }

  onExiting() {
      this.animating = true;
  }

  onExited() {
      this.animating = false;
  }

  next() {
      if (this.animating) return;
      const nextIndex = this.state.activeIndex === this.props.images.length - 1 ? 0 : this.state.activeIndex + 1;
      this.setState({ activeIndex: nextIndex });
    }

  previous() {
      if (this.animating) return;
      const nextIndex = this.state.activeIndex === 0 ? this.props.images.length - 1 : this.state.activeIndex - 1;
      this.setState({ activeIndex: nextIndex });
  }

    goToIndex(newIndex) {
      if (this.animating) return;
      this.setState({ activeIndex: newIndex });
  }

  convertTime(timeString) {
    let t = parseInt(timeString.slice(0, 2));
    if (t < 12) {
      return t + ":" + timeString.slice(2) + "AM"
    } 
    else {
      return (t==12) ? t + ":" + timeString.slice(2) + "PM" : t%12 + ":" + timeString.slice(2) + "PM"
    }
  }

  // Needs to accomodate days that are closed and multiple opening hours on a day
  parseBR() {
    var h = this.props.hours;
    var appending = false;
    var splittedHours = [];
    var day;
    for (var i = 0; i < h.length; i++) {
      if (!appending) {
        day = "";
        day += days[h[i].day] + ": ";
      }
      if(this.convertTime(h[i].open_time) == "0:00AM" &&
        this.convertTime(h[i].close_time) == "0:00AM") {
        day += "24 hours"
      }
      else {
        day += this.convertTime(h[i].open_time) + "-" + this.convertTime(h[i].close_time);
      }
      
      if(i < h.length - 1 && h[i+1].day == h[i].day) {
        day += ", ";
        appending = true
      }
      else {
        appending = false
      }
      if(!appending)
        splittedHours.push(day)
    }

    this.parsedOpeningHours = splittedHours.map(function(hours) {
      return <div><p>{hours}</p></div>
    }); 
  };

  componentWillMount() {
    this.parsedOpeningHours = "";
    this.parseBR();
  }

  render(props) {
    const { activeIndex } = this.state;

    const slides = this.props.images.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item}
          >
          <img top width="100%" height="400em" src={item} alt="Card image cap" />
        </CarouselItem>
      );
    });

    var reviews = this.props.reviews.map(function(review) {
      return <p>{review.text}<a href={review.link}>read more!</a></p>
    })

    var moreImages = this.props.images.map(function(image) {
                return <Col xs='3'><img top width="100%" src={image} alt="Card image cap" /></Col>;
              })

    return (
    <div>
      <Jumbotron>
        <Row>
          <Col><h1 className="display-3">{this.props.name}</h1></Col>
        </Row>
        <Row>
          <Col><p className="lead"><LargeTacoRating rating={this.props.rating}/><br/></p>
          </Col>
          <Col><h2>Categories: {this.props.categories}</h2>
            {
              this.props.phone != "" &&
              <h3>Phone: {this.props.phone}</h3>
            }
          </Col>
        </Row>
          <Row>
          <Col xs="6">
          <div>
            <style>
              {
              `.custom-tag {
                  max-width: 100%;
                  height: 100px;
                  background: black;
                }`
              }
            </style>
            <Carousel
              activeIndex={activeIndex}
              next={this.next}
              previous={this.previous}
              >
              {slides}
              <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
              <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
            </Carousel>
            </div>
            </Col>
          <Col xs="6">
            
            <iframe top width="100%" height="400em" frameborder="0" src={this.props.map_src} allowfullscreen>
          </iframe>
          
          </Col>
        </Row>
        <p></p>
        <hr className="my-2" />
        <div style={{textAlign: 'center'}}>

        <h2><b>Opening hours</b></h2><br/>
        <p>
        {this.parsedOpeningHours}
        </p>
        </div>
        <h2><b>Reviews</b></h2><br/>
        <p>
        <blockquote><q>{reviews}</q></blockquote></p>
        <br/>
      </Jumbotron>
    </div>
  )};
}

RestaurantJumbotron.propTypes = {
  name: PropTypes.string,
  rating: PropTypes.string,
  images: PropTypes.object,
  map_src: PropTypes.string,
  hours: PropTypes.array,
  reviews: PropTypes.object,
  phone: PropTypes.string,
  categories: PropTypes.string
};