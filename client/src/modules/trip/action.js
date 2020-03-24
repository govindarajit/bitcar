import FetchHelper from '../../helpers/FetchHelper.js';
import { api_root } from '../../constants';

import * as appAction from '../common/App';

export const getNowBookings = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/trip/getNowTrips?${queryString}`, {
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

export const getLaterBookings = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/trip/getLaterTrips?${queryString}`, {
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

export const getHistoryBookings = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/trip/getHistoryTrips?${queryString}`, {
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

export const getTripInfoAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/trip/getTripInfo`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({id: id}),
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