import { request } from '../../Utils/request';
import { setHotelData } from './set-hotel-data';

export const saveHotelAsync = (id, newHotelData) => (dispatch) => {
	const saveRequest = id
		? request(`/hotels/${id}`, 'PATCH', newHotelData)
		: request(`/hotels`, 'POST', newHotelData);

	return saveRequest.then((updatedHotel) => {
		dispatch(setHotelData(updatedHotel.data));

		return updatedHotel.data;
	});
};
