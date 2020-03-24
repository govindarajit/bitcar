import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	getRiderInfoAction,
	updateRiderAction,
} from '../../action';
import { uploadImgAction } from '../../../common/App';

import RiderInfoPresenter from './presenter';

class RiderInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			isOpen: false,
			showImage: null,
			focusDate: {
				driving: false,
				vehicle: false,
				psv: false,
			},
			id: this.props.match.params.id,
			isUpdate: false,
			file: { img_front_side: null, img_back_side: null, avatar_url: null },
		};
		this.updateAccount = this.updateAccount.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
	}

	componentDidMount() {
		const { dispatch, token } = this.props;

		dispatch(getRiderInfoAction(this.state.id, token)).then(
			([err, data]) =>
				!err &&
				this.setState({
					data: {
						...data,
						identity_card: data.documents.identity_card.id,
						first_name: data.name.first_name,
						last_name: data.name.last_name,
					},
				})
		);
	}

	async updateAccount(e) {
		e.preventDefault();
		const { data } = this.state;
		const { first_name, last_name } = data;
		const { dispatch, token } = this.props;

		const payload = {
			...data,
			name: {
				first_name,
				last_name,
			},
			documents: {
				...data.documents,
				identity_card: {
					...data.documents.identity_card,
					id: data.identity_card,
				},
			},
		};
		dispatch(updateRiderAction(this.state.id, payload, token));
	}

	allowUpdate = e => {
		e.preventDefault();
		this.setState({ isUpdate: true });
	};

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
		const { isUpdate, data, focusDate, isOpen, showImage } = this.state;

		return (
			<RiderInfoPresenter
				data={data}
				isOpen={isOpen}
				showImage={showImage}
				handleZoom={this.handleZoom}
				toggle={this.toggle}
				isUpdate={isUpdate}
				updateAccount={this.updateAccount}
				allowUpdate={this.allowUpdate}
				onChangePicture={this.onChangePicture}
				onChangeInput={this.onChangeInput}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token }),
	dispatch => ({ dispatch })
)(RiderInfo);
