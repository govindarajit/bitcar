import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	getTripInfoAction,
} from '../../action';

import TripInfoPresenter from './presenter';

class TripInfo extends Component {
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
			id: this.props.match.params.id,
			path : [
				{lat: 28.586392, lng: 77.31530029999999},
				{lat: 28.58610445603642, lng: 77.31113433837892}
			],
			startPoint: {
				lat:28.586392, lng: 77.31530029999999
			},
			endPoint: {
				lat: 28.58610445603642, lng: 77.31113433837892
			}
		};
	}

	componentDidMount() {
		const { dispatch, token } = this.props;
		dispatch(getTripInfoAction(this.state.id, token)).then(
			([err, data]) =>{debugger;
				!err &&
				this.setState({
					data: {
						riderId: data.rider._id,
						riderName: data.rider.name.first_name + data.rider.name.last_name,
						riderPhone: data.rider.phone_number,
						driverId: data.driver._id,
						driverName: data.driver.name.first_name + data.driver.name.last_name,
						driverPhone: data.driver.phone_number,
						pickupLoc: data.pickupAddress,
						dropOffLoc: data.dropAddress,
						carType: 'type',
					},
					
				}
			)}
		);
		
	}

	render() {
		const { data, path, startPoint, endPoint } = this.state;

		return (
			<TripInfoPresenter
				data={data}
				path={path}
				startPoint={startPoint}
				endPoint={endPoint}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token }),
	dispatch => ({ dispatch })
)(TripInfo);
