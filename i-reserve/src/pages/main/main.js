import React, { useEffect, useMemo, useState, useCallback, useLayoutEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PAGINATION_LIMIT } from '../../constants/pagination-limit';
import { request } from '../../Utils/request';
import { debounce, HotelCard, Search } from './components';
import { Button, DatePicker, H2, Loader } from '../../components';
import styles from './main.module.css';
import { Link } from 'react-router-dom';
import { convertDate } from '../../Utils/convert-date';

export const Main = () => {
	const [hotels, setHotels] = useState([]);
	const [allHotels, setAllHotels] = useState([]);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [checkIn, setCheckIn] = useState(null);
	const [checkOut, setCheckOut] = useState(null);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [searchStars, setSearchStars] = useState('');
	const [shouldSearch, setShouldSearch] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedHotelId, setSelectedHotelId] = useState('');
	const [firstSelectHotel, setFirstSelectHotel] = useState(null);
	const [convertedCheckIn, setConvertedCheckIn] = useState(null);
	const [convertedCheckOut, setConvertedCheckOut] = useState(null);

	useLayoutEffect(() => {
		try {
			request('/hotels').then(({ data: { hotels } }) => {
				setAllHotels(hotels);
			});
		} catch (error) {
			console.error('Error fetching all hotels:', error);
		}
	}, []);

	useEffect(() => {
		setIsLoading(true);
		request(
			`/hotels?search=${searchPhrase}&stars=${searchStars}&page=${page}&limit=${PAGINATION_LIMIT}`,
		).then(({ data: { hotels, lastPage } }) => {
			setHotels(hotels);
			setLastPage(lastPage);
			setIsLoading(false);

			if (hotels.length > 0) {
				const firstHotel = hotels[0].id;
				setFirstSelectHotel(firstHotel);
			}
		});
		setConvertedCheckIn(convertDate(checkIn));
		setConvertedCheckOut(convertDate(checkOut));
	}, [
		page,
		shouldSearch,
		searchStars,
		searchPhrase,
		checkIn,
		checkOut,
		firstSelectHotel,
	]);

	const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

	const handleHotelSelection = (hotelId) => {
		setSelectedHotelId(hotelId);
	};

	const handleSearch = useCallback(
		({ target }) => {
			setSearchPhrase(target.value);
			startDelayedSearch(!shouldSearch);
		},
		[startDelayedSearch, shouldSearch],
	);

	const handleSearchStars = useCallback(
		({ target }) => {
			setSearchStars(target.value);
			startDelayedSearch(!shouldSearch);
		},
		[startDelayedSearch, shouldSearch],
	);

	const handlePageChange = useCallback((newPage) => {
		setPage(newPage);
	}, []);

	return (
		<div className={styles.main_container}>
			<div className={styles.main_select_container}>
				<select
					className={styles.main_select}
					placeholder="Select hotel"
					value={selectedHotelId}
					onChange={(e) => handleHotelSelection(e.target.value)}
				>
					{allHotels.map((hotel) => (
						<option key={hotel.id} value={hotel.id}>
							{hotel.name}
						</option>
					))}
				</select>
				<div className={styles.main_date_picker_container}>
					<DatePicker
						onCheckInChange={(date) => setCheckIn(date)}
						onCheckOutChange={(date) => setCheckOut(date)}
					/>
				</div>
				<Link to={`/hotel/${selectedHotelId || firstSelectHotel}`}>
					<Button>Search hotel</Button>
				</Link>
			</div>
			{checkIn && checkOut && (
				<>
					<div className={styles.main_check_in_out_info}>
						<p>{`To check availability on the selected dates: ${convertedCheckIn} - ${convertedCheckOut} push button "Search hotel"`}</p>
					</div>
				</>
			)}
			<div className={styles.slider_container}>
				<div className={styles.main_picture_slider}>
					<div className={styles.main_slider}>
						<h1>Popular hotels</h1>
						<Slider
							dots={true}
							infinite={true}
							speed={500}
							slidesToShow={2}
							slidesToScroll={1}
							autoplay={true}
							autoplaySpeed={5000}
						>
							{allHotels.map((hotel) => (
								<div key={hotel.id}>
									<Link to={`/hotel/${hotel.id}`}>
										<img src={hotel.image} alt={hotel.name} />
									</Link>
								</div>
							))}
						</Slider>
					</div>
				</div>
			</div>
			<Search
				searchPhrase={searchPhrase}
				searchStars={searchStars}
				onChange={handleSearch}
				onChangeStars={handleSearchStars}
			/>
			<div className={styles.hotels_scroll_container}>
				{isLoading ? (
					<Loader />
				) : hotels.length > 0 ? (
					<div className={styles.hotels_choices_container}>
						{hotels.map(({ id, name, image, stars, rooms }) => (
							<HotelCard
								key={id}
								id={id}
								name={name}
								image={image}
								stars={stars}
								rooms={rooms}
							/>
						))}
					</div>
				) : (
					<H2> There is no available hotels</H2>
				)}
			</div>
			{lastPage > 1 && (
				<div className={styles.main_pagination}>
					<Button onClick={() => handlePageChange(1)}>⮜ First page</Button>
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
	);
};
