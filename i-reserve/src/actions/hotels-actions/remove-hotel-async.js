import { request } from '../../Utils/request';

export const removeHotelAsync = (id) => () => request(`/hotels/${id}`, 'DELETE');
