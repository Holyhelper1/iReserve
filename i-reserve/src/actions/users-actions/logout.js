import { request } from '../../Utils/request';
import { ACTION_TYPE } from '../action-type';

export const logout = () => {
	request('/logout', 'POST');
	return {
		type: ACTION_TYPE.LOGOUT,
		payload: {},
	};
};
