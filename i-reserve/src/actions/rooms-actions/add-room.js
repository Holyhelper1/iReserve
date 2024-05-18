import { ACTION_TYPE } from '../action-type';

export const addRoom = (room) => ({
	type: ACTION_TYPE.ADD_ROOM,
	payload: room,
});
