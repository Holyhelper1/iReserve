import { request } from '../../Utils/request';
import { setBooking } from './set-booking';

export const editBookingAsync = (userId, bookingId, newBookingData) => async (dispatch) =>
	await request(`/users/${userId}/bookings/${bookingId}`, 'PATCH', newBookingData).then(
		(newBookingData) => {
			if (newBookingData.data) {
				dispatch(setBooking(newBookingData.data));
			}
			return newBookingData;
		},
	);
