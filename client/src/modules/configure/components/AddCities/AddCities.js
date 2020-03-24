import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	getSingleCitiesAction,
	updateCitiesAction,
	addCitiesAction,
	getVehicleTypeListAction,
	getCountriesListAction
} from '../../action';

import AddCitiesPresenter from './presenter';

class AddCities extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				country_name: '',
				city_name: '',
				status: 'active',
				vehicle_type: [],
			},
			vehicleTypeList: [],
			countries:[],
			id: this.props.match.params.id,
		};
		this.updateAccount = this.updateAccount.bind(this);
		this.addVehicleModel = this.addVehicleModel.bind(this);
		this.onCheckbox = this.onCheckbox.bind(this);
	}

	componentDidMount() {
		const { dispatch, token } = this.props;
		dispatch(getVehicleTypeListAction('', token)).then(
			([err, data]) =>{
				!err &&
				this.setState({
					vehicleTypeList: data.vehicles,
				})}
		);
		dispatch(getCountriesListAction('', token)).then(
			([err, data]) =>{
				!err &&
				this.setState({
					countries: data.countries,
				})}
		);
		if(this.state.id !== 'add'){
			dispatch(getSingleCitiesAction(this.state.id, token)).then(
				([err, data]) =>{
					!err &&
					this.setState({
						data: {
							country_name: data.cities[0].country_id.country_name,
							city_name: data.cities[0].city_name,
							vehicle_type: [],
							status: data.cities[0].status,
							_id: data.cities[0]._id
						},
						
					},()=>{
						let checkedArr = data.cities[0].vehicle_type;
						for(let i=0;i<checkedArr.length;i++){
							document.getElementById(checkedArr[i]._id).click();
						}
					}
				)}
			);
		} else {
			this.setState({
				data: {
					country_name: '',
					city_name: '',
					status: 'active',
					vehicle_type: [],
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
		dispatch(updateCitiesAction( payload, token));
	}	

	async addVehicleModel(e) {
		e.preventDefault();
		const { data } = this.state;
		const { dispatch, token } = this.props;
		dispatch(addCitiesAction(data, token));
	}

	onChangeInput = ({ target }) => {
		const { data } = this.state;
		data[target.name] = target.value;
		this.setState({ data });
	};

	onCheckbox = ({ target }) => {
		let val = target.value;
		let vehicleTypeData = this.state.data.vehicle_type;
		if(target.checked) {
			vehicleTypeData.push(val);
		} else {
			const selectionIndex = vehicleTypeData.findIndex((el)=>{return el===val});
			vehicleTypeData.splice(selectionIndex,1);
		}
		this.setState(currentState => {
			const { data } = currentState;
			data.vehicle_type = vehicleTypeData
			return currentState;
		});
	}

	toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));



	render() {
		const { isUpdate, data, isOpen, vehicleTypeList, id, countries } = this.state;

		return (
			<AddCitiesPresenter
				data={data}
				isOpen={isOpen}
				toggle={this.toggle}
				isUpdate={isUpdate}
				updateAccount={this.updateAccount}
				onChangeInput={this.onChangeInput}
				button={id}
				onAddVehicle={this.addVehicleModel}
				onCheckbox={this.onCheckbox}
				vehicleTypeList={vehicleTypeList}
				countries={countries}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token }),
	dispatch => ({ dispatch })
)(AddCities);
