import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	getSingleCountriesAction,
	updateCountriesAction,
	addCountriesAction
} from '../../action';

import AddCountriesPresenter from './presenter';

class AddCountries extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				country_name: '',
				distance_unit: '',
				currency_unit: '',
				status: 'active'
			},
			isOpen: false,
			showImage: null,
			id: this.props.match.params.id,
		};
		this.updateAccount = this.updateAccount.bind(this);
		this.addVehicleType = this.addVehicleType.bind(this);
	}

	componentDidMount() {
		const { dispatch, token } = this.props;
		if(this.state.id !== 'add'){
			dispatch(getSingleCountriesAction(this.state.id, token)).then(
				([err, data]) =>{
					!err &&
					this.setState({
						data: {
							country_name: data.countries[0].country_name,
							distance_unit: data.countries[0].distance_unit,
							currency_unit: data.countries[0].currency_unit,
							status: data.countries[0].status,
							_id: data.countries[0]._id
						},
					}
				)}
			);
		} else {
			this.setState({
				data: {
					country_name: '',
					distance_unit: '',
					currency_unit: '',
					status: 'active',
				},
			})
		}
		
	}

	async updateAccount(e) {
		e.preventDefault();
		const { data, id } = this.state;
		const { dispatch, token } = this.props;

		const payload = {
			...data,
		};
		payload.id = id;
		dispatch(updateCountriesAction( payload, token));
	}	

	async addVehicleType(e) {
		e.preventDefault();
		const { data } = this.state;
		const { dispatch, token } = this.props;
		dispatch(addCountriesAction(data, token));
	}

	onChangeInput = ({ target }) => {
		const { data } = this.state;
		data[target.name] = target.value;
		this.setState({ data });
	};

	toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

	handleZoom = image => () =>
		this.setState(({ isOpen }) => ({
			showImage: image,
			isOpen: !isOpen,
		}));

	render() {
		const { data, id } = this.state;

		return (
			<AddCountriesPresenter
				data={data}
				toggle={this.toggle}
				updateAccount={this.updateAccount}
				onChangeInput={this.onChangeInput}
				button={id}
				onAddVehicleType={this.addVehicleType}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token }),
	dispatch => ({ dispatch })
)(AddCountries);
