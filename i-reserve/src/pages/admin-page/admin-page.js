import React, { useState, useEffect } from 'react';
import styles from './admin-page.module.css';
import { Button, DatePicker, Loader, PrivateContent } from '../../components';
import { BookingList, ControlUsers } from './components';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserRole } from '../../selectors';
import { checkAccess } from '../../Utils/check-access';
import { ROLE } from '../../constants';
import { request } from '../../Utils/request';
import { loadHotelAsync } from '../../actions';

export const AdminPage = () => {
	const [allUsers, setAllUsers] = useState([]);
	const [openUserMenu, setOpenUserMenu] = useState(false);
	const [usersInfo, setUsersInfo] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [everyHotelsInfo, setEveryHotelsInfo] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();

	const userRole = useSelector(selectUserRole);

	useEffect(() => {
		if (!checkAccess([ROLE.ADMIN], userRole)) {
			return;
		}
		if ((startDate && endDate) || openUserMenu) {
			setIsLoading(true);
			request('/users')
				.then((usersData) => {
					setAllUsers(usersData.data);
					const userIdsWithBookings = usersData.data
						.filter((user) => user.bookingHistory.length > 0)
						.map((user) => user.id);

					const userPromises = userIdsWithBookings.map((userId) =>
						request(`/users/${userId}`),
					);

					Promise.all(userPromises)
						.then((usersData) => {
							const mergedUsersData = usersData.flatMap(
								(userData) => userData.data,
							);
							setUsersInfo(mergedUsersData);

							const hotelIds = [
								...new Set(
									mergedUsersData.flatMap((user) =>
										user.bookingHistory.map(
											(bookingId) => bookingId.hotelId,
										),
									),
								),
							];

							const hotelPromises = hotelIds.map((hotelId) =>
								dispatch(loadHotelAsync(hotelId)),
							);

							Promise.all(hotelPromises)
								.then((hotelData) => {
									const mergedHotelData = hotelData.flatMap(
										(data) => data.data,
									);
									setEveryHotelsInfo(mergedHotelData);
									setIsLoading(false);
								})
								.catch((error) => {
									console.error(
										'Ошибка при загрузке данных отелей:',
										error,
									);
									setIsLoading(false);
								});
						})
						.catch((error) => {
							console.error(
								'Ошибка при загрузке данных пользователей:',
								error,
							);
						});
				})
				.catch((error) => {
					console.error('Ошибка при загрузке данных:', error);
				});
		}
	}, [startDate, endDate, userRole, dispatch, openUserMenu]);

	return (
		<>
			<PrivateContent access={[ROLE.ADMIN, ROLE.MODERATOR]}>
				<div className={styles.admin_page_container}>
					<div className={styles.container}>
						<div className={styles.content}>
							<h2 className={styles.heading}>Hotel manager</h2>
							<div className={styles.datePickerContainer}>
								<label className={styles.label}>Select date range:</label>
								<DatePicker
									onCheckInChange={(date) => setStartDate(date)}
									onCheckOutChange={(date) => setEndDate(date)}
								/>
							</div>
							{isLoading ? (
								<Loader />
							) : startDate && endDate ? (
								usersInfo.length > 0 && everyHotelsInfo.length > 0 ? (
									<BookingList
										usersInfo={usersInfo}
										everyHotelsInfo={everyHotelsInfo}
										startDate={startDate}
										endDate={endDate}
									/>
								) : (
									<p className={styles.message}>No data to show</p>
								)
							) : (
								<p className={styles.message}>
									Select dates to see booking details
								</p>
							)}
						</div>
					</div>
					<div className={styles.control_users_container}>
						<div className={styles.control_users_button}>
							<Button onClick={() => setOpenUserMenu(!openUserMenu)}>
								Control users
							</Button>
						</div>
						{openUserMenu && <ControlUsers allUsers={allUsers} />}
					</div>
				</div>
			</PrivateContent>
		</>
	);
};
