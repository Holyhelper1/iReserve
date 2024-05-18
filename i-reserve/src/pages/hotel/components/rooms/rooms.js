import PropTypes from 'prop-types';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, H2, Input, Loader, SuccessMessage } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserRole } from '../../../../selectors';
import { addRoomAsync } from '../../../../actions';
import { ROLE } from '../../../../constants';
import { Room } from './components';
import adminLogo from '../../../../image/adminLogo.png';
import styles from './rooms.module.css';
import { useResetForm } from '../../../../hooks/use-reset-form';
import { Link } from 'react-router-dom';

const addRoomFormSchema = yup.object().shape({
	name: yup
		.string()
		.required('Name is required!')
		.min(3, 'Name must be at least 3 characters')
		.max(20, 'Name must be at most 20 characters'),
	description: yup
		.string()
		.required('Add some description of the room!')
		.min(15, 'Description must be at least 15 characters')
		.max(150, 'Description must be at most 100 characters'),
	availableRooms: yup
		.number()
		.required('You must specify the number of available rooms!')
		.positive('Available rooms must be a positive number')
		.integer('Available rooms must be an integer'),
	image: yup
		.string()
		.required('You must add a valid image url!')
		.url('Image URL must be a valid URL'),
	price: yup
		.number()
		.required('You must specify the price of rooms!')
		.positive('Price must be a positive number'),
});

export const Rooms = ({ rooms, hotelId }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			description: '',
			availableRooms: '',
			image: '',
			price: '',
			hotel: hotelId,
		},
		resolver: yupResolver(addRoomFormSchema),
	});

	useResetForm(reset);

	const [openOptions, setOpenOptions] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [successAdded, setSuccessAdded] = useState(false);

	const toggleOptions = () => setOpenOptions(!openOptions);

	const dispatch = useDispatch();

	const userRole = useSelector(selectUserRole);

	const onNewRoomAdd = (hotelId, roomData) => {
		setIsLoading(true);
		dispatch(addRoomAsync(hotelId, roomData))
			.then(() => {
				setIsLoading(false);
				toggleOptions();
				reset();
				setSuccessAdded(true);
				setTimeout(() => setSuccessAdded(false), 3000);
			})
			.catch((error) => {
				setIsLoading(false);
				console.error('Error adding room:', error);
			});
	};

	const isGuestOrClient = userRole === ROLE.GUEST || userRole === ROLE.CLIENT;

	const errorAddForm =
		errors?.name?.message ||
		errors?.description?.message ||
		errors?.availableRooms?.message ||
		errors?.image?.message ||
		errors?.price?.message;

	return (
		<div className={styles.rooms_container}>
			{rooms.length === 0 && (
				<div>
					<H2>
						Unfortunately there are no available rooms, please choose another
						hotel
					</H2>
					<Link to={'/'}>
						<h1>Go to main page</h1>
					</Link>
				</div>
			)}
			{!isGuestOrClient && (
				<>
					<img className={styles.adminLogo} src={adminLogo} alt="adminLogo" />
					<div className={styles.new_room_add_form}>
						{openOptions ? (
							<>
								<Button onClick={toggleOptions}>Close options ▲</Button>
							</>
						) : (
							<>
								<Button onClick={toggleOptions}>Open options ▼</Button>
							</>
						)}
						{openOptions && (
							<div className={styles.new_room}>
								<form className={styles.new_room_form}
									onSubmit={handleSubmit(
										onNewRoomAdd.bind(this, hotelId),
									)}
								>
									<Input
										type="text"
										placeholder=" Enter room name"
										{...register('name', { required: true })}
									/>

									<Input
										type="text"
										placeholder=" Enter room description"
										{...register('description', { required: true })}
									/>

									<Input
										type="number"
										placeholder=" Enter room available rooms"
										{...register('availableRooms', {
											required: true,
										})}
									/>

									<Input
										type="text"
										placeholder=" Enter room image"
										{...register('image', { required: true })}
									/>
									<Input
										type="number"
										placeholder=" Enter room price"
										{...register('price', { required: true })}
									/>
									<Button type="submit" disabled={!!errorAddForm}>
										Add new room
									</Button>
									{errorAddForm && (
										<div className={styles.error_add_form}>
											{errorAddForm}
										</div>
									)}
								</form>
							</div>
						)}
					</div>
				</>
			)}
			<div className={styles.success_add_container}>
				{successAdded && <SuccessMessage children={'Room successfully added!'} />}
			</div>
			<div className={styles.hotels_rooms_wrapper}>
				{isLoading ? (
					<Loader />
				) : (
					rooms.map(
						({
							id,
							name,
							description,
							availableRooms,
							image,
							price,
							hotel,
						}) => (
							<Room
								key={`${id}-${hotel}`}
								id={id}
								name={name}
								description={description}
								availableRooms={availableRooms}
								image={image}
								price={price}
								hotel={hotel}
							/>
						),
					)
				)}
			</div>
		</div>
	);
};

 Rooms.prototypes = {
	rooms: PropTypes.array,
	hotelId: PropTypes.string,
 };
