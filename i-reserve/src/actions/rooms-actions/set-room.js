import { ACTION_TYPE } from '../action-type';

export const setRoom = (room) => {
	return {
		type: ACTION_TYPE.SET_ROOM,
		payload: room,
	};
};
