import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getCountriesListAction, deleteCountriesAction } from '../../../action';
import CountriesPresenter from './presenter';
import { getListBranchesAction } from '../../../../common/App';

class Countries extends Component {
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
			countriesListId : '',
		};
		this.deleteAction = this.deleteAction.bind(this);
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

		dispatch(getCountriesListAction(params, token)).then(
			([err, data]) =>
				!err &&
				this.setState({
					dataList: data.countries,
					params: { total_pages: Math.ceil(data.total_count / per_page), page, per_page },
				})
		);
	};

	onDropdownToggle = ({ target }) => {
		let targetId = '';
		if(!this.state.actionDropdownOpen) {
			targetId = target.attributes.id.value;
		}		
		this.setState({
			actionDropdownOpen: !this.state.actionDropdownOpen,
			countriesListId: targetId,
		});
	}

	async deleteAction(e) {
		e.preventDefault();
		const { dispatch, token } = this.props;

		const payload = {};
		payload.id = e.target.id;
		dispatch(deleteCountriesAction( payload, token)).then(
			setTimeout(()=>{
				this.onChangePage(this.state.params.page)
			},500)			
		);
	}

	render() {
		const { dataList, params, actionDropdownOpen, countriesListId } = this.state;
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
			<CountriesPresenter
				list={list}
				params={params}
				onChangePage={this.onChangePage}
				onDropdownToggle={this.onDropdownToggle}
				actionDropdownOpen={actionDropdownOpen}
				countriesListId={countriesListId}
				onDelete={this.deleteAction}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token, listBranches: state.app.listBranches }),
	dispatch => ({ dispatch })
)(Countries);
