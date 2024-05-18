import { request } from '../../Utils/request';
import { addBooking } from './add-booking';

export const addBookingAsync = (userId, bookingData) => async (dispatch) => {
	  return request(`/users/${userId}/bookings`, 'POST', bookingData)
		.then((newBooking) => {
			dispatch(addBooking(newBooking.data));
		})
		.catch((error) => {
			console.error('Error in addBookingAsync:', error);
		});
};
