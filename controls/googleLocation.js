import React from 'react';
import {Select2} from "./input";

export class GoogleLocation extends React.Component{
	constructor(props) {
		super(props);

		this.API = {
			GEOCODE: {
				NAME: 'geocode',
				KEY: 'AIzaSyCI2zt3yh9MX_Nh4oF5qB5lL2s9r-YvSVY'
			},
			TIMEZONE: {
				NAME: 'timezone',
				KEY: 'AIzaSyCI2zt3yh9MX_Nh4oF5qB5lL2s9r-YvSVY'
			},
			PLACE: {
				NAME: 'place/autocomplete',
				KEY: 'AIzaSyCI2zt3yh9MX_Nh4oF5qB5lL2s9r-YvSVY'
			}
		};

		this.configuration = {
			apiUrl: 'https://maps.googleapis.com/maps/api',
			sensor: true,
			outputFormat: 'json'
		};

		this.state = {
			term: props.value
		}
	}

	render() {
		return (<div>
			<Select2 caption={this.props.caption} value={this.state.term}
							 retrieveFn={this.geocode.bind(this)}
							 placeholder=""  required={this.props.required}
							 onValueChanged={value => this.valueChangedHandler(value)}/>
		</div>);
	}

	valueChangedHandler(value) {
		this.setState({
			term: value.name
		});

		this.props.onAddressSelected(value);
	}

	async callApi(api, params) {
		const axios = require('axios');
		params = Object.assign({}, {
			key: api.KEY,
			sensor: this.configuration.sensor,
			timestamp: Math.floor(Date.now()/1000)
		}, params);
		const url = [
			this.configuration.apiUrl,
			api.NAME,
			this.configuration.outputFormat
		].join('/');
		const response = await axios({
			method: 'get',
			url,
			params
		});

		return response.data.results.map(item => ({
			id: item.place_id,
			name: item.formatted_address,
			geometry: item.geometry
		}));
	}

	geocode(address) {
		return this.callApi(this.API.GEOCODE, {address})
	}

	timezone(address) {
		return this.callApi(this.API.TIMEZONE, {address})
	}
}
