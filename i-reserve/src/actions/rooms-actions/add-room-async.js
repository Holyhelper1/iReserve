import { request } from '../../Utils/request';
import { addRoom } from './add-room';

export const addRoomAsync = (hotelId, roomData) => (dispatch) => {
	return request(`/hotels/${hotelId}/rooms`, 'POST', roomData)
		.then((newRoom) => {
			dispatch(addRoom(newRoom.data));
		})
		.catch((error) => {
			console.error('Error in addRoomAsync:', error);
		});
};
