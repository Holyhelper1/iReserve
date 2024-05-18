import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useParams } from 'react-router-dom';
import { RESET_HOTEL_DATA, loadHotelAsync } from '../../actions';
import { Error, PrivateContent } from '../../components';
import { ROLE } from '../../constants';
import { selectHotel } from '../../selectors/select-hotel';
import { HotelContent, HotelForm, Rooms } from './components';
import styles from './hotel-page.module.css';

export const HotelPage = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const params = useParams();
	const isCreating = !!useMatch('/hotel');
	const isEditing = !!useMatch('/hotel/:id/edit');

	const hotel = useSelector(selectHotel);

	useLayoutEffect(() => {
		dispatch(RESET_HOTEL_DATA);
	}, [dispatch, isCreating]);

	useEffect(() => {
		if (isCreating) {
			setIsLoading(false);
			return;
		}

		dispatch(loadHotelAsync(params.id)).then((hotelData) => {
			setError(hotelData.error);
			setIsLoading(false);
		});
	}, [dispatch, params.id, isCreating]);

	if (isLoading) {
		return null;
	}

	const SpecificHotelPage =
		isCreating || isEditing ? (
			<PrivateContent access={[ROLE.ADMIN]} serverError={error}>
				<div className={styles.container}>
					<HotelForm hotel={hotel} />
				</div>
			</PrivateContent>
		) : (
			<div className={styles.hotel_rooms_main_container}>
				<div className={styles.hotel_container}>
					<HotelContent hotel={hotel} />
				</div>
				<div className={styles.rooms_container}>
					<Rooms rooms={hotel.rooms} hotelId={hotel.id} />
				</div>
			</div>
		);
	return error ? <Error error={error} /> : SpecificHotelPage;
};
