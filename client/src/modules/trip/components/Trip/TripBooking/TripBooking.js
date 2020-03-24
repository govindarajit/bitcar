import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getNowBookings, getLaterBookings, getHistoryBookings } from '../../../action';
import TripBookingPresenter from './presenter';
import { getListBranchesAction, getCountries, getCities } from '../../../../common/App';

class TripBooking extends Component {
	constructor(props) {
		super(props);
		this.state = {
			params: {
				page: 1,
				total_pages: 1,
				per_page: 10,
			},
			dataList: [],
			filter: {
				status: 'all',
				region: 'all',
				country: 'all',
			},
			actionDropdownOpen: false,
			tripId : '',
			countries:[],
			cities:[],
		};
	}

	componentDidMount() {
		const { dispatch, listBranches, token } = this.props;
		dispatch(getCountries()).then(
			([err, data]) =>{
				!err &&
				this.setState({
					countries: data,
				})
			}
		);
		if (listBranches.length === 0) {
			dispatch(getListBranchesAction(token));
		}
		this.onChangePage(1);
	}
	onChangePage = page => {
		const { dispatch, token, bookingType } = this.props;
		const { per_page } = this.state.params;
		const { status, region, country } = this.state.filter;
		let params = { page, per_page };
		if (status !== 'all') {
			params.booking_status = status;
		}
		if (region !== 'all') {
			params.region = region;
		}
		if (country !== 'all') {
			params.country = country;
		}
		if (bookingType === 'nowBooking') {
			dispatch(getNowBookings(params, token)).then(
				([err, data]) =>{
					!err &&
					this.setState({
						dataList: data.trips,
						params: { total_pages: Math.ceil(data.total_count / per_page), page, per_page },
					})
				}
			);
		} else if (bookingType === 'laterBooking') {
			dispatch(getLaterBookings(params, token)).then(
				([err, data]) =>{
					!err &&
					this.setState({
						dataList: data.trips,
						params: { total_pages: Math.ceil(data.total_count / per_page), page, per_page },
					})
				}
			);
		} else {
			dispatch(getHistoryBookings(params, token)).then(
				([err, data]) =>{
					!err &&
					this.setState({
						dataList: data.trips,
						params: { total_pages: Math.ceil(data.total_count / per_page), page, per_page },
					})
				}
			);
		}
		
	};

	onChangeFilter = ({ target }) => {
		const { filter, params } = this.state;
		const { dispatch } = this.props;
		filter[target.name] = target.value;
		this.setState({ filter });
		if(target.name === 'country') {
			if(target.value === 'all') {
				this.setState({
					cities: [],
				})
			} else {
				dispatch(getCities({id: target.value})).then(
					([err, data]) =>{
						!err &&
						this.setState({
							cities: data,
						})
					}
				);
			}
		}
		this.onChangePage(params.page);
	};

	onChangeKeyword = ({ target }) => this.setState({ keyword: target.value });

	onSearch = () => {
		this.onChangePage(this.state.params.page);
	};

	onEnter = e => {
		if (e.charCode === 13) {
			this.onSearch();
		}
	};

	onDropdownToggle = ({ target }) => {
		let targetId = '';
		if(!this.state.actionDropdownOpen) {
			targetId = target.attributes.id.value;
		}		
		this.setState({
			actionDropdownOpen: !this.state.actionDropdownOpen,
			tripId: targetId,
		});
	}

	render() {
		const { dataList, params, actionDropdownOpen, tripId, filter, countries, cities } = this.state;
		const {bookingType} = this.props;
		return (
			<TripBookingPresenter
				filter={filter}
				onChangeFilter={this.onChangeFilter}
				list={dataList}
				params={params}
				onChangePage={this.onChangePage}
				onDropdownToggle={this.onDropdownToggle}
				actionDropdownOpen={actionDropdownOpen}
				tripId={tripId}
				bookingType={bookingType}
				countries={countries}
				cities={cities}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token, listBranches: state.app.listBranches }),
	dispatch => ({ dispatch })
)(TripBooking);
