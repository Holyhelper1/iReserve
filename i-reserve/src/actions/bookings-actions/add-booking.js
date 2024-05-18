import { ACTION_TYPE } from '../action-type';

export const addBooking = (booking) => ({
	type: ACTION_TYPE.ADD_BOOKING,
	payload: booking,
});
