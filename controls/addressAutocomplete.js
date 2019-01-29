import React from 'react'
import { Select2 } from "./input"

export class AddressAutoComplete extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			term: props.value
		};

		this.gmap_canvas = React.createRef();

		// this.service = new google.maps.places.AutocompleteService({
		// 	types: props.types
		// });
	}

	getConfig(props = this.props) {
		const types = props.types === undefined ? ['(cities)'] : props.types,
			componentRestrictions = props.componentRestrictions,
			bounds = props.bounds;
		let	config = {types, bounds};

		if (componentRestrictions) {
			config.componentRestrictions = componentRestrictions;
		}
		return config
	}

	render() {
		return (<div>
			<div ref={this.gmap_canvas}/>
			<Select2 caption={this.props.caption} value={this.state.term} inputRef={el => this.input = el}
							 retrieveFn={this.retrieveAddress.bind(this)} disabled={this.props.disabled}
							 placeholder=""  required={this.props.required}
							 onValueChanged={value => this.valueChangedHandler(value)}/>
		</div>);
	}

	componentDidMount() {
		const config = this.getConfig(this.props);
		// this.autocomplete = new google.maps.places.Autocomplete(this.input, config);
		this.placeService = new google.maps.places.PlacesService(this.gmap_canvas.current);
		if (this.state.term) {
			this.retrievePlaceDetails(this.state.term).then(location => this.setState({term: location.formatted_address})).catch(e => {})
		}
	}

	componentWillUpdate(props) {
		// this.service = new google.maps.places.AutocompleteService({
		// 	types: props.types
		// });

		// this.autocomplete = new google.maps.places.Autocomplete(this.input.current, this.getConfig(props));
		this.service = new google.maps.places.AutocompleteService(this.getConfig(props) );

		if (props.value !== this.state.term) {
			this.setState({
				term: props.value
			})
		}
	}

	async valueChangedHandler(value) {
		this.setState({
			term: value.name
		});

		const $this = this;
		this.placeService.getDetails({
			placeId: value.place_id,
			fields: ['address_component', 'adr_address', 'formatted_address', 'geometry', 'place_id']
		}, function (e, status) {
			if (status === 'OK') {
				$this.props.onAddressSelected(e);
			}
		});
	}

	retrieveAddress(address) {
		return new Promise((resolve, reject) => {
			this.service.getPlacePredictions({ input: address }, (predictions, status) => {
				if (status === 'OK' && predictions && predictions.length > 0) {
					const formattedResult = predictions.map(item => ({...item,
						name: item.description
					}));

					resolve(formattedResult)
				} else {
					reject(status)
				}
			});
		})
	}

	retrievePlaceDetails(address, fields = null) {
		return new Promise((resolve, reject) => {
			this.placeService.getDetails({ placeId: address, fields}, (e, status) => {
				if (status === 'OK') {
					resolve(e)
				} else {
					reject()
				}
			});
		})
	}
}

