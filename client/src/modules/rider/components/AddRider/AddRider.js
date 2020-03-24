import React, { Component } from 'react';

import { connect } from 'react-redux';
import { addDriverAction } from '../../action';
import { uploadImgAction } from '../../../common/App';

import AddRiderPresenter from './presenter';

class AddRider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				full_name: '',
				email: '',
				phone_number: '',
				phone_number_1: '',
				street: '',
				id: '',
				img_front_side: '',
				img_back_side: '',
				note: '',
				avatar_url: 'https://gravatar.com/avatar/68f5f844896ee7a4626da5678045ec26?s=512&d=retro', // email: '', // avatar_url: '', // full_name: '',
				// phone_number: '',
				// street: '',
				province: 'Đồng Nai', // img_back_side: '', // img_front_side: '', // id: '',
				// note: '',
				driving_license: 'B1',
			},
			file: { img_front_side: null, img_back_side: null, avatar_url: null },
		};
		this.uploadImg = this.uploadImg.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChangeInput = ({ target }) => {
		const { data } = this.state;
		data[target.name] = target.value;
		this.setState({ data });
	};

	onChangeImage = ({ target }) => {
		const { data, file } = this.state;
		data[target.name] = window.URL.createObjectURL(target.files[0]);
		file[target.name] = target.files[0];
		this.setState({ data, file });
	};

	async uploadImg(name) {
		const { token, dispatch } = this.props;
		const { file, data } = this.state;
		return dispatch(uploadImgAction(file[name], token)).then(([success, res]) => {
			if (success) {
				data[name] = res.fileQuality.original.url;
			}
			return success;
		});
	}

	async onSubmit(e) {
		e.preventDefault();
		const { data, file } = this.state;
		const { full_name, email, phone_number, street, province, driving_license, id, note, phone_number_1 } = data;
		const { img_front_side, img_back_side } = file;

		if (file.avatar_url) {
			const successUploadAvatar = await this.uploadImg('avatar_url');
		}

		const successUploadFrontSide = await this.uploadImg('img_front_side');
		const successUploadBackSide = await this.uploadImg('img_back_side');

		if (successUploadFrontSide && successUploadBackSide) {
			const payload = {
				picture: data.avatar_url,
				name: { full_name },
				email,
				phone_number,
				address: { street, province },
				passport: {
					id,
					img_front_side: data.img_front_side,
					img_back_side: data.img_back_side,
				},
				note,
				driving_license,
			}; // default must be change
			if (phone_number_1) {
				payload.phone_number_1 = phone_number_1;
			}
			this.props.dispatch(addDriverAction(payload, this.props.token));
		}
	}

	render() {
		return (
			<AddRiderPresenter
				onChangeInput={this.onChangeInput}
				data={this.state.data}
				onSubmit={this.onSubmit}
				onChangeImage={this.onChangeImage}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token }),
	dispatch => ({ dispatch })
)(AddRider);
