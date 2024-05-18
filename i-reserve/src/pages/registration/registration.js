import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './registration.module.css';
import { useState } from 'react';
import { setUser } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { H2, Button, Input } from '../../components';
import { request } from '../../Utils/request';
import { useResetForm } from '../../hooks/use-reset-form';
import { selectUserRole } from '../../selectors/select-user-role';
import { ROLE } from '../../constants';
import { Navigate } from 'react-router';
import { selectUserData } from '../../selectors';

const authFormSchema = yup.object().shape({
	name: yup.string(),
	login: yup
		.string()
		.required('Login is required!')
		.matches(
			/^\w+$/,
			'Login must contain only letters and numbers you can use special characters',
		)
		.min(4, 'Login must be at least 4 characters')
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
	passcheck: yup
		.string()
		.required('Repeat password is required!')
		.oneOf([yup.ref('password'), null], 'Passwords must match'),
});
export const Registration = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			login: '',
			password: '',
			passcheck: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const [serverError, setServerError] = useState(null);

	const dispatch = useDispatch();

	const user = useSelector(selectUserData);

	const roleId = useSelector(selectUserRole);

	useResetForm(reset);

	const onSubmit = ({ name, login, password }) => {
		request('/register', 'POST', { name, login, password }).then(
			({ error, user }) => {
				if (error) {
					setServerError(`Error of request : ${error}`);
					return;
				}
				dispatch(setUser(user));
				sessionStorage.setItem('userData', JSON.stringify(user));
			},
		);
	};

	const formError = errors?.login?.message || errors?.passcheck?.message;

	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to={`/user_account/${user.login}/${user.id}`} />;
	}

	return (
		<div className={styles.registration_page}>
			<div className={styles.registration_container}>
				<H2>Registration</H2>
				<form
					className={styles.registration_form}
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						type="text"
						placeholder="Name..."
						{...register('name', { onChange: () => setServerError(null) })}
					/>
					<Input
						type="text"
						placeholder="Login..."
						{...register('login', { onChange: () => setServerError(null) })}
					/>

					<Input
						type="password"
						placeholder="Password..."
						{...register('password', {
							onChange: () => setServerError(null),
						})}
					/>
					<Input
						type="password"
						placeholder="Repeat password..."
						{...register('passcheck', {
							onChange: () => setServerError(null),
						})}
					/>
					<div className={styles.registration_buttons}>
						<Button type="submit" disabled={!!formError}>
							Submit
						</Button>
					</div>
				</form>
				{errorMessage && (
					<div className={styles.error_message}>{errorMessage}</div>
				)}
			</div>
		</div>
	);
};
