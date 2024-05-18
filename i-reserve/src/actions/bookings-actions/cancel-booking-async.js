import { request } from '../../Utils/request';
import { CANCEL_BOOKING } from './cancel-booking';

export const cancelBookingAsync = (userId, id) => (dispatch) => {
	request(`/users/${userId}/bookings/${id}`, 'DELETE').then(() => {
		dispatch(CANCEL_BOOKING(id));
	});
};
