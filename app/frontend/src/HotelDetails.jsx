import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import HotelJumbotron from './HotelJumbotron';
import { Link } from 'react-router-dom';


var h_details = {};
var nearby_restaurants = [];
var nearby_attractions = [];

export default class HotelDetails extends Component {

	componentWillMount() {
		function parseData(responseText) {
			let hotel = JSON.parse(responseText)["hotel"];
	      	let attractions = JSON.parse(responseText)["close_by_attractions"];
	        let restaurants = JSON.parse(responseText)["close_by_restaurants"];

	        for (let a of attractions) {
	        	nearby_attractions.push(a);
	        }

	        for(let r of restaurants) {
	        	nearby_restaurants.push(r);
	        }

	        h_details = hotel;
      	}

        const url = "http://localhost/api/hotels/" + this.props.match.params.hot_id;

    	function request(url, parseResponse) {
      		var xmlHttp = new XMLHttpRequest();
      		xmlHttp.onreadystatechange = function() {
        		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) 
          			parseResponse(xmlHttp.responseText);
      		}
      		xmlHttp.open("GET", url, false) // true for asynchronous
      		xmlHttp.send(null);
    	}

    	request(url, parseData);
	}

	render(props)
	{
		return (
			<Container>
				<Row>
					<Col sm="12">
					<h1>Hotel Details</h1>
					</Col>
					<Col>
                		<HotelJumbotron
                		name={h_details.name}
		        		activitytype="poop activitytype"
		        		image={h_details.images[2]}
		        		map="http://texspine.com/wp-content/uploads/2012/01/map.jpg"
		        		hours="No hours"
		        		rating={h_details.rating}
                		/>
              		</Col>
				</Row>
				<Row>
					<h1>Nearby things!</h1>
				</Row>
				<Row>
					<h2><Link to='/restaurants'>Restaurants!</Link></h2>
				</Row>
				<Row>
					<h2><Link to='/attractions'>Attractions!</Link></h2>
				</Row>
			</Container>
		);
	}

}