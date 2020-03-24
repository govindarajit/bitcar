import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	getVehicleTypeAction,
	updateVehicleTypeAction,
	addVehicleTypeAction
} from '../../action';
import { uploadImgAction } from '../../../common/App';

import AddVehicleTypePresenter from './presenter';

class AddVehicleType extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				picture: '',
				vehicle_name: '',
				short_description: '',
				long_description: '',
				status: 'active'
			},
			isOpen: false,
			showImage: null,
			id: this.props.match.params.id,
		};
		this.updateAccount = this.updateAccount.bind(this);
		this.addVehicleType = this.addVehicleType.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
	}

	componentDidMount() {
		const { dispatch, token } = this.props;
		if(this.state.id !== 'add'){
			dispatch(getVehicleTypeAction(this.state.id, token)).then(
				([err, data]) =>{
					!err &&
					this.setState({
						data: {
							picture: data.vehicle[0].picture,
							vehicle_name: data.vehicle[0].vehicle_name,
							short_description: data.vehicle[0].short_description,
							long_description: data.vehicle[0].long_description,
							status: data.vehicle[0].status,
							_id: data.vehicle[0]._id
						},
					}
				)}
			);
		} else {
			this.setState({
				data: {
					picture: '',
					vehicle_name: '',
					short_description: '',
					long_description: '',
					status: 'active',
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
		dispatch(updateVehicleTypeAction( payload, token));
	}	

	async addVehicleType(e) {
		e.preventDefault();
		const { data } = this.state;
		const { dispatch, token } = this.props;
		dispatch(addVehicleTypeAction(data, token));
	}

	onChangeInput = ({ target }) => {
		const { data } = this.state;
		data[target.name] = target.value;
		this.setState({ data });
	};

	onChangePicture = (obj = '') => async ({ target }) => {
		const { data } = this.state;

		const [success, res] = await this.uploadImg(target.files[0]);
		if (success) {
			if (!obj) {
				data.picture = res.url;
				return this.setState({ data });
			}

			const objDt = data.documents[obj];
			objDt[target.name] = res.url;
			this.setState({
				data: {
					...data,
					documents: {
						...data.documents,
						[obj]: objDt,
					},
				},
			});
		}
	};

	async uploadImg(file) {
		const { token, dispatch } = this.props;
		return dispatch(uploadImgAction(file, token));
	}

	toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

	handleZoom = image => () =>
		this.setState(({ isOpen }) => ({
			showImage: image,
			isOpen: !isOpen,
		}));

	render() {
		const { isUpdate, data, isOpen, showImage, id } = this.state;

		return (
			<AddVehicleTypePresenter
				data={data}
				isOpen={isOpen}
				showImage={showImage}
				handleZoom={this.handleZoom}
				toggle={this.toggle}
				updateAccount={this.updateAccount}
				onChangePicture={this.onChangePicture}
				onChangeInput={this.onChangeInput}
				button={id}
				onAddVehicleType={this.addVehicleType}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token }),
	dispatch => ({ dispatch })
)(AddVehicleType);
