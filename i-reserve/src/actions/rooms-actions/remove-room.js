import { ACTION_TYPE } from '../action-type';

export const removeRoom = (roomId) => ({
	type: ACTION_TYPE.REMOVE_ROOM,
	payload: roomId,
});
