import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './modal-auth.module.css';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { setUser } from '../../actions';
import { H2, Button, Input } from '../../components';
import { Link } from 'react-router-dom';
import { request } from '../../Utils/request';
import { useResetForm } from '../../hooks/use-reset-form';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Login is required!')
		.matches(
			/^\w+$/,
			'Login must contain only letters and numbers you can use special characters',
		)
		.min(3, 'Login must be at least 6 characters')
		.max(20, 'Login must be at most 20 characters'),
	password: yup
		.string()
		.required('Password is required!')
		.matches(
			/^[\w@#$%^&*]+$/,
			'Password must contain only letters and numbers and special characters @#$%^&*',
		)
		.min(8, 'Password must be at least 8 characters')
		.max(30, 'Password must be at most 30 characters'),
});

export const ModalAuth = ({ isModalOpen, onConfirm, onCancel }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const [serverError, setServerError] = useState(null);

	const dispatch = useDispatch();

	useResetForm(reset);

	const onSubmit = ({ login, password }) => {
		request('/login', 'POST', { login, password }).then(({ error, user }) => {
			if (error) {
				setServerError(`Error of request: ${error}`);
				return;
			}

			dispatch(setUser(user));
			sessionStorage.setItem('userData', JSON.stringify(user));
			onCancel();
		});
	};

	const formError = errors?.login?.message || errors?.login?.message;
	const errorMessage = formError || serverError;

	if (!isModalOpen) {
		return null;
	}

	return (
		<div className={styles.modal_auth_container}>
			<div className={styles.overlay}></div>
			<div className={styles.box}>
				<H2 className={styles.h3_text_auth}>Authorization</H2>
				<form className={styles.auth_form} onSubmit={handleSubmit(onSubmit)}>
					<Input
						type="text"
						placeholder="Login..."
						{...register('login', { onChange: () => setServerError(null) })}
					/>
					{errors.login && (
						<div className={styles.error_message}>{errors.login.message}</div>
					)}
					<Input
						type="password"
						placeholder="Password..."
						{...register('password', {
							onChange: () => setServerError(null),
						})}
					/>
					{errors.password && (
						<div className={styles.error_message}>
							{errors.password.message}
						</div>
					)}
					{errorMessage && (
						<div className={styles.error_message}>{errorMessage}</div>
					)}
					<div className={styles.buttons}>
						<Button
							disabled={!!formError}
							type="submit"
							onClick={() => onConfirm()}
						>
							Submit
						</Button>
						<Button onClick={() => onCancel()}>Cancel</Button>
					</div>
				</form>
				<Link to="/registration">
					<h3 className={styles.h3_text_auth} onClick={() => onCancel()}>
						I want to register
					</h3>
				</Link>
			</div>
		</div>
	);
};

ModalAuth.propTypes = {
	isModalOpen: PropTypes.bool.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
};
