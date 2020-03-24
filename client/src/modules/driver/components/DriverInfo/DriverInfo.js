import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import {
	getDriverInfoAction,
	// lockOrUnlockAccountAdminAction,
	updateDriverAction,
	deleteDriverAction,
	verifyDriverAction
} from '../../action';
import { uploadImgAction } from '../../../common/App';

import DriverInfoPresenter from './presenter';

class DriverInfo extends Component {
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
		this.verifyDriver = this.verifyDriver.bind(this);
	}

	componentDidMount() {
		const { dispatch, token } = this.props;

		dispatch(getDriverInfoAction(this.state.id, token)).then(
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

	// lockAccount = () => {
	// 	const { dispatch, token } = this.props;

	// 	dispatch(lockOrUnlockAccountAdminAction(this.state.id, token, 'block')).then(
	// 		([err]) => !err && this.setState({ isBlocked: true })
	// 	);
	// };

	// unLockAccount = () => {
	// 	const { dispatch, token } = this.props;

	// 	dispatch(lockOrUnlockAccountAdminAction(this.state.id, token, 'unblock')).then(
	// 		([err]) => !err && this.setState({ isBlocked: false })
	// 	);
	// };

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
		dispatch(updateDriverAction(this.state.id, payload, token));
	}

	async verifyDriver(e) {
		const { dispatch, token } = this.props;
		e.preventDefault();
		dispatch(verifyDriverAction(this.state.id, token));
	}	

	deleteAccount = () => {
		const { dispatch, token } = this.props;
		dispatch(deleteDriverAction(this.state.id, token));
	};

	allowUpdate = e => {
		e.preventDefault();
		this.setState({ isUpdate: true });
	};

	onChangeInput = ({ target }) => {
		const { data } = this.state;
		data[target.name] = target.value;
		this.setState({ data });
	};

	onChangeInputDocuments = obj => ({ target }) => {
		const { data } = this.state;
		const objDt = data.documents[obj];
		objDt[target.name] = target.value;

		this.setState({
			data: {
				...data,
				documents: {
					...data.documents,
					[obj]: objDt,
				},
			},
		});
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

	onChangePictureReport = (obj = '') => async ({ target }) => {
		const { data } = this.state;
		const { reports } = data.documents;
		const objDt = reports[obj];

		const [success, res] = await this.uploadImg(target.files[0]);
		if (success) {
			objDt[target.name] = res.url;
			const newReports = {
				...reports,
				[obj]: objDt,
			};
			this.setState({
				data: {
					...data,
					documents: {
						...data.documents,
						reports: newReports,
					},
				},
			});
		}
	};

	onChangePictureArr = (obj, idx) => async ({ target }) => {
		const { data } = this.state;
		const objDt = data.documents[obj];

		const [success, res] = await this.uploadImg(target.files[0]);
		if (success) {
			if (objDt.images[idx]) {
				objDt.images[idx] = res.url;
			} else {
				objDt.images.push(res.url);
			}

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

	onChangeFocusDate = name => ({ focused }) => {
		if(focused){
			const focusDate = this.state;
			focusDate[name] = focused;
			this.setState({ focusDate });
		}
	};

	onChangeDate = (obj, field, name) => date => {
		const { data } = this.state;
		const objDt = {
			...data.documents[obj],
			[field]: moment(date)
				.format('YYYY-MM-DD')
				.toString(),
		};

		this.setState({
			data: {
				...data,
				documents: {
					...data.documents,
					[obj]: objDt,
				},
			},
		});

		const focusDate = this.state;
		focusDate[name] = false;
		this.setState({ focusDate });
	};

	renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<div>
				<select value={month.month()} onChange={e => onMonthSelect(month, e.target.value)}>
					{moment.months().map((label, value) => (
						<option value={value}>{label}</option>
					))}
				</select>
			</div>
			<div>
				<select value={month.year()} onChange={e => onYearSelect(month, e.target.value)}>
					<option value={moment().year() - 1}>Last year</option>
					<option value={moment().year()}>{moment().year()}</option>
					<option value={moment().year() + 1}>Next year</option>
				</select>
			</div>
		</div>
	);

	toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

	handleZoom = image => () =>
		this.setState(({ isOpen }) => ({
			showImage: image,
			isOpen: !isOpen,
		}));

	render() {
		const { isUpdate, data, focusDate, isOpen, showImage } = this.state;

		return (
			<DriverInfoPresenter
				data={data}
				isOpen={isOpen}
				showImage={showImage}
				handleZoom={this.handleZoom}
				toggle={this.toggle}
				focusDate={focusDate}
				isUpdate={isUpdate}
				onChangeFocusDate={this.onChangeFocusDate}
				// lockAccount={this.lockAccount}
				onChangeDate={this.onChangeDate}
				// unLockAccount={this.unLockAccount}
				updateAccount={this.updateAccount}
				deleteAccount={this.deleteAccount}
				allowUpdate={this.allowUpdate}
				onChangePicture={this.onChangePicture}
				onChangePictureReport={this.onChangePictureReport}
				onChangePictureArr={this.onChangePictureArr}
				onChangeInput={this.onChangeInput}
				onChangeInputDocuments={this.onChangeInputDocuments}
				verifyDriver={this.verifyDriver}
			/>
		);
	}
}

export default connect(
	state => ({ token: state.auth.token }),
	dispatch => ({ dispatch })
)(DriverInfo);
