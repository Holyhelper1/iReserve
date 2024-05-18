import { ACTION_TYPE } from '../actions';

const initialHotelState = {
	id: '',
	name: '',
	description: '',
	image: '',
	stars: 0,
	createdAt: '',
	rooms: [],
};

export const hotelReducer = (state = initialHotelState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_ROOM:
			return {
				...state,
				rooms: state.rooms.map((room) =>
					room.id === action.payload.id ? action.payload : room,
				),
			};
		case ACTION_TYPE.ADD_ROOM:
			return {
				...state,
				rooms: [...state.rooms, action.payload],
			};
		case ACTION_TYPE.REMOVE_ROOM:
			return {
				...state,
				rooms: state.rooms.filter((room) => room.id !== action.payload),
			};
		case ACTION_TYPE.SET_HOTEL_DATA:
			return {
				...state,
				...action.payload,
			};
		case ACTION_TYPE.RESET_HOTEL_DATA:
			return initialHotelState;
		default:
			return state;
	}
};
