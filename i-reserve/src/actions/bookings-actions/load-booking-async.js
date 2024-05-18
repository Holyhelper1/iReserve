import { request } from '../../Utils/request';
import { setBooking } from './set-booking';

export const loadBookingAsync = (userId, page, limit) => async (dispatch) => {
	const url = `/users/${userId}/bookings?page=${page}&limit=${limit}`;
	const bookingData = await request(url);

	if (bookingData.data) {
		dispatch(setBooking(bookingData.data.bookings));
		return {
			data: {
				bookings: bookingData.data.bookings,
				lastPage: bookingData.data.lastPage,
			},
		};
	}

	return bookingData;
};
