import { ACTION_TYPE } from '../action-type';

export const setBooking = (booking) => {
	return {
		type: ACTION_TYPE.SET_BOOKING,
		payload: booking,
	};
};
