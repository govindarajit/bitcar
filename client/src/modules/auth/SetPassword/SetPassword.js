import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setPasswordAction } from '../action';
import * as appAction from '../../common/App';

import SetPasswordPresenter from './presenter';

class SetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = { auth: { newPassword: '', reEnterNewpassword: '' } };
	}

	onSetPassword = e => {	
		e.preventDefault();
		if(this.state.auth.newPassword !== this.state.auth.reEnterNewpassword) {
			let  data = { message: 'Password did not match' };
			this.props.newNotifyAction(data);
			return
		}
		let windowUrl = window.location.href;
		let ref = windowUrl.split('?')[windowUrl.split('?').length-1];
		var dataParam = {};
		dataParam.password = this.state.auth.newPassword;
		dataParam.passwordToken = ref.split('=')[1];
		this.props.setPasswordAction(dataParam);
	};

	onChangeInput = ({ target }) => {
		const { auth } = this.state;
		auth[target.name] = target.value;
		this.setState({ auth });
	};

	render() {
		return <SetPasswordPresenter onSetPassword={this.onSetPassword} auth={this.state.auth} onChangeInput={this.onChangeInput} />;
	}
}

export default connect(
	null,
	dispatch => ({
		setPasswordAction: param => dispatch(setPasswordAction(param)),
		newNotifyAction : data => dispatch(appAction.newNotifyAction({ data, type: 'error' }))
	})
)(SetPassword);
