
import { request } from '../../Utils/request';
import { setUser } from './set-user';

export const editUserAsync = (userId,  newUserData) => async (dispatch) =>
	 await request(`/users/${userId}`, 'PATCH', newUserData).then((newUserData) => {
		if (newUserData.data) {
			dispatch(setUser(newUserData.data));
		}
		return newUserData;
	});
