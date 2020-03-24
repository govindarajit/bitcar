import { GET_ACCOUNT_ADMIN_SUCCESS } from './action';

const initialState = {
	accountAdmin: {
		list: [],
	},
};

export default function auth(state = initialState, action) {
	switch (action.type) {
		case GET_ACCOUNT_ADMIN_SUCCESS:
			return { ...state, accountAdmin: action.data };
		// case LOGOUT:
		// 	return {};
		default:
			return state;
	}
}
