import PropTypes from 'prop-types';
import {
	Button,
	ButtonRed,
	DatePicker,
	SuccessMessage,
} from '../../../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
	openModal,
	CLOSE_MODAL,
	removeRoomAsync,
	addBookingAsync,
} from '../../../../../../actions';
import { ROLE } from '../../../../../../constants';
import { selectUserData, selectUserRole } from '../../../../../../selectors';
import styles from './room.module.css';
import { useEffect, useState } from 'react';
import { convertToISODate } from '../../../../../../Utils/convert-to-ISO.-date';
import { EditRoomForm } from './components/edit-room-form/edit-room-form';

export const Room = ({ id, hotel, name, description, availableRooms, image, price }) => {
	const [isAvailableRoom, setIsAvailableRoom] = useState(false);
	const [checkIn, setCheckIn] = useState(null);
	const [checkOut, setCheckOut] = useState(null);
	const [convertCheckInData, setConvertCheckInData] = useState(null);
	const [convertCheckOutData, setConvertCheckOutData] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [successBooked, setSuccessBooked] = useState(false);
	const [isEditRoom, setIsEditRoom] = useState(false);
	const [editRoomSuccess, setEditRoomSuccess] = useState(false);

	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);

	const user = useSelector(selectUserData);

	const handleImageClick = () => {
		setSelectedImage(image);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedImage(null);
	};

	const onBookRoom = (userId, bookingData) => {
		dispatch(
			openModal({
				text: 'Are you sure that you want to book this room?',
				onConfirm: () => {
					dispatch(addBookingAsync(userId, bookingData));
					dispatch(CLOSE_MODAL);
					setSuccessBooked(true);
					setTimeout(() => setSuccessBooked(false), 3000);
				},
				onCancel: () => dispatch(CLOSE_MODAL),
			}),
		);
	};

	useEffect(() => {
		if (availableRooms === 0 && isAvailableRoom === false) {
			setIsAvailableRoom(true);
		}
		setConvertCheckInData(convertToISODate(checkIn));
		setConvertCheckOutData(convertToISODate(checkOut));
	}, [isAvailableRoom, availableRooms, checkIn, checkOut, isEditRoom, hotel]);

	const onRoomRemove = (id) => {
		dispatch(
			openModal({
				text: 'Are you sure that you want to delete this room?',
				onConfirm: () => {
					dispatch(removeRoomAsync(hotel, id));
					dispatch(CLOSE_MODAL);
				},
				onCancel: () => dispatch(CLOSE_MODAL),
			}),
		);
	};

	const isAdminOrModerator = [ROLE.ADMIN, ROLE.MODERATOR].includes(userRole);

	return (
		<>
			{isAvailableRoom ? (
				<div>There is no available {name} rooms at this time</div>
			) : (
				<div className={styles.room_container}>
					<div>
						<div className={styles.room_info}>
							<div className={styles.room_date_picker_box}>
								<div>
									<DatePicker
										onCheckInChange={(date) => setCheckIn(date)}
										onCheckOutChange={(date) => setCheckOut(date)}
									/>
								</div>
							</div>
							<Button
								disabled={
									user.login === null ||
									user.login === undefined ||
									checkIn === null ||
									checkOut === null
								}
								onClick={() =>
									onBookRoom(user.id, {
										hotelId: hotel,
										roomId: id,
										checkIn: convertCheckInData,
										checkout: convertCheckOutData,
										userId: user.id,
									})
								}
							>
								Book this room
							</Button>
							{successBooked && (
								<SuccessMessage children={'Room successfully booked'} />
							)}
						</div>
						<div className={styles.information_panel}>
							<div>
								<div className={styles.room_name_box}>
									<div className={styles.room_name}>{name}</div>
									{(user.login === null ||
										user.login === undefined) && (
										<div className={styles.login_text}>
											Please log in to book a room
										</div>
									)}
									{(checkIn === null || checkOut === null) && (
										<div className={styles.login_text}>
											Please select check-in and check-out dates to
											book a room
										</div>
									)}
								</div>
								<img
									className={styles.room_image}
									src={image}
									alt="room"
									onClick={handleImageClick}
								/>
							</div>
							<div>
								<div className={styles.room_description}>
									{description}
								</div>
							</div>
						</div>
						<div className={styles.room_info}>
							<div>Avalible Rooms: {availableRooms}</div>

							<div>Price: {price}$ p/n</div>
						</div>
					</div>

					{isAdminOrModerator && (
						<div className={styles.room_controls_box}>
							<Button onClick={() => setIsEditRoom(!isEditRoom)}>
								Edit Room
							</Button>
							<ButtonRed onClick={() => onRoomRemove(id)}>
								Remove Room
							</ButtonRed>
						</div>
					)}
					{editRoomSuccess && <SuccessMessage children={'Edit success'} />}
					{isEditRoom && (
						<EditRoomForm
							setIsEditRoom={setIsEditRoom}
							setEditRoomSuccess={setEditRoomSuccess}
							roomId={id}
							hotelId={hotel}
							name={name}
							description={description}
							price={price}
							availableRooms={availableRooms}
							image={image}
						/>
					)}
				</div>
			)}
			{showModal && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<span className={styles.closeButton} onClick={handleCloseModal}>
							&times;
						</span>
						<img
							className={styles.modalImage}
							src={selectedImage}
							alt="enlarged"
						/>
					</div>
				</div>
			)}
		</>
	);
};

Room.prototypes = {
	id: PropTypes.number,
	hotel: PropTypes.number,
	name: PropTypes.string,
	description: PropTypes.string,
	price: PropTypes.number,
	availableRooms: PropTypes.number,
	image: PropTypes.string,
};
