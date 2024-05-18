import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Button, ButtonRed, DatePicker, SuccessMessage } from '../../../../components';
import styles from './booking-row.module.css';
import { convertDate } from '../../../../Utils/convert-date';
import {
	cancelBookingAsync,
	CLOSE_MODAL,
	editBookingAsync,
	openModal,
} from '../../../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../../../../selectors';
import { convertToISODate } from '../../../../Utils/convert-to-ISO.-date';

export const BookingRow = ({ booking, hotelsArray, setReloadBookings }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [editSuccess, setEditSuccess] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	const [datesChanged, setDatesChanged] = useState(false);

	const [isCheckOut, setIsCheckOut] = useState(false);
	const [checkIn, setCheckIn] = useState(null);
	const [checkOut, setCheckOut] = useState(null);
	const [convertCheckInData, setConvertCheckInData] = useState(null);
	const [convertCheckOutData, setConvertCheckOutData] = useState(null);

	const hotel = hotelsArray.find((hotel) => hotel.id === booking.hotelId);
	const room = hotel?.rooms.find((room) => room.id === booking.roomId);
	const roomPrice = room?.price;

	const dispatch = useDispatch();

	const user = useSelector(selectUserData);

	useLayoutEffect(() => {
		const today = new Date();
		const checkoutDate = new Date(booking.checkout);
		setIsCheckOut(checkoutDate > today);
	}, [booking.checkout, booking.checkIn]);

	const onBookingCancel = (id) => {
		dispatch(
			openModal({
				text: 'Are you sure that you want to cancel this booking?',
				onConfirm: () => {
					dispatch(cancelBookingAsync(user.id, id));
					dispatch(CLOSE_MODAL);
					setReloadBookings(true);

					setIsDeleted(true);

					setTimeout(() => {
						setReloadBookings(false);
						setIsDeleted(false);
					}, 3000);
				},
				onCancel: () => dispatch(CLOSE_MODAL),
			}),
		);
	};

	const onBookingEdit = (id) => {
		dispatch(
			editBookingAsync(user.id, id, {
				checkIn: convertCheckInData,
				checkout: convertCheckOutData,
			}),
		).then(() => {
			setCheckIn(null);
			setCheckOut(null);
			setEditSuccess(true);
			setDatesChanged(true);
			setReloadBookings(true);
			setIsEdit(!isEdit);

			setTimeout(() => {
				setEditSuccess(false);
				setDatesChanged(false);
				setReloadBookings(false);
			}, 3000);
		});
	};

	const calculateTotalPrice = () => {
		const checkInDate = new Date(booking.checkIn);
		const checkOutDate = new Date(booking.checkout);
		const diffTime = Math.abs(checkOutDate - checkInDate);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return roomPrice * diffDays;
	};

	useEffect(() => {
		setConvertCheckInData(convertToISODate(checkIn));
		setConvertCheckOutData(convertToISODate(checkOut));
	}, [checkIn, checkOut, datesChanged, booking.checkout, booking.checkIn]);

	const totalPrice = calculateTotalPrice();

	return (
		<div className={styles.booking_row_container}>
			{editSuccess && (
				<div className={styles.edit_success}>
					<SuccessMessage children={'Booking edited successfully!'} />
				</div>
			)}
			{isDeleted && (
				<div className={styles.edit_success}>
					<SuccessMessage
						children={'Booking cancelled! We will wait for you again!'}
					/>
				</div>
			)}
			<div className={styles.booking_buttons_container}>
				{isCheckOut ? (
					<div>
						<Button onClick={() => setIsEdit(!isEdit)}>Edit booking</Button>
						{isEdit && (
							<div className={styles.edit_form}>
								<DatePicker
									onCheckInChange={(date) => setCheckIn(date)}
									onCheckOutChange={(date) => setCheckOut(date)}
								/>
								<Button
									disabled={checkIn === null && checkOut === null}
									onClick={() => {
										onBookingEdit(booking.id);
									}}
								>
									Save
								</Button>
							</div>
						)}
						<ButtonRed onClick={() => onBookingCancel(booking.id)}>
							Cancel reservation
						</ButtonRed>
					</div>
				) : (
					<div className={styles.thank_you_message}>
						<p>
							Thank you for choosing our hotel! We are waiting for you
							again!
						</p>
						<ButtonRed onClick={() => onBookingCancel(booking.id)}>
							Delete history
						</ButtonRed>
					</div>
				)}
			</div>
			<table className={styles.booking_table}>
				<tbody>
					<tr className={styles.booking_row}>
						<td className={styles.booking_row_item} data-label="Hotel name">
							<p>{hotel?.name}</p>
						</td>
						<td className={styles.booking_row_item} data-label="Room name">
							<p>{room?.name}</p>
						</td>
						<td className={styles.booking_row_item} data-label="Room Price">
							<p>${roomPrice}</p>
						</td>
						<td
							className={`${styles.booking_row_item} ${
								datesChanged ? styles.date_changed : ''
							}`}
							data-label="Total Price"
						>
							<p>${isNaN(totalPrice) ? '-' : totalPrice}</p>
						</td>
						<td
							className={`${styles.booking_row_item} ${
								datesChanged ? styles.date_changed : ''
							}`}
							data-label="Check-in"
						>
							<p>{convertDate(booking.checkIn)}</p>
						</td>
						<td
							className={`${styles.booking_row_item} ${
								datesChanged ? styles.date_changed : ''
							}`}
							data-label="Check-out"
						>
							<p>{convertDate(booking.checkout)}</p>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

BookingRow.propTypes = {
	booking: PropTypes.object,
	hotel: PropTypes.object,
	room: PropTypes.object,
	roomPrice: PropTypes.number,
	isCheckOut: PropTypes.bool,
	isEdit: PropTypes.bool,
	setIsEdit: PropTypes.func,
	setReloadBookings: PropTypes.func,
};
