import { Route, Routes, useLocation } from 'react-router-dom';
import styles from './booking-website.module.css';
import { Footer, Header } from './components';
import { useDispatch } from 'react-redux';
import { useLayoutEffect } from 'react';
import { setUser } from './actions';
import { routes } from './routes/routes';
import { Modal } from './components';

export const BookingWebsite = () => {
	const location = useLocation();
	const isMainPage = location.pathname === '/';
	const isRegistrationPage = location.pathname === '/registration';

	const dispatch = useDispatch();
	useLayoutEffect(() => {
		const currentUserDataJSON = sessionStorage.getItem('userData');
		if (!currentUserDataJSON) {
			return;
		}

		const currentUserData = JSON.parse(currentUserDataJSON);
		dispatch(
			setUser({
				...currentUserData,
				roleId: Number(currentUserData.roleId),
			}),
		);
	}, [dispatch]);

	return (
		<div className={styles.container}>
			<Header />
			{(isMainPage || isRegistrationPage) && (
				<div>
					<div className={styles.test}>When's your new adventure?</div>
				</div>
			)}
			<Routes>
				{routes.map((route) => (
					<Route key={route.path} path={route.path} element={route.element} />
				))}
			</Routes>
			<Footer />
			<Modal />
		</div>
	);
};
