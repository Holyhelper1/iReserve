import { ACTION_TYPE } from '../action-type';

export const CANCEL_BOOKING = (bookingId) => ({
	type: ACTION_TYPE.CANCEL_BOOKING,
	payload: bookingId,
});
