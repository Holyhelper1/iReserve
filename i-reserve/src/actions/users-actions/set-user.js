import { ACTION_TYPE } from '../action-type';

export const setUser = (user) => {
	return {
		type: ACTION_TYPE.SET_USER,
		payload: user,
	};
};
