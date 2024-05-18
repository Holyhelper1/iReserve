import { ACTION_TYPE } from '../action-type';

export const setHotelData = (hotelData) => ({
	type: ACTION_TYPE.SET_HOTEL_DATA,
	payload: hotelData,
});
