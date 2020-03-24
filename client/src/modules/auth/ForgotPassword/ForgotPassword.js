import React, { Component } from 'react';
import { connect } from 'react-redux';

import { forgotPasswordAction } from '../action';

import ForgotPasswordPresenter from './presenter';

class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.state = { auth: { email: ''} };
	}

	onForgotPassword = e => {
		e.preventDefault();
		this.props.forgotPasswordAction(this.state.auth);
	};

	onChangeInput = ({ target }) => {
		const { auth } = this.state;
		auth[target.name] = target.value;
		this.setState({ auth });
	};

	render() {
		return <ForgotPasswordPresenter onForgotPassword={this.onForgotPassword}  auth={this.state.auth} onChangeInput={this.onChangeInput} />;
	}
}

export default connect(
	null,
	dispatch => ({
		forgotPasswordAction: param => dispatch(forgotPasswordAction(param)),
	})
)(ForgotPassword);
