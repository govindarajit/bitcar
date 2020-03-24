import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	getVehicleModelAction,
	updateVehicleModelAction,
	addVehicleModelAction,
	getVehicleTypeListAction
} from '../../action';
import { uploadImgAction } from '../../../common/App';

import AddVehicleModelPresenter from './presenter';

class AddVehicleModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				vehicle_name: '',
				vehicle_model: '',
				short_description: '',
				long_description: '',
				status: 'active'
			},
			isOpen: false,
			showImage: null,
			focusDate: {
				driving: false,
				vehicle: false,
				psv: false,
			},
			vehicles:[],
			id: this.props.match.params.id,
			isUpdate: false,
			file: { img_front_side: null, img_back_side: null, avatar_url: null },
		};
		this.updateAccount = this.updateAccount.bind(this);
		this.addVehicleModel = this.addVehicleModel.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
	}

	componentDidMount() {
		const { dispatch, token } = this.props;
		dispatch(getVehicleTypeListAction('', token)).then(
			([err, data]) =>{
				!err &&
				this.setState({
					vehicles: data.vehicles,
				})}
		);
		if(this.state.id !== 'add'){
			dispatch(getVehicleModelAction(this.state.id, token)).then(
				([err, data]) =>{
					!err &&
					this.setState({
						data: {
							vehicle_name: data.vehiclemodels[0].vehicle_id.vehicle_name,
							vehicle_model: data.vehiclemodels[0].vehicle_model,
							short_description: data.vehiclemodels[0].short_description,
							long_description: data.vehiclemodels[0].long_description,
							status: data.vehiclemodels[0].status,
							_id: data.vehiclemodels[0]._id
						},
					}
				)}
			);
		} else {
			this.setState({
				data: {
					vehicle_name: '',
					short_description: '',
					vehicle_model: '',
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
		dispatch(updateVehicleModelAction( payload, token));
	}	

	async addVehicleModel(e) {
		e.preventDefault();
		const { data } = this.state;
		const { dispatch, token } = this.props;
		dispatch(addVehicleModelAction(data, token));
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
		const { isUpdate, data, isOpen, showImage, id, vehicles } = this.state;

		return (
			<AddVehicleModelPresenter
				data={data}
				isOpen={isOpen}
				showImage={showImage}
				handleZoom={this.handleZoom}
				toggle={this.toggle}
				isUpdate={isUpdate}
				updateAccount={this.updateAccount}
				onChangePicture={this.onChangePicture}
				onChangeInput={this.onChangeInput}
				button={id}
				onAddVehicle={this.addVehicleModel}
				vehicles={vehicles}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token }),
	dispatch => ({ dispatch })
)(AddVehicleModel);
