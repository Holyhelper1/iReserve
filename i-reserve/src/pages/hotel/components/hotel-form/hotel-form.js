import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveHotelAsync } from '../../../../actions';
import styles from './hotel-form.module.css';
import { Button, Input } from '../../../../components';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResetForm } from '../../../../hooks/use-reset-form';

const HotelFormSchema = yup.object().shape({
	name: yup
		.string()
		.required('Name is required!')
		.min(3, 'Name must be at least 3 characters')
		.max(20, 'Name must be at most 20 characters'),
	description: yup
		.string()
		.required('Description is required!')
		.min(15, 'Description must be at least 15 characters')
		.max(150, 'Description must be at most 150 characters'),
	image: yup
		.string()
		.required('Image URL is required!')
		.url('Image URL must be a valid URL'),
	stars: yup
		.number()
		.required('Stars are required!')
		.positive('Stars must be a positive number')
		.min(1, 'Stars must be at least 1')
		.max(5, 'Stars must be at most 5')
		.integer('Stars must be an integer'),
});

export const HotelForm = ({ hotel: { id, name, description, image, stars } }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: name || '',
			description: description || '',
			image: image || '',
			stars: stars || 1,
		},
		resolver: yupResolver(HotelFormSchema),
	});

	useResetForm(reset);

	const contentRef = useRef(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = (data) => {
		dispatch(
			saveHotelAsync(id, {
				name: data.name,
				description: data.description,
				image: data.image,
				stars: Number(data.stars),
			}),
		).then(({ id }) => navigate(`/hotel/${id}`));
	};

	const errorAddForm =
		errors?.name?.message ||
		errors?.description?.message ||
		errors?.image?.message ||
		errors?.stars?.message;

	return (
		<div className={styles.form_wrapper}>
			<form className={styles.form_content} onSubmit={handleSubmit(onSubmit)}>
				<h1 className={styles.form_title}>Edit hotel form</h1>
				<Input
					type="text"
					placeholder="Hotel name..."
					{...register('name', { required: true })}
				/>
				<Input
					type="text"
					placeholder="Hotel description..."
					{...register('description', { required: true })}
				/>
				<Input
					type="text"
					placeholder="Hotel main image..."
					{...register('image', { required: true })}
				/>
				<div>
					<div>Hotel stars</div>
					<Input
						type="number"
						placeholder="Hotel stars..."
						{...register('stars', { required: true })}
					/>
				</div>
				<Button type="submit" disabled={!!errorAddForm}>
					Save changes
				</Button>
			</form>
			{errorAddForm && <div className={styles.error_add_form}>{errorAddForm}</div>}
			<div
				ref={contentRef}
				contentEditable={true}
				suppressContentEditableWarning={true}
			>
				{' '}
			</div>
		</div>
	);
};

HotelForm.propTypes = {
	hotel: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
		stars: PropTypes.number.isRequired,
	}).isRequired,
};
