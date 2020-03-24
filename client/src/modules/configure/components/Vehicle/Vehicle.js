import React, { Component } from 'react';
import { connect } from 'react-redux';
import VehiclePresenter from './presenter';

class Vehicle extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1'
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	componentDidMount() {
		
	}

	render() {

		return (
			<VehiclePresenter activeTab={this.state.activeTab} onToggle={this.toggle}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token, listBranches: state.app.listBranches }),
	dispatch => ({ dispatch })
)(Vehicle);
