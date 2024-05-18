import { ACTION_TYPE } from '../action-type';

export const openModal = (modalParams) => ({
	type: ACTION_TYPE.OPEN_MODAL,
	payload: modalParams,
});
