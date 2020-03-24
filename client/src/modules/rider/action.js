import FetchHelper from '../../helpers/FetchHelper.js';
import { api_root } from '../../constants';

import * as appAction from '../common/App';

// export const ADD_ACCOUNT_ADMIN_SUCCESS = 'ADD_ACCOUNT_ADMIN_SUCCESS';

export const addRiderAction = (param, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/riders`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Succesfully Added Rider.' },
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

export const getRiderAction = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/riders?${queryString}`, {
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

export const getRiderInfoAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/riders/${id}`, {
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

export const updateRiderAction = (id, data, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/riders/${id}`, {
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
					data: { message: 'Successfully Updated Rider.' },
					type: 'success',
				})
			);
			window.location.href = '?#/rider/list';
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

export const deleteRiderAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/riders/${id}`, {
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
