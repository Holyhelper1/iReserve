import { request } from '../../Utils/request';
import { setHotelData } from './set-hotel-data';

export const loadHotelAsync = (hotelId) => async (dispatch) =>
	await request(`/hotels/${hotelId}`).then((hotelData) => {
		if (hotelData.data) {
			dispatch(setHotelData(hotelData.data));
		}
		return hotelData;
	});
