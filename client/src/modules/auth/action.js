import FetchHelper from '../../helpers/FetchHelper.js';
import { api_root } from '../../constants';

import * as appAction from '../common/App';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const loginAction = param => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/auth`, {
		method: 'POST',
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status === 200) {
			dispatch({ type: LOGIN_SUCCESS, data });
			window.location.href = '?#/';
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
		}
		dispatch(appAction.fetchingFinishAction());
	});
};

export const LOGOUT = 'LOGOUT';
export const logoutAction = () => ({ type: LOGOUT });

export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const refreshTokenAction = data => ({ type: REFRESH_TOKEN, data });

export const forgotPasswordAction = (param) => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/auth/forgotPassword`, {
		method: 'POST',
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Password reset link is sent to your registered email address' },
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

export const setPasswordAction = (param) => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/auth/setPassword`, {
		method: 'POST',
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Password changed successfully' },
					type: 'success',
				})
			);
			window.location.href = '?#/';
			// dispatch({ type: ADD_ACCOUNT_ADMIN_SUCCESS, data });
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
		}
		dispatch(appAction.fetchingFinishAction());
	});
};
