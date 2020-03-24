import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';
import { debug } from 'util';

const containerStyle = {
	zIndex: 1999,
};

class Toastr extends Component {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
		const { notify } = nextProps;
		toast[notify.type](notify.data.message);
	}

	render() {
		return <ToastContainer position="top-right" autoClose={5000} style={containerStyle} />;
	}
}

export default connect(state => ({ notify: state.app.notify, success: state.app.success }))(Toastr);
