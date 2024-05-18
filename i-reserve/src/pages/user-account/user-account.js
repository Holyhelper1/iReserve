import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '../../selectors';
import { useState, useEffect, useCallback } from 'react';
import styles from './user-account.module.css';
import { Button, H2, Input, PrivateContent } from '../../components';
import {
	editUserAsync,
	loadBookingAsync,
	loadHotelAsync,
	loadUserAsync,
} from '../../actions';
import { BookingRow } from './components';
import { Link } from 'react-router-dom';
import { ROLE } from '../../constants';

export const UserAccount = () => {
	const [userInfo, setUserInfo] = useState([]);
	const [bookingInfo, setBookingInfo] = useState({});
	const [hotelsArray, setHotelsArray] = useState([]);
	const [noAvatar, setNoAvatar] = useState(false);
	const [error, setError] = useState(null);
	const [hotelError, setHotelError] = useState(null);
	const [editAvatar, setEditAvatar] = useState(false);
	const [editName, setEditName] = useState(false);
	const [newAvatar, setNewAvatar] = useState('');
	const [newName, setNewName] = useState('');
	const [reloadBookings, setReloadBookings] = useState(false);

	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [limit, setLimit] = useState(5);

	const user = useSelector(selectUserData);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadUserAsync(user.id)).then((userData) => {
			if (userData.data) {
				setUserInfo(userData.data);
			}
		});
	}, [dispatch, user.id]);

	useEffect(() => {
		if (user.id && !reloadBookings) {
			dispatch(loadBookingAsync(user.id, page, limit)).then((bookingData) => {
				setLastPage(bookingData.data.lastPage);
				setError(bookingData.error);

				setBookingInfo(bookingData.data);
			});
		}

		setNoAvatar(!user.avatar || user.avatar === '');
	}, [dispatch, user.id, user.avatar, page, limit, reloadBookings]);

	useEffect(() => {
		const fetchHotels = async () => {
			if (bookingInfo.bookings && bookingInfo.bookings.length > 0) {
				const hotelsData = await Promise.all(
					bookingInfo.bookings.map(async (booking) => {
						const hotelData = await dispatch(loadHotelAsync(booking.hotelId));
						return hotelData.data;
					}),
				);
				setHotelsArray(hotelsData);
				setHotelError(null);
			}
		};

		fetchHotels().catch((error) => {
			setHotelError(error);
		});
	}, [dispatch, bookingInfo.bookings]);

	const onUserDataChange = (userId, { newUserData }) => {
		dispatch(editUserAsync(userId, newUserData)).then((newUserData) => {
			if (newUserData.data) {
				setUserInfo(newUserData.data);
			}
		});
	};

	const handlePageChange = useCallback((newPage) => {
		setPage(newPage);
	}, []); 

	return (
		<>
			<PrivateContent
				access={[ROLE.ADMIN, ROLE.MODERATOR, ROLE.CLIENT]}
				serverError={error || hotelError}
			>
				<div className={styles.user_account}>
					<div className={styles.user_account_container}>
						<div
							className={styles.user_avatar_edit}
							onClick={() => {
								setEditAvatar(!editAvatar);
							}}
						>
							📷
						</div>

						{editAvatar && (
							<>
								<Input
									type="url"
									name="avatar"
									placeholder="Upload image url"
									onChange={(e) => setNewAvatar(e.target.value)}
								/>
								<div>
									<Button
										disabled={!newAvatar}
										onClick={() => {
											setEditAvatar(!editAvatar);
											onUserDataChange(user.id, {
												newUserData: { avatar: newAvatar },
											});
										}}
									>
										💾 Save
									</Button>
								</div>
							</>
						)}

						<div className={styles.user_avatar_wrapper}>
							{noAvatar ? (
								<img
									className={styles.user_avatar}
									src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
									alt="user alt avatar"
								/>
							) : (
								<img
									className={styles.user_avatar}
									src={userInfo.avatar}
									alt="user avatar"
								/>
							)}
						</div>
						<div
							className={styles.user_avatar_edit}
							onClick={() => {
								setEditName(!editName);
							}}
						>
							✏️
						</div>
						{editName && (
							<>
								<Input
									type="text"
									name="name"
									placeholder="Add new name"
									value={newName}
									onChange={(e) => setNewName(e.target.value)}
								/>
								<div>
									<Button
										disabled={!newName}
										onClick={() => {
											setEditName(!editName);
											onUserDataChange(user.id, {
												newUserData: { name: newName },
											});
										}}
									>
										💾 Save
									</Button>
								</div>
							</>
						)}
						<H2>{userInfo.name}</H2>
					</div>

					<div className={styles.bookings_container}>
						<H2>Booking History</H2>
						{bookingInfo.bookings && bookingInfo.bookings.length > 0 ? (
							bookingInfo.bookings.map(
								({ id, hotelId, roomId, checkIn, checkout }) => (
									<div key={id}>
										<BookingRow
											booking={{
												id,
												hotelId,
												roomId,
												checkIn,
												checkout,
											}}
											hotelsArray={hotelsArray}
											setReloadBookings={setReloadBookings}
										/>
									</div>
								),
							)
						) : (
							<>
								<h2>No active bookings</h2>
								<Link to="/">
									<Button>View hotels</Button>
								</Link>
							</>
						)}

						{lastPage > 0 && (
							<div className={styles.user_account_pagination}>
								<Button onClick={() => handlePageChange(1)}>
									⮜ First page
								</Button>
								<select
									value={limit}
									onChange={(e) => setLimit(parseInt(e.target.value))}
								>
									<option value="5">5</option>
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="50">50</option>
								</select>
								{Array(lastPage)
									.fill(0)
									.map((_, index) => (
										<Button
											key={index}
											onClick={() => handlePageChange(index + 1)}
										>
											{index + 1}
										</Button>
									))}
								<Button onClick={() => handlePageChange(lastPage)}>
									({lastPage}) Last page ⮞
								</Button>
							</div>
						)}
					</div>
				</div>
			</PrivateContent>
		</>
	);
};
