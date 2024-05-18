import { request } from '../../Utils/request';
import { removeRoom } from './remove-room';

export const removeRoomAsync = (hotelId, id) => (dispatch) => {
	request(`/hotels/${hotelId}/rooms/${id}`, 'DELETE').then(() => {
		dispatch(removeRoom(id));
	});
};
