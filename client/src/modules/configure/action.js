import FetchHelper from '../../helpers/FetchHelper.js';
import { api_root } from '../../constants';

import * as appAction from '../common/App';

export const addVehicleTypeAction = (param, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/configure/vehicle/addVehicleType`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Succesfully Added Vehicle Type.' },
					type: 'success',
				})
			);
			window.location.href = '?#/configure/vehicles';
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
		}
		dispatch(appAction.fetchingFinishAction());
	});
};

export const getVehicleTypeListAction = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/configure/vehicle/getVehicleType?${queryString}`, {
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

export const getVehicleTypeAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/vehicle/getSingleVehicleType`, {
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

export const updateVehicleTypeAction = ( data, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/vehicle/updateVehicleType`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Successfully Updated Vehicle Type.' },
					type: 'success',
				})
			);
			window.location.href = '?#/configure/vehicles';
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

export const deleteVehicleTypeAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/vehicle/deleteVehicleType`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(id),
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

export const addVehicleModelAction = (param, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/configure/vehicle/addVehicleModel`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Succesfully Added Vehicle Model.' },
					type: 'success',
				})
			);
			window.location.href = '?#/configure/vehicles';
			setTimeout(()=>{
				document.getElementById('navBar').children[1].children[0].click()
			},200)
			
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
		}
		dispatch(appAction.fetchingFinishAction());
	});
};

export const getVehicleModelListAction = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/configure/vehicle/getVehicleModel?${queryString}`, {
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

export const getVehicleModelAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/vehicle/getSingleVehicleModel`, {
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

export const updateVehicleModelAction = ( data, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/vehicle/updateVehicleModel`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Successfully Updated Vehicle Model.' },
					type: 'success',
				})
			);
			window.location.href = '?#/configure/vehicles';
			setTimeout(()=>{
				document.getElementById('navBar').children[1].children[0].click()
			},200)
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

export const deleteVehicleModelAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/vehicle/deleteVehicleModel`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(id),
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

export const addCountriesAction = (param, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/configure/regions/addCountries`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Succesfully Added Country.' },
					type: 'success',
				})
			);
			window.location.href = '?#/configure/regions';
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
		}
		dispatch(appAction.fetchingFinishAction());
	});
};

export const getCountriesListAction = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/configure/regions/getCountries?${queryString}`, {
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

export const getSingleCountriesAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/regions/getSingleCountries`, {
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

export const updateCountriesAction = ( data, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/regions/updateCountries`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Successfully Updated Country.' },
					type: 'success',
				})
			);
			window.location.href = '?#/configure/regions';
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

export const deleteCountriesAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/regions/deleteCountries`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(id),
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

export const addCitiesAction = (param, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	FetchHelper.fetch(`${api_root}/configure/regions/addCities`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(param),
	}).then(([data, status]) => {
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Succesfully Added City.' },
					type: 'success',
				})
			);
			window.location.href = '?#/configure/regions';
			setTimeout(()=>{
				document.getElementById('navBar').children[1].children[0].click()
			},200)
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
		}
		dispatch(appAction.fetchingFinishAction());
	});
};

export const getCitiesListAction = (params, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	const queryString = Object.entries(params)
		.map(item => `${item[0]}=${item[1]}`)
		.join('&');
	return FetchHelper.fetch(`${api_root}/configure/regions/getCities?${queryString}`, {
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

export const getSingleCitiesAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/regions/getSingleCities`, {
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

export const updateCitiesAction = ( data, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/regions/updateCities`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	}).then(([data, status]) => {
		dispatch(appAction.fetchingFinishAction());
		if (status >= 200 && status < 300) {
			dispatch(
				appAction.newNotifyAction({
					data: { message: 'Successfully Updated City.' },
					type: 'success',
				})
			);
			window.location.href = '?#/configure/regions';
			setTimeout(()=>{
				document.getElementById('navBar').children[1].children[0].click()
			},200)
			return [false, data];
		} else {
			dispatch(appAction.newNotifyAction({ data, type: 'error' }));
			return [true, data];
		}
	});
};

export const deleteCitiesAction = (id, token) => dispatch => {
	dispatch(appAction.fetchingAction());
	return FetchHelper.fetch(`${api_root}/configure/regions/deleteCities`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(id),
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