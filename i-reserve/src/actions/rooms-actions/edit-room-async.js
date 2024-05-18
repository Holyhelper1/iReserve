import { request } from '../../Utils/request';
import { setRoom } from './set-room';

export const editRoomAsync = (hotelId, roomId, newRoomData) => async (dispatch) => {
	const response = await request(
		`/hotels/${hotelId}/rooms/${roomId}`,
		'PATCH',
		newRoomData,
	);
	if (response.data) {
		dispatch(setRoom(response.data));
	}
	return response;
};
