import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Input, Loader } from '../../../../../../../../components';
import { useDispatch } from 'react-redux';
import { editRoomAsync } from '../../../../../../../../actions';

export const EditRoomForm = ({
	setIsEditRoom,
	setEditRoomSuccess,
	roomId,
	hotelId,
	name,
	description,
	price,
	availableRooms,
	image,
}) => {
	const [newRoomName, setNewRoomName] = useState(name);
	const [newRoomDescription, setNewRoomDescription] = useState(description);
	const [newRoomPrice, setNewRoomPrice] = useState(price);
	const [newRoomAvailableRooms, setNewRoomAvailableRooms] = useState(availableRooms);
	const [newRoomImage, setNewRoomImage] = useState(image);
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();

	const onRoomEdit = (hotelId, roomId) => {
		dispatch(
			editRoomAsync(hotelId, roomId, {
				name: newRoomName,
				description: newRoomDescription,
				price: newRoomPrice,
				availableRooms: newRoomAvailableRooms,
				image: newRoomImage,
			}),
		).then(() => {
			setEditRoomSuccess(true);
			setIsEditRoom(false);
			setIsLoading(true);

			setTimeout(() => {
				setEditRoomSuccess(false);
			}, 3000);
		});
	};

	return (
		<div>
			<Input
				type="text"
				placeholder="Room name"
				value={newRoomName}
				onChange={(e) => setNewRoomName(e.target.value)}
			/>
			<Input
				type="text"
				placeholder="Room description"
				value={newRoomDescription}
				onChange={(e) => setNewRoomDescription(e.target.value)}
			/>
			<Input
				type="number"
				placeholder="Room available rooms"
				value={newRoomAvailableRooms}
				onChange={(e) => setNewRoomAvailableRooms(e.target.value)}
			/>
			<Input
				type="text"
				placeholder="Room image"
				value={newRoomImage}
				onChange={(e) => setNewRoomImage(e.target.value)}
			/>
			<Input
				type="number"
				placeholder="Room price"
				value={newRoomPrice}
				onChange={(e) => setNewRoomPrice(e.target.value)}
			/>
			<Button
				disabled={
					newRoomName === '' ||
					newRoomDescription === '' ||
					newRoomPrice === '' ||
					newRoomAvailableRooms === '' ||
					newRoomImage === ''
				}
				onClick={() => onRoomEdit(hotelId, roomId)}
			>
				Confirm the change
			</Button>
			{isLoading && <Loader />}
		</div>
	);
};

EditRoomForm.propTypes = {
	setIsEditRoom: PropTypes.func,
	setEditRoomSuccess: PropTypes.func,
	roomId: PropTypes.string,
	hotelId: PropTypes.string,
	name: PropTypes.string,
	description: PropTypes.string,
	price: PropTypes.number,
	availableRooms: PropTypes.number,
	image: PropTypes.string,
};
