import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getDriverAction } from '../../action';
import DriverPresenter from './presenter';
import { getListBranchesAction, getCountries, getCities } from '../../../common/App';

class Driver extends Component {
	constructor(props) {
		super(props);
		this.state = {
			params: {
				page: 1,
				total_pages: 1,
				per_page: 10,
			},
			keyword: '',
			dataList: [],
			filter: {
				region: 'all',
				country: 'all',
				platform: 'all',
				activation_status: 'all',
				verified: 'all',
			},
			actionDropdownOpen: false,
			driverId : '',
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
		const { dispatch, token } = this.props;
		const { per_page } = this.state.params;
		const { activation_status, region, country, platform, verified } = this.state.filter;
		let params = { page, per_page };

		if (activation_status !== 'all') {
			params.activation_status = activation_status;
		}

		if (region !== 'all') {
			params.branch = region;
		}

		if (country !== 'all') {
			params.country = country;
		}

		if (platform !== 'all') {
			params.platform = platform;
		}

		if (verified !== 'all') {
			params.verified = verified;
		}

		if (this.state.keyword) {
			params.keyword = this.state.keyword;
		}

		dispatch(getDriverAction(params, token)).then(
			([err, data]) =>
				!err &&
				this.setState({
					dataList: data.users,
					params: { total_pages: Math.ceil(data.total_count / per_page), page, per_page },
				})
		);
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
		debugger;
		let targetId = '';
		if(!this.state.actionDropdownOpen) {
			targetId = target.attributes.id.value;
		}		
		this.setState({
			actionDropdownOpen: !this.state.actionDropdownOpen,
			driverId: targetId,
		});
	  }

	render() {
		const { dataList, params, filter, keyword, actionDropdownOpen, driverId, countries, cities } = this.state;
		const { listBranches } = this.props;
		const list = dataList.map(data => {
			let dt = { ...data, branchName: ' ' };
			listBranches.map(branch => {
				if (branch.id === data.branch) {
					dt.branchName = branch.name;
				}
			});
			return dt;
		});

		return (
			<DriverPresenter
				filter={filter}
				list={list}
				keyword={keyword}
				onChangeKeyword={this.onChangeKeyword}
				onSearch={this.onSearch}
				params={params}
				onEnter={this.onEnter}
				onChangePage={this.onChangePage}
				onChangeFilter={this.onChangeFilter}
				onDropdownToggle={this.onDropdownToggle}
				actionDropdownOpen={actionDropdownOpen}
				driverId={driverId}
				countries={countries}
				cities={cities}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token, listBranches: state.app.listBranches }),
	dispatch => ({ dispatch })
)(Driver);
