import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from '../booking-list.module.css';
import { Button } from '../../../../../components';

export const FilterRooms = ({ everyHotelsInfo, startDate, endDate }) => {
	const [showAvailableRooms, setShowAvailableRooms] = useState(false);

	const getAvailableRooms = () => {
		const availableRooms = [];

		everyHotelsInfo.forEach((hotel) => {
			if (hotel && hotel.rooms) {
				hotel.rooms.forEach((room) => {
					const roomBookings = room.bookings || [];
					const isAvailable = !roomBookings.some(
						(booking) =>
							new Date(booking.checkIn) <= new Date(endDate) &&
							new Date(booking.checkout) > new Date(startDate),
					);

					if (isAvailable) {
						availableRooms.push({
							hotelName: hotel.name,
							roomName: room.name,
							availableRooms: room.availableRooms,
							price: room.price,
						});
					}
				});
			}
		});

		return availableRooms;
	};

	const handleToggleAvailableRooms = () => {
		setShowAvailableRooms(!showAvailableRooms);
	};

	const availableRooms = showAvailableRooms ? getAvailableRooms() : [];

	return (
		<div>
			<Button onClick={handleToggleAvailableRooms} className={styles.button}>
				{showAvailableRooms ? 'Hide Available Rooms' : 'Show Available Rooms'}
			</Button>
			{showAvailableRooms && (
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Hotel Name</th>
							<th>Room Name</th>
							<th>Available Rooms</th>
							<th>Price</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{availableRooms.map((room, index) => (
							<tr key={index} className={styles.availableRow}>
								<td>{room.hotelName}</td>
								<td>{room.roomName}</td>
								<td>{room.availableRooms}</td>
								<td>${room.price}</td>
								<td>
									<span
										className={`${styles.status} ${styles.availableStatus}`}
									>
										Available
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

FilterRooms.propTypes = {
	everyHotelsInfo: PropTypes.array.isRequired,
	startDate: PropTypes.instanceOf(Date).isRequired,
	endDate: PropTypes.instanceOf(Date).isRequired,
};
