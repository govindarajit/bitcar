import FetchHelper from '../../helpers/FetchHelper.js';
import { api_root } from '../../constants';

import * as appAction from '../common/App';

// export const ADD_ACCOUNT_ADMIN_SUCCESS = 'ADD_ACCOUNT_ADMIN_SUCCESS';

export const addDriverAction = (param, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/drivers`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Succesfully Added Driver.' },
					type: 'success',
				})
			);
			// dispatch({ type: ADD_ACCOUNT_ADMIN_SUCCESS, data });
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
		}
		dispatch(appAction.fetchingFinishAction());
	});
};

// export const GET_ACCOUNT_ADMIN_SUCCESS = 'ADD_ACCOUNT_ADMIN_SUCCESS';

export const getDriverAction = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/drivers?${queryString}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());

		if (status >= 200 && status < 300) {
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

export const getDriverInfoAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/drivers/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());
		if (status >= 200 && status < 300) {
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

// export const lockOrUnlockAccountAdminAction = (id, token, method) => dispatch => {
// 	dispatch(appAction.fetchingAction());
// 	return FetchHelper.fetch(`${api_root}/admins/${id}`, {
// 		method: method,
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 		},
// 	}).then(([data, status]) => {
// 		dispatch(appAction.fetchingFinishAction());
// 		if (status === 200) {
// 			return [false, data];
// 		} else {
// 			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
// 			return [true, data];
// 		}
// 	});
// };

export const updateDriverAction = (id, data, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/drivers/${id}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Successfully Updated Driver.' },
					type: 'success',
				})
			);
			window.location.href = '?#/driver/list';
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

export const verifyDriverAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/drivers/verifyDriver`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({id: id}),
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Successfully Verified Driver.' },
					type: 'success',
				})
			);
			window.location.href = '?#/driver/list';
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

export const deleteDriverAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/drivers/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());
		if (status >= 200 && status < 300) {
			window.location.href = '?#/driver/list';
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};
