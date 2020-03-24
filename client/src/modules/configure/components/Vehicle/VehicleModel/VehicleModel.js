import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getVehicleModelListAction, deleteVehicleModelAction } from '../../../action';
import VehicleModelPresenter from './presenter';
import { getListBranchesAction } from '../../../../common/App';

class VehicleModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			params: {
				page: 1,
				total_pages: 1,
				per_page: 10,
			},
			dataList: [],
			actionDropdownOpen: false,
			vehicleModelId : '',
		};
		this.deleteAccount = this.deleteAccount.bind(this);
	}

	componentDidMount() {
		const { dispatch, listBranches, token } = this.props;
		if (listBranches.length === 0) {
			dispatch(getListBranchesAction(token));
		}
		this.onChangePage(1);
	}
	onChangePage = page => {
		const { dispatch, token } = this.props;
		const { per_page } = this.state.params;
		let params = { page, per_page };

		dispatch(getVehicleModelListAction(params, token)).then(
			([err, data]) =>{
				!err &&
				this.setState({
					dataList: data.vehiclemodels,
					params: { total_pages: Math.ceil(data.total_count / per_page), page, per_page },
				})}
		);
	};

	onChangeFilter = ({ target }) => {
		const { filter, params } = this.state;
		filter[target.name] = target.value;
		this.setState({ filter });
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
			vehicleModelId: targetId,
		});
	}

	async deleteAccount(e) {
		e.preventDefault();
		const { dispatch, token } = this.props;

		const payload = {};
		payload.id = e.target.id;
		dispatch(deleteVehicleModelAction( payload, token)).then(
			setTimeout(()=>{
				this.onChangePage(this.state.params.page)
			},500)			
		);
	}

	render() {
		const { dataList, params, filter, keyword, actionDropdownOpen, vehicleModelId } = this.state;
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
			<VehicleModelPresenter
				list={list}
				params={params}
				onChangePage={this.onChangePage}
				onDropdownToggle={this.onDropdownToggle}
				actionDropdownOpen={actionDropdownOpen}
				vehicleModelId={vehicleModelId}
				onDeleteVehicleModel={this.deleteAccount}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token, listBranches: state.app.listBranches }),
	dispatch => ({ dispatch })
)(VehicleModel);
