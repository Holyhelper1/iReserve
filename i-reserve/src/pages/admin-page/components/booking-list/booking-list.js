import PropTypes from 'prop-types';
import React from 'react';
import styles from './booking-list.module.css';
import { convertDate } from '../../../../Utils/convert-date';
import { FilterRooms } from './filter-rooms/filter-rooms';

export const BookingList = ({ usersInfo, everyHotelsInfo, startDate, endDate }) => {
	const getBookedRooms = (userId) => {
		const userBookings =
			usersInfo.find((user) => user.id === userId)?.bookingHistory || [];

		return userBookings.filter(
			(booking) =>
				new Date(booking.checkIn) <= new Date(endDate) &&
				new Date(booking.checkout) > new Date(startDate),
		);
	};

	const getUsersWithBookings = () => {
		return usersInfo.filter((user) => getBookedRooms(user.id).length > 0);
	};

	const getRoomInfo = (userId, roomId) => {
		const userBookings = getBookedRooms(userId);
		const booking = userBookings.find((b) => b.roomId === roomId);

		const hotel = everyHotelsInfo.find((h) => h.rooms.some((r) => r.id === roomId));
		const room = hotel?.rooms.find((r) => r.id === roomId);

		return {
			hotelName: hotel?.name || '',
			roomName: room?.name || '',
			availableRooms: room?.availableRooms || 0,
			price: room?.price || 0,
			isBooked: !!booking,
			bookedByUser: usersInfo.find((u) => u.id === userId)?.name || '',
			checkIn: booking?.checkIn || 'Free for booking',
			checkout: booking?.checkout || 'Free for booking',
		};
	};

	const rooms = getUsersWithBookings().flatMap((user) =>
		getBookedRooms(user.id).map((booking) => getRoomInfo(user.id, booking.roomId)),
	);

	return (
		<div className={styles.container}>
			<h3 className={styles.heading}>Reservations list:</h3>
			<FilterRooms
				everyHotelsInfo={everyHotelsInfo}
				startDate={startDate}
				endDate={endDate}
			/>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Hotel Name</th>
						<th>Room name</th>
						<th>Available rooms</th>
						<th>Price</th>
						<th>Booked by client</th>
						<th>Check in</th>
						<th>Check out</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{rooms.map((room, index) => (
						<tr
							key={`${room.hotelName}-${room.roomName}-${index}`}
							className={`${styles.row} ${
								room.isBooked ? styles.bookedRow : styles.availableRow
							}`}
						>
							<td>{room.hotelName}</td>
							<td>{room.roomName}</td>
							<td>{room.availableRooms}</td>
							<td>${room.price}</td>
							<td>{room.bookedByUser}</td>
							<td>
								{room.checkIn === 'Free for booking'
									? room.checkIn
									: convertDate(room.checkIn)}
							</td>
							<td>
								{room.checkout === 'Free for booking'
									? room.checkout
									: convertDate(room.checkout)}
							</td>
							<td>
								<span
									className={`${styles.status} ${
										room.isBooked
											? styles.bookedStatus
											: styles.availableStatus
									}`}
								>
									{room.isBooked ? 'Booked' : 'Available'}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};


BookingList.prototypes = {
	usersInfo: PropTypes.array.isRequired,
	everyHotelsInfo: PropTypes.array.isRequired,
	startDate: PropTypes.string.isRequired,
	endDate: PropTypes.string.isRequired,
};
