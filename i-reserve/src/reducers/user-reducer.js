import { ACTION_TYPE } from '../actions';
import { ROLE } from '../constants';

const initialUserState = {
	id: '',
	name: '',
	login: null,
	password: null,
	role: ROLE.GUEST,
	bookingHistory: [],
	avatar: '',
};

export const userReducer = (state = initialUserState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_BOOKING:
			return {
				...state,
				bookingHistory: [...state.bookingHistory, action.payload],
			};
		case ACTION_TYPE.ADD_BOOKING:
			return {
				...state,
				bookingHistory: [...state.bookingHistory, action.payload],
			};
		case ACTION_TYPE.CANCEL_BOOKING:
			return {
				...state,
				bookingHistory: state.bookingHistory.filter(
					(booking) => booking.id !== action.payload,
				),
			};
		case ACTION_TYPE.SET_USER:
			return {
				...state,
				...action.payload,
			};
		case ACTION_TYPE.LOGOUT:
			return initialUserState;

		default:
			return state;
	}
};
